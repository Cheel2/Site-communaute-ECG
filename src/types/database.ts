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