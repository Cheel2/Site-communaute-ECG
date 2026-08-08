/**
 * Types de base de données — Alignement strict Master §5.1 (12 tables).
 *
 * Conventions :
 * - UUID PostgreSQL → string (sérialisé par le client Supabase).
 * - TEXT / VARCHAR → string.
 * - INT / INTEGER → number.
 * - NUMERIC → number (précision suffisante pour des prix affichés).
 * - TIMESTAMPTZ → string (ISO 8601 complet : "2026-08-09T12:34:56.789Z").
 * - DATE → string (ISO 8601 date seule : "2026-08-09").
 * - CHECK IN (...) → union de littéraux TypeScript strictes.
 *
 * Source de vérité unique : les interfaces exportées ici servent à l'ensemble
 * du code (features, pages publiques, admin, actions, composants).
 */

// --- Enums / unions littérales ---

export type ContenuStatut = 'publie' | 'non_publie';

export type EvenementType = 'recurrent' | 'special';

// NOTE : MC-9 a ajouté une colonne `statut` à la table `evenement` (migration 007)
// sans spécifier de CHECK explicite. Typage volontairement `string` pour éviter
// de contraindre incorrectement en l'absence de définition DB.
export type EvenementStatut = string;

export type UtilisateurRole = 'total' | 'lecture_seule';

export type UtilisateurStatut = 'actif' | 'desactive';

export type StatistiqueType =
  | 'visite_site'
  | 'vue_contenu'
  | 'clic_amazon'
  | 'clic_whatsapp_livre'
  | 'formulaire_partenariat'
  | 'formulaire_contact';

// --- Interfaces tables ---

export interface Rubrique {
  id: string;
  nom: string;
  ordre_affichage: number;
  date_creation: string;
  date_modification: string;
}

export interface Contenu {
  id: string;
  titre: string;
  rubrique_id: string;
  texte: string;
  image_url: string | null;
  statut: ContenuStatut;
  mis_en_avant: boolean;
  compteur_vues: number;
  date_creation: string;
  date_modification: string;
  date_publication: string | null;
}

export interface Livre {
  id: string;
  titre: string;
  description: string;
  prix: number;
  image_couverture_url: string | null;
  lien_amazon: string | null;
  lien_whatsapp: string | null;
  compteur_clics_amazon: number;
  compteur_clics_whatsapp: number;
  date_creation: string;
  date_modification: string;
}

export interface Evenement {
  id: string;
  titre: string;
  description: string;
  date_debut: string;
  date_fin: string | null;
  lieu: string | null;
  image_url: string | null;
  statut: EvenementStatut;
  inscription_requise: boolean;
  type: EvenementType;
  date_creation: string;
  date_modification: string;
}

export interface Banniere {
  id: string;
  image_url: string | null;
  message: string;
  date_modification: string;
}

export interface Partenaire {
  id: string;
  nom: string;
  email: string;
  pays: string;
  date_soumission: string;
  statut: string;
}

export interface Contact {
  id: string;
  nom: string;
  email: string;
  message: string;
  date_soumission: string;
}

export interface Utilisateur {
  id: string; // FK → auth.users(id)
  email: string;
  role: UtilisateurRole;
  statut: UtilisateurStatut;
  date_creation: string;
  date_modification: string;
}

export interface Parametre {
  id: string;
  cle: string;
  valeur: string;
}

export interface Statistique {
  id: string;
  type: StatistiqueType;
  valeur: number;
  date: string;
}

export interface Brouillon {
  id: string;
  contenu_id: string | null; // FK SET NULL
  titre: string;
  rubrique_id: string | null; // FK SET NULL
  texte: string;
  image_url: string | null;
  date_derniere_sauvegarde: string;
}

export interface PageSeo {
  id: string;
  chemin: string;
  titre: string;
  meta_description: string;
  mots_cles: string;
  date_modification: string;
}