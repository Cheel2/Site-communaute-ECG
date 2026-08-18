import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';
import { createAnonClient } from '@/lib/supabase/anon';
import { formaterDateFrancaise } from '@/lib/format';
import type { Livre, Parametre } from '@/types/database';

export const revalidate = 3600;

type LivreDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams(): Promise<Array<{ id: string }>> {
  try {
    const supabase = createAnonClient();
    const { data, error } = await supabase.from('livre').select('id');
    if (error || !data) return [];
    return (data as Array<Pick<Livre, 'id'>>).map((livre) => ({ id: livre.id }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: LivreDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const livre = await getLivre(id);
  if (!livre) notFound();
  return {
    title: livre.titre,
    description: livre.description || undefined,
  };
}

export default async function PageLivreDetail({ params }: LivreDetailPageProps) {
  const { id } = await params;
  const livre = await getLivre(id);
  if (!livre) notFound();

  const numeroWhatsApp = await getWhatsAppNumero();

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <article className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {livre.titre}
          </h1>
          {livre.date_creation && (
            <p className="mt-2 text-sm text-gray-500">
              Publié le {formaterDateFrancaise(livre.date_creation)}
            </p>
          )}
        </header>

        {livre.image_couverture_url && (
          <div className="relative aspect-[3/4] w-full max-w-md overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={livre.image_couverture_url}
              alt={livre.titre}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover"
            />
          </div>
        )}

        {livre.description && (
          <div className="prose prose-gray max-w-none">
            <p className="text-lg leading-relaxed text-gray-700">{livre.description}</p>
          </div>
        )}

        {livre.prix !== null && livre.prix !== undefined && (
          <div className="text-2xl font-bold text-gray-900">
            {livre.prix.toFixed(2)} €
          </div>
        )}

        <div className="flex flex-wrap gap-4">
          {livre.lien_amazon && (
            <a
              href={livre.lien_amazon}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Acheter sur Amazon
            </a>
          )}

          {numeroWhatsApp && (
            <a
              href={`https://wa.me/${numeroWhatsApp}?text=Bonjour%2C%20je%20souhaite%20me%20renseigner%20sur%20le%20livre%20%22${encodeURIComponent(livre.titre)}%22`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md bg-green-600 px-6 py-3 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Nous contacter
            </a>
          )}
        </div>

        <div className="pt-8">
          <a
            href="/livres"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Retour à la liste des livres
          </a>
        </div>
      </article>
    </main>
  );
}

async function getLivre(id: string): Promise<Livre | null> {
  try {
    const supabase = createAnonClient();
    const { data, error } = await supabase
      .from('livre')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error || !data) return null;
    return data as Livre;
  } catch {
    return null;
  }
}

async function getWhatsAppNumero(): Promise<string> {
  try {
    const supabase = createAnonClient();
    const { data, error } = await supabase
      .from('parametre')
      .select('valeur')
      .eq('cle', 'whatsapp_numero')
      .maybeSingle();
    if (error || !data) return '';
    return (data as Parametre).valeur || '';
  } catch {
    return '';
  }
}
