'use client';

import type { FormEvent } from 'react';
import type { Rubrique } from '@/types/database';
import type { StatutContenu } from '@/features/contenus/schemas';

type ContenusFormProps = {
  rubriques: Rubrique[];
  titre: string;
  texte: string;
  rubriqueId: string;
  statut: StatutContenu;
  imageUrl: string;
  isSaving: boolean;
  isEditing: boolean;
  onTitreChange: (value: string) => void;
  onTexteChange: (value: string) => void;
  onRubriqueChange: (value: string) => void;
  onStatutChange: (value: StatutContenu) => void;
  onImageUrlChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  onCancel: () => void;
};

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
    />
  );
}

export default function ContenusForm({
  rubriques,
  titre,
  texte,
  rubriqueId,
  statut,
  imageUrl,
  isSaving,
  isEditing,
  onTitreChange,
  onTexteChange,
  onRubriqueChange,
  onStatutChange,
  onImageUrlChange,
  onSubmit,
  onCancel,
}: ContenusFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void onSubmit(event);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
      noValidate
    >
      <div className="mb-4">
        <h2 className="text-lg font-medium text-gray-900">
          {isEditing ? 'Modifier le contenu' : 'Créer un contenu'}
        </h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <label
            htmlFor="contenu-titre"
            className="block text-sm font-medium text-gray-800"
          >
            Titre
          </label>
          <input
            id="contenu-titre"
            name="titre"
            type="text"
            value={titre}
            onChange={(event) => onTitreChange(event.target.value)}
            disabled={isSaving}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label
              htmlFor="contenu-rubrique"
              className="block text-sm font-medium text-gray-800"
            >
              Rubrique
            </label>
            <select
              id="contenu-rubrique"
              name="rubrique_id"
              value={rubriqueId}
              onChange={(event) => onRubriqueChange(event.target.value)}
              disabled={isSaving || rubriques.length === 0}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">Sélectionner une rubrique</option>
              {rubriques.map((rubrique) => (
                <option key={rubrique.id} value={rubrique.id}>
                  {rubrique.nom}
                </option>
              ))}
            </select>
            {rubriques.length === 0 && (
              <p className="text-xs text-gray-500">
                Aucune rubrique disponible. Créez d&apos;abord une rubrique.
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label
              htmlFor="contenu-statut"
              className="block text-sm font-medium text-gray-800"
            >
              Statut
            </label>
            <select
              id="contenu-statut"
              name="statut"
              value={statut}
              onChange={(event) => {
                const value = event.target.value;

                if (value === 'publie' || value === 'non_publie') {
                  onStatutChange(value);
                }
              }}
              disabled={isSaving}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="publie">Publié</option>
              <option value="non_publie">Non publié</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label
            htmlFor="contenu-image-url"
            className="block text-sm font-medium text-gray-800"
          >
            URL de l&apos;image
          </label>
          <input
            id="contenu-image-url"
            name="image_url"
            type="text"
            value={imageUrl}
            onChange={(event) => onImageUrlChange(event.target.value)}
            disabled={isSaving}
            placeholder="https://exemple.gouv.fr/image.webp"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="contenu-texte"
            className="block text-sm font-medium text-gray-800"
          >
            Texte
          </label>
          <textarea
            id="contenu-texte"
            name="texte"
            rows={8}
            value={texte}
            onChange={(event) => onTexteChange(event.target.value)}
            disabled={isSaving}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isSaving ? (
            <>
              <Spinner />
              <span>Enregistrement…</span>
            </>
          ) : (
            'Enregistrer'
          )}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}