'use client';

import { useEffect } from 'react';
import { trackVueContenu } from '@/features/tracking/actions';

// [FR-3] Fenêtre anti-spam : une vue par contenu par session navigateur,
// renouvelable après 5 minutes. Stockée en sessionStorage (zéro session DB).
const FENETRE_ANTI_SPAM_MS = 5 * 60 * 1000;

// Garde module-level contre la double-invocation des effets en développement
// (React 19 StrictMode) : sans elle, deux montages consécutifs déclencheraient
// deux incréments avant que sessionStorage ne soit écrit.
const contenusDejaSuivis = new Set<string>();

type ViewTrackerProps = {
  contenuId: string;
};

export function ViewTracker({ contenuId }: ViewTrackerProps) {
  useEffect(() => {
    const cleSession = `vue_contenu_${contenuId}`;

    if (contenusDejaSuivis.has(contenuId)) {
      return;
    }

    const enregistrerVue = async () => {
      try {
        const dernierEnregistrement = window.sessionStorage.getItem(cleSession);

        if (dernierEnregistrement !== null) {
          const horodatage = Number(dernierEnregistrement);

          if (
            !Number.isNaN(horodatage) &&
            Date.now() - horodatage < FENETRE_ANTI_SPAM_MS
          ) {
            return;
          }
        }

        contenusDejaSuivis.add(contenuId);

        const resultat = await trackVueContenu(contenuId);

        if (resultat.error) {
          // Échec serveur : ne pas marquer la session pour permettre un retry.
          contenusDejaSuivis.delete(contenuId);
          return;
        }

        window.sessionStorage.setItem(cleSession, String(Date.now()));
      } catch {
        // Tracking silencieux : ne jamais bloquer la lecture du contenu.
        contenusDejaSuivis.delete(contenuId);
      }
    };

    void enregistrerVue();
  }, [contenuId]);

  return null;
}