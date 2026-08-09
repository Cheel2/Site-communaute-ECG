"use client";

import { useEffect, useRef, useState } from "react";

// Constante nommée : zéro magic string pour la clé localStorage.
const COOKIE_CONSENT_KEY = "cookie_consent_pastoral";
const VALEUR_ACCEPTE = "accepted";
const VALEUR_REFUSE = "rejected";

type ValeurConsentement = typeof VALEUR_ACCEPTE | typeof VALEUR_REFUSE;

// Message extrait en constante pour éviter les entités JSX non échappées (apostrophes).
const MESSAGE_COOKIES =
  "Ce site utilise uniquement des cookies techniques essentiels à son fonctionnement. Aucun cookie de suivi ou publicitaire n'est déposé.";

export function CookieBanner() {
  // État initial caché : évite tout mismatch d'hydratation (lecture localStorage en useEffect).
  const [estVisible, setEstVisible] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const consentementEnregistre = window.localStorage.getItem(
      COOKIE_CONSENT_KEY
    );

    if (
      consentementEnregistre !== VALEUR_ACCEPTE &&
      consentementEnregistre !== VALEUR_REFUSE
    ) {
      setEstVisible(true);
    }
  }, []);

  // Focus initial sur le dialogue pour les utilisateurs clavier / lecteur d'écran.
  useEffect(() => {
    if (estVisible) {
      dialogRef.current?.focus();
    }
  }, [estVisible]);

  const enregistrerConsentement = (valeur: ValeurConsentement) => {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, valeur);
    setEstVisible(false);
  };

  const handleAccepter = () => {
    enregistrerConsentement(VALEUR_ACCEPTE);
  };

  const handleRefuser = () => {
    enregistrerConsentement(VALEUR_REFUSE);
  };

  if (!estVisible) {
    return null;
  }

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-label="Consentement aux cookies"
      aria-describedby="cookie-banner-description"
      tabIndex={-1}
      className="fixed bottom-0 inset-x-0 z-50 border-t border-gray-200 bg-white shadow-lg focus:outline-none"
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p
          id="cookie-banner-description"
          className="text-sm leading-relaxed text-gray-700"
        >
          {MESSAGE_COOKIES}
        </p>

        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={handleRefuser}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
          >
            Refuser
          </button>

          <button
            type="button"
            onClick={handleAccepter}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}