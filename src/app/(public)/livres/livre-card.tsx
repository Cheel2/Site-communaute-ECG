'use client';

import Image from 'next/image';
import { trackClicAmazon, trackClicWhatsappLivre } from '@/features/tracking/actions';
import type { Livre } from '@/types/database';

interface LivreCardProps {
  livre: Livre;
  numeroWhatsApp: string;
}

export function LivreCard({ livre, numeroWhatsApp }: LivreCardProps) {
  const prixFormate = typeof livre.prix === 'number' && livre.prix > 0 
    ? `${livre.prix.toFixed(2)} €` 
    : 'Gratuit';

  const handleClickAmazon = async () => {
    if (!livre.lien_amazon) return;
    
    // Tracking asynchrone avant redirection
    await trackClicAmazon(livre.id);
    
    // Équivalent programmatique de rel="noopener noreferrer" pour window.open
    window.open(livre.lien_amazon, '_blank', 'noopener,noreferrer');
  };

  const handleClickWhatsApp = async () => {
    let url = livre.lien_whatsapp;
    
    // Logique de fallback : si le lien spécifique n'est pas une URL complète, on construit l'URL wa.me
    if (!url || !url.startsWith('http')) {
      const message = encodeURIComponent(`Intérêt pour le livre : ${livre.titre}`);
      url = `https://wa.me/${numeroWhatsApp}?text=${message}`;
    }
    
    await trackClicWhatsappLivre(livre.id);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
        {livre.image_couverture_url ? (
          <Image
            src={livre.image_couverture_url}
            alt={`Couverture du livre ${livre.titre}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400 text-sm">
            Couverture non disponible
          </div>
        )}
      </div>
      
      <div className="flex flex-1 flex-col p-4">
        <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">{livre.titre}</h2>
        <p className="mt-1 text-xl font-bold text-blue-600">
          {prixFormate}
        </p>
        
        {livre.description && (
          <p className="mt-2 flex-1 text-sm text-gray-600 line-clamp-3">
            {livre.description.length > 120 ? `${livre.description.substring(0, 120)}...` : livre.description}
          </p>
        )}

        <div className="mt-4 flex flex-col gap-2">
          {livre.lien_amazon && (
            <button
              type="button"
              onClick={handleClickAmazon}
              className="w-full rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              aria-label={`Acheter le livre ${livre.titre} sur Amazon`}
            >
              Acheter sur Amazon
            </button>
          )}
          
          {numeroWhatsApp && (
            <button
              type="button"
              onClick={handleClickWhatsApp}
              className="w-full rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              aria-label={`Commander le livre ${livre.titre} via WhatsApp`}
            >
              Commander via WhatsApp
            </button>
          )}
        </div>
      </div>
    </article>
  );
}