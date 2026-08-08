// src/types/database.ts — EXTRAIT à remplacer

export type EvenementType = "recurrent" | "special";
export type EvenementStatut = "planifie" | "publie" | "annule";

export interface Evenement {
  id: string;
  titre: string;
  description: string;
  date_debut: string;
  date_fin: string | null;
  lieu: string | null;
  type: EvenementType;
  image_url: string | null;
  statut: EvenementStatut;
  inscription_requise: boolean; // US-7 — non géré dans MC-9, préservé
  date_creation: string;
  date_modification: string;
}