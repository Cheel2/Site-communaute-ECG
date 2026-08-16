// src/app/(public)/partenariat/page.tsx
import { createAnonClient } from '@/lib/supabase/anon';
import { PartenariatForm } from './partenariat-form';
import { Metadata } from 'next';

export const revalidate = 3600;

const METADONNEES_DEFAUT = {
  title: 'Partenariat - Ministère Pastoral',
  description: 'Devenez partenaire de notre ministère pastoral.',
};

async function lireSeoPartenariat() {
  const supabase = createAnonClient();
  try {
    const { data } = await supabase
      .from('page_seo')
      .select('*')
      .eq('chemin', '/partenariat')
      .single();
    return data;
  } catch {
    return null;
  }
}

async function lireNumeroWhatsApp(): Promise<string> {
  const supabase = createAnonClient();
  try {
    const { data } = await supabase
      .from('parametre')
      .select('valeur')
      .eq('cle', 'whatsapp_numero')
      .single();
    return data?.valeur || '';
  } catch {
    return '';
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const seoData = await lireSeoPartenariat();

  return {
    title: seoData?.titre || METADONNEES_DEFAUT.title,
    description: seoData?.meta_description || METADONNEES_DEFAUT.description,
  };
}

export default async function PartenariatPage() {
  const numeroWhatsApp = await lireNumeroWhatsApp();

  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Partenariat</h1>
      <PartenariatForm numeroWhatsApp={numeroWhatsApp} />
    </main>
  );
}