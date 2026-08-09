// src/app/(public)/contact/page.tsx
import { createAnonClient } from '@/lib/supabase/anon';
import { ContactForm } from './contact-form';
import { Metadata } from 'next';

export const revalidate = 3600;

const METADONNEES_DEFAUT = {
  title: 'Contact - Ministère Pastoral',
  description: 'Contactez-nous pour toute question ou demande d\'information.',
};

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createAnonClient();
  const { data: seoData } = await supabase
    .from('page_seo')
    .select('*')
    .eq('chemin', '/contact')
    .single()
    .catch(() => ({ data: null }));

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