"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createContenu } from "@/features/contenus/actions";
import type { Rubrique } from "@/types/database";

type Props = {
  rubriques: Rubrique[];
};

export default function NouveauContenuClient({ rubriques }: Props) {
  const router = useRouter();
  const [titre, setTitre] = useState("");
  const [texte, setTexte] = useState("");
  const [rubriqueId, setRubriqueId] = useState("");
  const [statut, setStatut] = useState<"publie" | "non_publie">("non_publie");
  const [imageUrl, setImageUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSaving) return;

    setError(null);
    setIsSaving(true);

    try {
      const response = await createContenu({
        titre: titre.trim(),
        texte,
        rubrique_id: rubriqueId,
        statut,
        image_url: imageUrl.trim() || null,
      });

      if (response.error) {
        setError(response.error.message);
        return;
      }

      router.push("/admin/contenus");
    } catch (err) {
      console.error("Erreur:", err);
      setError("Une erreur est survenue.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Nouveau contenu
      </h1>

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="titre" className="block text-sm font-medium text-gray-700">
            Titre *
          </label>
          <input
            id="titre"
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Titre du contenu"
          />
        </div>

        <div>
          <label htmlFor="rubrique_id" className="block text-sm font-medium text-gray-700">
            Rubrique *
          </label>
          <select
            id="rubrique_id"
            value={rubriqueId}
            onChange={(e) => setRubriqueId(e.target.value)}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">— Sélectionner une rubrique —</option>
            {rubriques.map((rubrique) => (
              <option key={rubrique.id} value={rubrique.id}>
                {rubrique.nom}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="texte" className="block text-sm font-medium text-gray-700">
            Texte
          </label>
          <textarea
            id="texte"
            value={texte}
            onChange={(e) => setTexte(e.target.value)}
            rows={10}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Contenu du texte..."
          />
        </div>

        <div>
          <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
            Image (URL)
          </label>
          <input
            id="image_url"
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="URL de l'image (optionnel)"
          />
        </div>

        <div>
          <label htmlFor="statut" className="block text-sm font-medium text-gray-700">
            Statut
          </label>
          <select
            id="statut"
            value={statut}
            onChange={(e) => setStatut(e.target.value as "publie" | "non_publie")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="non_publie">Non publié</option>
            <option value="publie">Publié</option>
          </select>
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-200 pt-4 sm:flex-row">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Création en cours…" : "Créer le contenu"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/contenus")}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
