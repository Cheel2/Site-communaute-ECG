import { cache } from "react";
import type { Metadata } from "next";
import { anon } from "@/lib/supabase/anon";
import type { PageSeo } from "@/types/database";
import { POLITIQUE_CONFIDENTIALITE } from "@/data/legal-content";

const CHEMIN_PAGE = "/politique-confidentialite";

// Fallback local utilisé uniquement si aucune ligne page_seo n'existe pour ce chemin.
const METADONNEES_DEFAUT = {
  titre: "Politique de confidentialité",
  description:
    "Politique de confidentialité du site du ministère pastoral : données collectées, utilisation, cookies et exercice de vos droits.",
};

// cache() déduplique la requête entre generateMetadata et le rendu de la page (même request).
const lireSeoPolitiqueConfidentialite = cache(
  async (): Promise<PageSeo | null> => {
    // maybeSingle() retourne null sans erreur si la ligne est absente (pas de PGRST116).
    const { data, error } = await anon
      .from("page_seo")
      .select("*")
      .eq("chemin", CHEMIN_PAGE)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return data;
  }
);

export async function generateMetadata(): Promise<Metadata> {
  const seo = await lireSeoPolitiqueConfidentialite();

  const titre = seo?.titre?.trim() || METADONNEES_DEFAUT.titre;
  const description =
    seo?.meta_description?.trim() || METADONNEES_DEFAUT.description;
  const motsCles = seo?.mots_cles?.trim();

  return {
    // absolute : rend littéralement le titre (admin ou fallback), neutralise le template du layout.
    title: { absolute: titre },
    description,
    ...(motsCles ? { keywords: motsCles } : {}),
  };
}

export const revalidate = 3600;

export default function PagePolitiqueConfidentialite() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <article className="space-y-10">
        {POLITIQUE_CONFIDENTIALITE.map((section) => (
          <section key={section.titre} className="space-y-3">
            {section.niveau === "h1" ? (
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {section.titre}
              </h1>
            ) : (
              <h2 className="text-xl font-semibold tracking-tight text-gray-900">
                {section.titre}
              </h2>
            )}

            <p className="text-base leading-relaxed text-gray-700">
              {section.contenu}
            </p>

            {section.liste && section.liste.length > 0 && (
              <ul className="list-disc space-y-2 pl-6 text-base leading-relaxed text-gray-700">
                {section.liste.map((element, index) => (
                  <li key={index}>{element}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </article>
    </main>
  );
}