// src/features/dashboard/actions.ts
// Server Actions — Tableau de bord statistique (T-053 à T-055).
//
// CHOIX D'AGRÉGATION :
// L'agrégation est effectuée côté serveur (Server Action) après filtrage
// Supabase sur la fenêtre 30 jours. Pour le volume MVP (< 10K lignes stats),
// le transfert réseau reste négligeable (~50 Ko max).
// À l'échelle (v2+, > 100K lignes), une fonction PostgreSQL RPC
// (SELECT type, SUM(valeur) ... GROUP BY type) éliminerait le transfert
// des lignes individuelles. Ce seuil est documenté dans Master §8.2.
//
// Les compteurs GLOBAUX (contenu.compteur_vues, livre.compteur_clics_*)
// sont calculés séparément car ils représentent le cumul historique total,
// indépendant de la fenêtre glissante 30 jours de la table `statistique`.
//
// CORRECTION MC-18 (rev 2) — réalignment des sources de métriques :
// - Le type réel inséré par la migration 009 (MC-15) est `clic_whatsapp_livre`
//   (jamais `clic_whatsapp`) : TYPES_STATISTIQUE et l'agrégat corrigés.
// - MC-17 (contact/partenariat) n'insère AUCUNE ligne dans `statistique` :
//   les métriques formulaires sont comptées depuis les tables sources
//   `contact` / `partenaire` sur la fenêtre 30 jours.

"use server";

import { createClient } from "@/lib/supabase/server";
import { erreurInterne, erreurNonAutorise } from "@/lib/api-errors";
import type { StatistiqueType } from "@/types/database";
import type { ApiResponse } from "@/types/api";

// ---------------------------------------------------------------------------
// Types de retour
// ---------------------------------------------------------------------------

export interface DashboardStats {
  /** Fenêtre glissante 30 jours (table statistique) */
  visites30j: number;
  vuesContenus30j: number;
  clicsAmazon30j: number;
  clicsWhatsapp30j: number;
  /** Fenêtre 30 jours — comptées depuis les tables contact / partenaire */
  formulairesPartenariat30j: number;
  formulairesContact30j: number;
  /** Compteurs globaux historiques (tables contenu / livre) */
  totalVuesContenus: number;
  totalClicsAmazon: number;
  totalClicsWhatsapp: number;
}

export interface TopContenu {
  id: string;
  titre: string;
  compteur_vues: number;
}

export interface TopLivre {
  id: string;
  titre: string;
  compteur_clics_amazon: number;
  compteur_clics_whatsapp: number;
}

// ---------------------------------------------------------------------------
// Constantes
// ---------------------------------------------------------------------------

const FENETRE_JOURS = 30;

/**
 * Types de la table statistique — alignés EXACTEMENT sur l'union
 * `StatistiqueType` de src/types/database.ts (Master §5.1, CHECK IN 6 valeurs).
 * Le typage `readonly StatistiqueType[]` garantit l'alignement à la compilation.
 *
 * Réalité des chemins d'insertion à ce jour :
 * - `vue_contenu` : MC-14 (trackVueContenu) ;
 * - `clic_amazon` : MC-15 (trackClicAmazon) ;
 * - `clic_whatsapp_livre` : MC-15 (migration 009, RPC atomique) ;
 * - `visite` : chemin d'insertion (tracking visites) livré ultérieurement —
 *   la métrique visites30j vaut 0 en attendant (conservée par anticipation) ;
 * - `formulaire_contact` / `formulaire_partenariat` : non insérés par MC-17 —
 *   les métriques formulaires sont comptées depuis les tables sources (ci-dessous).
 */
const TYPES_STATISTIQUE: readonly StatistiqueType[] = [
  "visite",
  "vue_contenu",
  "clic_amazon",
  "clic_whatsapp_livre",
  "formulaire_contact",
  "formulaire_partenariat",
];

// ---------------------------------------------------------------------------
// getDashboardStats
// ---------------------------------------------------------------------------

export async function getDashboardStats(): Promise<
  ApiResponse<DashboardStats>
