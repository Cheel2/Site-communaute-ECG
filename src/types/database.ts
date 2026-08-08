// src/types/database.ts — Ajouter à la fin du fichier

export interface Contenu {
  id: string;
  titre: string;
  rubrique_id: string;
  texte: string;
  image_url: string | null;
  statut: 'publie' | 'non_publie';
  mis_en_avant: boolean;
  compteur_vues: number;
  date_creation: string;
  date_modification: string;
  date_publication: string | null;
}

export interface Rubrique {
  id: string;
  nom: string;
  ordre_affichage: number;
  date_creation: string;
  date_modification: string;
}

export interface Statistique {
  id: string;
  type: 'visite_site' | 'vue_contenu' | 'clic_amazon' | 'clic_whatsapp_livre' | 'formulaire_partenariat' | 'formulaire_contact';
  valeur: number;
  date: string;
}