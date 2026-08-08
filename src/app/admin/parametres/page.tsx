import type { Metadata } from 'next';
import { getAllSeo, getWhatsappConfig } from '@/features/parametres/actions';
import type { PageSeo } from '@/types/database';
import { ParametresClient } from './parametres-client';

export const metadata: Metadata = {
  title: 'Paramètres — Administration',
  description: 'Configuration des coordonnées WhatsApp et du référencement (SEO) par page.',
};

export default async function ParametresPage() {
  const [resultatWhatsapp, resultatSeo] = await Promise.all([
    getWhatsappConfig(),
    getAllSeo(),
  ]);

  const whatsapp = resultatWhatsapp.error
    ? { numero: '', message_defaut: '' }
    : resultatWhatsapp.data;
  const pagesSeo: PageSeo[] = resultatSeo.error ? [] : resultatSeo.data;
  const messageErreurWhatsapp = resultatWhatsapp.error ? resultatWhatsapp.error.message : null;
  const messageErreurSeo = resultatSeo.error ? resultatSeo.error.message : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="mt-1 text-sm text-gray-600">
          Coordonnées WhatsApp et référencement (SEO) par page.
        </p>
      </div>
      <ParametresClient
        initialWhatsapp={whatsapp}
        initialPagesSeo={pagesSeo}
        messageErreurWhatsapp={messageErreurWhatsapp}
        messageErreurSeo={messageErreurSeo}
      />
    </div>
  );
}