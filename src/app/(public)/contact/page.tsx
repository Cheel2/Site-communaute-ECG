// src/app/(public)/contact/page.tsx
import { createAnonClient } from '@/lib/supabase/anon';
import { ContactForm } from './contact-form';
import { Metadata } from 'next';

export const revalidate = 3600;

const METADONNEES_DEFAUT = {
  title: 'Contact - Ministère Pastoral',
  description: 'Contactez-nous pour toute question ou demande d\'information.',
};

async function lireSeoContact() {
  const supabase = createAnonClient();
  try {
    const { data } = await supabase
      .from('page_seo')
      .select('*')
      .eq('chemin', '/contact')
      .single();
    return data;
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const seoData = await lireSeoContact();

  return {
    title: seoData?.titre || METADONNEES_DEFAUT.title,
    description: seoData?.meta_description || METADONNEES_DEFAUT.description,
  };
}

export default function ContactPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Contact</h1>
      <ContactForm />
    </main>
  );
}