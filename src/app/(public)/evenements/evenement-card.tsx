// src/app/(public)/evenements/evenement-card.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Evenement } from '@/types/database';
import { formatterDateFrancaise, extraireExtraitTexte } from '@/lib/format';

interface EvenementCardProps {
  evenement: Evenement;
  numeroWhatsApp: string;
}

export function EvenementCard({ evenement, numeroWhatsApp }: EvenementCardProps) {
  const [isPending, setIsPending] = useState(false);

  const handleWhatsAppClick = async () => {
    if (!numeroWhatsApp) return;
    setIsPending(true);
    try {
      const message = `Inscription à l'événement : ${evenement.titre}`;
      const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(message)}`;
      // window.open n'accepte pas l'attribut HTML `rel` :
      // les windowFeatures `noopener,noreferrer` assurent la même isolation de sécurité.
      window.open(url, '_blank', 'noopener,noreferrer');
    } finally {
      setIsPending(false);
    }
  };

  const badgeClasses = evenement.type === 'recurrent'
    ? 'bg-blue-100 text-blue-800'
    : 'bg-amber-100 text-amber-800';

  const badgeLabel = evenement.type === 'recurrent' ? 'Récurrent' : 'Spécial';

  return (
    <article className="border border-gray-200 rounded-lg overflow-hidden shadow-sm flex flex-col bg-white">
      {evenement.image_url && (
        <div className="relative w-full h-48 bg-gray-100">
          <Image
            src={evenement.image_url}
            alt={evenement.titre}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-2">
          <span className={`px-2 py-1 text-xs font-semibold rounded ${badgeClasses}`}>
            {badgeLabel}
          </span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">{evenement.titre}</h2>
        <p className="text-gray-600 text-sm mb-3 flex-grow">
          {extraireExtraitTexte(evenement.description, 120)}
        </p>
        <div className="text-sm text-gray-500 space-y-1 mb-4">
          <p>
            📅 {formatterDateFrancaise(evenement.date_debut)}
            {evenement.date_fin ? ` - ${formatterDateFrancaise(evenement.date_fin)}` : ''}
          </p>
          {evenement.lieu && <p>📍 {evenement.lieu}</p>}
        </div>

        {evenement.inscription_requise && numeroWhatsApp && (
          <button
            onClick={handleWhatsAppClick}
            disabled={isPending}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={`S'inscrire à l'événement ${evenement.titre} via WhatsApp`}
          >
            {isPending ? 'Ouverture...' : "S'inscrire via WhatsApp"}
          </button>
        )}
      </div>
    </article>
  );
}