export type EvenementType = 'recurrent' | 'special';

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
  statut: 'publie' | 'non_publie';
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
  type: EvenementType;
  inscription_requise: boolean;
  image_url: string | null;
  statut: string;
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
  id: string;
  email: string;
  role: 'total' | 'lecture_seule';
  statut: 'actif' | 'desactive';
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
  type: string;
  valeur: number;
  date: string;
}

export interface Brouillon {
  id: string;
  contenu_id: string | null;
  titre: string;
  rubrique_id: string | null;
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