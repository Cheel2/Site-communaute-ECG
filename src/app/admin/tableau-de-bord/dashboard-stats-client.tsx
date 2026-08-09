// src/app/admin/tableau-de-bord/dashboard-stats-client.tsx
// Client Component — Affichage des statistiques du tableau de bord.
// États UI : loading (skeletons), error (message + retry), success (cartes + listes).
// Zéro emoji — indicateurs textuels purs uniquement.

"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getDashboardStats,
  getTopContenus,
  getTopLivres,
  type DashboardStats,
  type TopContenu,
  type TopLivre,
} from "@/features/dashboard/actions";

// ---------------------------------------------------------------------------
// Types internes
// ---------------------------------------------------------------------------

type EtatChargement = "idle" | "loading" | "error" | "success";

interface DonneesDashboard {
  stats: DashboardStats;
  topContenus: TopContenu[];
  topLivres: TopLivre[];
}

// ---------------------------------------------------------------------------
// Composant principal
// ---------------------------------------------------------------------------

export default function DashboardStatsClient() {
  const [etat, setEtat] = useState<EtatChargement>("idle");
  const [donnees, setDonnees] = useState<DonneesDashboard | null>(null);
  const [messageErreur, setMessageErreur] = useState("");

  const chargerDonnees = useCallback(async () => {
    setEtat("loading");
    setMessageErreur("");

    try {
      const [statsRes, topContenusRes, topLivresRes] = await Promise.all([
        getDashboardStats(),
        getTopContenus(5),
        getTopLivres(5),
      ]);

      // Vérifier erreurs
      if (statsRes.error) {
        setMessageErreur(statsRes.error.message);
        setEtat("error");
        return;
      }
      if (topContenusRes.error) {
        setMessageErreur(topContenusRes.error.message);
        setEtat("error");
        return;
      }
      if (topLivresRes.error) {
        setMessageErreur(topLivresRes.error.message);
        setEtat("error");
        return;
      }

      setDonnees({
        stats: statsRes.data,
        topContenus: topContenusRes.data,
        topLivres: topLivresRes.data,
      });
      setEtat("success");
    } catch {
      setMessageErreur("Une erreur inattendue est survenue.");
      setEtat("error");
    }
  }, []);

  useEffect(() => {
    void chargerDonnees();
  }, [chargerDonnees]);

  // --- État : Loading (skeletons sobres) ---
  if (etat === "idle" || etat === "loading") {
    return <DashboardSkeleton />;
  }

  // --- État : Error + Retry ---
  if (etat === "error") {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className="rounded-md border border-red-200 bg-red-50 p-6 text-center"
      >
        <p className="text-sm text-red-700">{messageErreur}</p>
        <button
          type="button"
          onClick={() => void chargerDonnees()}
          className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Réessayer
        </button>
      </div>
    );
  }

  // --- État : Success ---
  if (!donnees) return null;

  const { stats, topContenus, topLivres } = donnees;

  return (
    <section aria-label="Statistiques du tableau de bord" className="space-y-6">
      {/* Grille de cartes statistiques */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <CarteStat
          libelle="Visites (30 j)"
          valeur={stats.visites30j}
        />
        <CarteStat
          libelle="Vues contenus (30 j)"
          valeur={stats.vuesContenus30j}
          secondaire={`Total : ${stats.totalVuesContenus}`}
        />
        <CarteStat
          libelle="Clics Amazon (30 j)"
          valeur={stats.clicsAmazon30j}
          secondaire={`Total : ${stats.totalClicsAmazon}`}
        />
        <CarteStat
          libelle="Clics WhatsApp (30 j)"
          valeur={stats.clicsWhatsapp30j}
          secondaire={`Total : ${stats.totalClicsWhatsapp}`}
        />
        <CarteStat
          libelle="Formulaires (30 j)"
          valeur={
            stats.formulairesPartenariat30j + stats.formulairesContact30j
          }
          secondaire={`Partenariat : ${stats.formulairesPartenariat30j} — Contact : ${stats.formulairesContact30j}`}
        />
      </div>

      {/* Listes Top 5 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ListeTop
          titre="Top 5 Contenus (vues)"
          items={topContenus.map((c) => ({
            id: c.id,
            libelle: c.titre,
            valeur: `${c.compteur_vues} vues`,
          }))}
          messageVide="Aucun contenu publié."
        />
        <ListeTop
          titre="Top 5 Livres (clics)"
          items={topLivres.map((l) => ({
            id: l.id,
            libelle: l.titre,
            valeur: `${l.compteur_clics_amazon + l.compteur_clics_whatsapp} clics`,
          }))}
          messageVide="Aucun livre enregistré."
        />
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Sous-composants
// ---------------------------------------------------------------------------

function CarteStat({
  libelle,
  valeur,
  secondaire,
}: {
  libelle: string;
  valeur: number;
  secondaire?: string;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {libelle}
      </p>
      <p className="mt-1 text-2xl font-semibold text-gray-900">
        {valeur.toLocaleString("fr-FR")}
      </p>
      {secondaire && (
        <p className="mt-1 text-xs text-gray-400">{secondaire}</p>
      )}
    </div>
  );
}

function ListeTop({
  titre,
  items,
  messageVide,
}: {
  titre: string;
  items: { id: string; libelle: string; valeur: string }[];
  messageVide: string;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700">{titre}</h3>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-gray-400">{messageVide}</p>
      ) : (
        <ol className="mt-3 space-y-2">
          {items.map((item, index) => (
            <li
              key={item.id}
              className="flex items-center justify-between text-sm"
            >
              <span className="flex items-center gap-2 truncate text-gray-700">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-500">
                  {index + 1}
                </span>
                <span className="truncate">{item.libelle}</span>
              </span>
              <span className="ml-2 shrink-0 text-xs text-gray-500">
                {item.valeur}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Skeleton (état loading)
// ---------------------------------------------------------------------------

function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-label="Chargement des statistiques">
      {/* Skeleton cartes */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg border border-gray-200 bg-white p-4"
          >
            <div className="h-3 w-24 rounded bg-gray-200" />
            <div className="mt-2 h-7 w-16 rounded bg-gray-300" />
            <div className="mt-2 h-2 w-20 rounded bg-gray-100" />
          </div>
        ))}
      </div>
      {/* Skeleton listes */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg border border-gray-200 bg-white p-4"
          >
            <div className="h-4 w-40 rounded bg-gray-200" />
            <div className="mt-4 space-y-3">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="h-3 w-full rounded bg-gray-100" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}