> {
  try {
    const supabase = await createClient();

    // AUTHENTIFICATION — cohérence avec les mutations admin
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return erreurNonAutorise();
    }

    // Fenêtre glissante 30 jours
    const dateLimite = new Date();
    dateLimite.setDate(dateLimite.getDate() - FENETRE_JOURS);
    const dateLimiteISO = dateLimite.toISOString();

    // --- Requêtes parallèles (5 sources distinctes) ---
    const [
      statsResult,
      contenusResult,
      livresResult,
      contactsCountResult,
      partenairesCountResult,
    ] = await Promise.all([
      // 1. Table statistique — filtrée sur 30 derniers jours
      supabase
        .from("statistique")
        .select("type, valeur")
        .gte("date", dateLimiteISO),

      // 2. Total global vues contenus (hors fenêtre 30j)
      supabase.from("contenu").select("compteur_vues"),

      // 3. Totaux globaux clics livres (hors fenêtre 30j)
      supabase
        .from("livre")
        .select("compteur_clics_amazon, compteur_clics_whatsapp"),

      // 4. Formulaires contact 30j — comptés depuis la table source
      //    (MC-17 n'insère aucune ligne dans statistique)
      supabase
        .from("contact")
        .select("id", { count: "exact", head: true })
        .gte("date_soumission", dateLimiteISO),

      // 5. Formulaires partenariat 30j — comptés depuis la table source
      supabase
        .from("partenaire")
        .select("id", { count: "exact", head: true })
        .gte("date_soumission", dateLimiteISO),
    ]);

    // Gestion erreurs Supabase
    if (statsResult.error) return erreurInterne(statsResult.error);
    if (contenusResult.error) return erreurInterne(contenusResult.error);
    if (livresResult.error) return erreurInterne(livresResult.error);
    if (contactsCountResult.error) return erreurInterne(contactsCountResult.error);
    if (partenairesCountResult.error)
      return erreurInterne(partenairesCountResult.error);

    // --- Agrégation serveur des stats 30j par type ---
    const aggregats: Record<string, number> = {};
    for (const type of TYPES_STATISTIQUE) {
      aggregats[type] = 0;
    }
    for (const ligne of statsResult.data ?? []) {
      const type = ligne.type as string;
      if (type in aggregats) {
        aggregats[type] += ligne.valeur ?? 0;
      }
    }

    // --- Somme compteurs globaux contenus ---
    const totalVuesContenus = (contenusResult.data ?? []).reduce(
      (somme: number, row: { compteur_vues: number | null }) =>
        somme + (row.compteur_vues ?? 0),
      0
    );

    // --- Somme compteurs globaux livres ---
    let totalClicsAmazon = 0;
    let totalClicsWhatsapp = 0;
    for (const row of livresResult.data ?? []) {
      totalClicsAmazon += row.compteur_clics_amazon ?? 0;
      totalClicsWhatsapp += row.compteur_clics_whatsapp ?? 0;
    }

    const stats: DashboardStats = {
      // `visite` conservé car présent dans StatistiqueType ; chemin
      // d'insertion du tracking visites livré ultérieurement (vaut 0 en attendant).
      visites30j: aggregats["visite"] ?? 0,
      vuesContenus30j: aggregats["vue_contenu"] ?? 0,
      clicsAmazon30j: aggregats["clic_amazon"] ?? 0,
      // Type réel inséré en production : `clic_whatsapp_livre` (migration 009).
      clicsWhatsapp30j: aggregats["clic_whatsapp_livre"] ?? 0,
      // Sources : tables contact / partenaire (fenêtre 30j), pas statistique.
      formulairesContact30j: contactsCountResult.count ?? 0,
      formulairesPartenariat30j: partenairesCountResult.count ?? 0,
      totalVuesContenus,
      totalClicsAmazon,
      totalClicsWhatsapp,
    };

    return { data: stats };
  } catch (erreur: unknown) {
    return erreurInterne(erreur);
  }
}

// ---------------------------------------------------------------------------
// getTopContenus
// ---------------------------------------------------------------------------

export async function getTopContenus(
  limite = 5
): Promise<ApiResponse<TopContenu[]>> {
  try {
    const supabase = await createClient();

    // AUTHENTIFICATION
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return erreurNonAutorise();
    }

    // Requête ordonnée par compteur_vues DESC — agrégation SQL native
    const { data, error } = await supabase
      .from("contenu")
      .select("id, titre, compteur_vues")
      .eq("statut", "publie")
      .order("compteur_vues", { ascending: false })
      .limit(limite);

    if (error) return erreurInterne(error);

    return { data: (data ?? []) as TopContenu[] };
  } catch (erreur: unknown) {
    return erreurInterne(erreur);
  }
}

// ---------------------------------------------------------------------------
// getTopLivres
// ---------------------------------------------------------------------------

export async function getTopLivres(
  limite = 5
): Promise<ApiResponse<TopLivre[]>> {
  try {
    const supabase = await createClient();

    // AUTHENTIFICATION
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return erreurNonAutorise();
    }

    // Supabase JS ne supporte pas ORDER BY sur colonne calculée.
    // Stratégie : fetch tous les livres (volume faible < 20), tri serveur
    // par somme des clics, puis truncation à `limite`.
    const { data, error } = await supabase
      .from("livre")
      .select("id, titre, compteur_clics_amazon, compteur_clics_whatsapp");

    if (error) return erreurInterne(error);

    const livres = (data ?? []) as TopLivre[];
    livres.sort(
      (a, b) =>
        (b.compteur_clics_amazon + b.compteur_clics_whatsapp) -
        (a.compteur_clics_amazon + a.compteur_clics_whatsapp)
    );

    return { data: livres.slice(0, limite) };
  } catch (erreur: unknown) {
    return erreurInterne(erreur);
  }
}