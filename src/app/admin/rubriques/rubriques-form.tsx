'use client';

import type { FormEvent } from 'react';

type RubriquesFormProps = {
  nom: string;
  ordreAffichage: string;
  isSaving: boolean;
  isEditing: boolean;
  onNomChange: (value: string) => void;
  onOrdreChange: (value: string) => void;
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

export default function RubriquesForm({
  nom,
  ordreAffichage,
  isSaving,
  isEditing,
  onNomChange,
  onOrdreChange,
  onSubmit,
  onCancel,
}: RubriquesFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
      noValidate
    >
      <div className="mb-4">
        <h2 className="text-lg font-medium text-gray-900">
          {isEditing ? 'Modifier la rubrique' : 'Ajouter une rubrique'}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label
            htmlFor="rubrique-nom"
            className="block text-sm font-medium text-gray-800"
          >
            Nom
          </label>
          <input
            id="rubrique-nom"
            name="nom"
            type="text"
            value={nom}
            onChange={(event) => onNomChange(event.target.value)}
            disabled={isSaving}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="rubrique-ordre-affichage"
            className="block text-sm font-medium text-gray-800"
          >
            Ordre d&apos;affichage
          </label>
          <input
            id="rubrique-ordre-affichage"
            name="ordre_affichage"
            type="number"
            step="1"
            inputMode="numeric"
            value={ordreAffichage}
            onChange={(event) => onOrdreChange(event.target.value)}
            disabled={isSaving}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
          />
          <p className="text-xs text-gray-500">
            Les rubriques sont affichées de la plus petite à la plus grande
            valeur.
          </p>
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

        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}