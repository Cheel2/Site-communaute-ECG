// src/app/(public)/evenements/evenement-card.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Evenement } from '@/types/database';
import { formaterDateFrancaise, extraireExtraitTexte } from '@/lib/format';

const LONGUEUR_EXTRAIT_DESCRIPTION = 120;

interface EvenementCardProps {
  evenement: Evenement;
  numeroWhatsApp: string;
}

/** Fonction pure : construit l'URL wa.me avec message pré-rempli (US-7). */
function construireUrlWhatsApp(numeroWhatsApp: string, titreEvenement: string): string {
  const message = `Inscription à l'événement : ${titreEvenement}`;
  return `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(message)}`;
}

function libelleType(type: Evenement['type']): string {
  return type === 'recurrent' ? 'Récurrent' : 'Spécial';
}

function classesBadgeType(type: Evenement['type']): string {
  return type === 'recurrent'
    ? 'bg-blue-100 text-blue-800'
    : 'bg-amber-100 text-amber-800';
}

export function EvenementCard({ evenement, numeroWhatsApp }: EvenementCardProps) {
  const [estEnAttente, setEstEnAttente] = useState(false);

  const handleInscriptionWhatsApp = async () => {
    if (!numeroWhatsApp || estEnAttente) return;
    setEstEnAttente(true);
    try {
      const url = construireUrlWhatsApp(numeroWhatsApp, evenement.titre);
      // window.open n'accepte pas l'attribut HTML `rel` :
      // les windowFeatures `noopener,noreferrer` assurent la même isolation de sécurité.
      window.open(url, '_blank', 'noopener,noreferrer');
    } finally {
      setEstEnAttente(false);
    }
  };

  return (
    <article className="border border-gray-200 rounded-lg overflow-hidden shadow-sm flex flex-col bg-white">
      {evenement.image_url && (
        <div className="relative w-full h-48 bg-gray-100">
          <Image
            src={evenement.image_url}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-2">
          <span className={`px-2 py-1 text-xs font-semibold rounded ${classesBadgeType(evenement.type)}`}>
            {libelleType(evenement.type)}
          </span>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2">{evenement.titre}</h2>

        <p className="text-gray-600 text-sm mb-3 flex-grow">
          {extraireExtraitTexte(evenement.description, LONGUEUR_EXTRAIT_DESCRIPTION)}
        </p>

        <div className="text-sm text-gray-500 space-y-1 mb-4">
          <p>
            {evenement.date_fin
              ? `Du ${formaterDateFrancaise(evenement.date_debut)} au ${formaterDateFrancaise(evenement.date_fin)}`
              : formaterDateFrancaise(evenement.date_debut)}
          </p>
          {evenement.lieu && <p>Lieu : {evenement.lieu}</p>}
        </div>

        {evenement.inscription_requise && numeroWhatsApp && (
          <button
            type="button"
            onClick={handleInscriptionWhatsApp}
            disabled={estEnAttente}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={`S'inscrire à l'événement ${evenement.titre} via WhatsApp`}
          >
            {estEnAttente ? 'Ouverture…' : "S'inscrire via WhatsApp"}
          </button>
        )}
      </div>
    </article>
  );
}