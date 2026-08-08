import Image from 'next/image';
import Link from 'next/link';
import type { Banniere, Contenu } from '@/types/database';

type HomePageProps = {
  banniere: Banniere | null;
  derniersContenus: Contenu[];
};

const LONGUEUR_EXTRAIT = 140;

export function HomePage({ banniere, derniersContenus }: HomePageProps) {
  return (
    <>
      <HeroBanner banniere={banniere} />
      <FeaturedContents contenus={derniersContenus} />
    </>
  );
}

function HeroBanner({ banniere }: { banniere: Banniere | null }) {
  const imageUrl = banniere?.image_url ?? null;
  const message = banniere?.message ?? '';

  return (
    <section aria-label="Bannière du site" className="relative bg-gray-100">
      <div className="relative flex min-h-[280px] items-center justify-center sm:min-h-[360px]">
        {imageUrl ? (
          <>
            <Image
              src={imageUrl}
              alt={message || 'Bannière du site'}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
          </>
        ) : null}

        <div className="relative z-10 mx-auto w-full max-w-3xl px-4 py-12 text-center">
          <h1
            className={`text-3xl font-bold sm:text-4xl ${
              imageUrl ? 'text-white' : 'text-gray-900'
            }`}
          >
            {message || 'Ministère Pastoral'}
          </h1>
        </div>
      </div>
    </section>
  );
}

function FeaturedContents({ contenus }: { contenus: Contenu[] }) {
  return (
    <section
      aria-labelledby="derniers-contenus-titre"
      className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-12"
    >
      <h2
        id="derniers-contenus-titre"
        className="text-xl font-semibold text-gray-900 sm:text-2xl"
      >
        Derniers contenus
      </h2>

      {contenus.length === 0 ? (
        <p className="mt-6 rounded-md border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
          Aucun contenu publié pour le moment.
        </p>
      ) : (
        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {contenus.map((contenu) => (
            <ContenuCard key={contenu.id} contenu={contenu} />
          ))}
        </ul>
      )}
    </section>
  );
}

function ContenuCard({ contenu }: { contenu: Contenu }) {
  const extrait = extraireExtrait(contenu.texte);

  return (
    <li className="overflow-hidden rounded-md border border-gray-200 bg-white">
      <Link
        href={`/contenus/${contenu.id}`}
        className="group block h-full focus:outline-none focus:ring-2 focus:ring-gray-400"
      >
        {contenu.image_url ? (
          <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
            <Image
              src={contenu.image_url}
              alt={contenu.titre}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        ) : null}
        <div className="p-4">
          <h3 className="text-base font-semibold text-gray-900 group-hover:underline">
            {contenu.titre}
          </h3>
          {extrait ? (
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{extrait}</p>
          ) : null}
        </div>
      </Link>
    </li>
  );
}

function extraireExtrait(texte: string): string {
  const texteBrut = texte
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (texteBrut.length <= LONGUEUR_EXTRAIT) {
    return texteBrut;
  }

  return `${texteBrut.slice(0, LONGUEUR_EXTRAIT).trimEnd()}…`;
}