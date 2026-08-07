'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Rubrique } from '@/types/database';
import {
  createRubrique,
  deleteRubrique,
  updateRubrique,
} from '@/features/rubriques/actions';

type Feedback = {
  type: 'success' | 'error';
  message: string;
} | null;

type RubriquesClientProps = {
  initialRubriques: Rubrique[];
};

function sortRubriques(items: Rubrique[]): Rubrique[] {
  return [...items].sort(
    (a, b) =>
      a.ordre_affichage - b.ordre_affichage ||
      a.nom.localeCompare(b.nom, 'fr')
  );
}

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
    />
  );
}

export default function RubriquesClient({
  initialRubriques,
}: RubriquesClientProps) {
  const [rubriques, setRubriques] = useState<Rubrique[]>(() =>
    sortRubriques(initialRubriques)
  );
  const [nom, setNom] = useState('');
  const [ordreAffichage, setOrdreAffichage] = useState('0');
  const [rubriqueEnEdition, setRubriqueEnEdition] =
    useState<Rubrique | null>(null);
  const [rubriqueASupprimer, setRubriqueASupprimer] =
    useState<Rubrique | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isBusy = isSaving || isDeleting;

  const resetForm = () => {
    setRubriqueEnEdition(null);
    setNom('');
    setOrdreAffichage('0');
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;
    setRubriqueASupprimer(null);
    setDeleteError(null);
  };

  const startEdit = (rubrique: Rubrique) => {
    if (isBusy) return;

    setRubriqueEnEdition(rubrique);
    setNom(rubrique.nom);
    setOrdreAffichage(String(rubrique.ordre_affichage));
    setFeedback(null);
    setDeleteError(null);
  };

  const openDeleteModal = (rubrique: Rubrique) => {
    if (isBusy) return;

    setRubriqueASupprimer(rubrique);
    setDeleteError(null);
    setFeedback(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSaving) return;

    const trimmedNom = nom.trim();
    const rawOrdre = ordreAffichage.trim() === '' ? '0' : ordreAffichage.trim();
    const ordre = Number(rawOrdre);

    if (!trimmedNom) {
      setFeedback({
        type: 'error',
        message: 'Le nom de la rubrique est requis.',
      });
      return;
    }

    if (!Number.isInteger(ordre)) {
      setFeedback({
        type: 'error',
        message: "L'ordre d'affichage doit être un nombre entier.",
      });
      return;
    }

    const payload = {
      nom: trimmedNom,
      ordre_affichage: ordre,
    };

    setIsSaving(true);
    setFeedback(null);

    try {
      const response = rubriqueEnEdition
        ? await updateRubrique(rubriqueEnEdition.id, payload)
        : await createRubrique(payload);

      if (response.error) {
        setFeedback({
          type: 'error',
          message: response.error.message,
        });
        return;
      }

      const savedRubrique = response.data;

      if (!savedRubrique) {
        setFeedback({
          type: 'error',
          message: 'La réponse du serveur est invalide.',
        });
        return;
      }

      if (rubriqueEnEdition) {
        setRubriques((prev) =>
          sortRubriques(
            prev.map((item) =>
              item.id === savedRubrique.id ? savedRubrique : item
            )
          )
        );
        setFeedback({
          type: 'success',
          message: 'Rubrique modifiée avec succès.',
        });
      } else {
        setRubriques((prev) => sortRubriques([...prev, savedRubrique]));
        setFeedback({
          type: 'success',
          message: 'Rubrique ajoutée avec succès.',
        });
      }

      resetForm();
    } catch {
      setFeedback({
        type: 'error',
        message: 'Une erreur réseau est survenue.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    const cible = rubriqueASupprimer;

    if (!cible || isDeleting) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const response = await deleteRubrique(cible.id);

      if (response.error) {
        setDeleteError(response.error.message);
        return;
      }

      setRubriques((prev) => prev.filter((item) => item.id !== cible.id));

      if (rubriqueEnEdition?.id === cible.id) {
        resetForm();
      }

      setRubriqueASupprimer(null);
      setFeedback({
        type: 'success',
        message: 'Rubrique supprimée avec succès.',
      });
    } catch {
      setDeleteError('Une erreur réseau est survenue.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="w-full space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-900">Rubriques</h1>
        <p className="text-sm text-gray-600">
          Créez, modifiez ou supprimez les rubriques éditoriales du site.
        </p>
      </header>

      {feedback && (
        <div
          role={feedback.type === 'error' ? 'alert' : 'status'}
          aria-live={feedback.type === 'error' ? 'assertive' : 'polite'}
          className={`rounded-md border px-4 py-3 text-sm ${
            feedback.type === 'error'
              ? 'border-red-200 bg-red-50 text-red-700'
              : 'border-green-200 bg-green-50 text-green-700'
          }`}
        >
          {feedback.message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
        noValidate
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-medium text-gray-900">
            {rubriqueEnEdition
              ? 'Modifier la rubrique'
              : 'Ajouter une rubrique'}
          </h2>

          {rubriqueEnEdition && (
            <button
              type="button"
              onClick={() => {
                resetForm();
                setFeedback(null);
              }}
              disabled={isBusy}
              className="text-sm text-gray-600 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Annuler
            </button>
          )}
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
              onChange={(event) => setNom(event.target.value)}
              disabled={isBusy}
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
              onChange={(event) => setOrdreAffichage(event.target.value)}
              disabled={isBusy}
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

          {rubriqueEnEdition && (
            <button
              type="button"
              onClick={() => {
                resetForm();
                setFeedback(null);
              }}
              disabled={isBusy}
              className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              Annuler
            </button>
          )}
        </div>
      </form>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-medium text-gray-900">
            Rubriques existantes
          </h2>
          <span className="text-sm text-gray-500">
            {rubriques.length} rubrique{rubriques.length > 1 ? 's' : ''}
          </span>
        </div>

        {rubriques.length === 0 ? (
          <p className="rounded-md border border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-600">
            Aucune rubrique. Ajoutez la première rubrique avec le formulaire
            ci-dessus.
          </p>
        ) : (
          <>
            <div className="hidden overflow-x-auto rounded-lg border border-gray-200 md:block">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-600">
                  <tr>
                    <th className="px-4 py-3 font-medium">Nom</th>
                    <th className="px-4 py-3 font-medium">Ordre</th>
                    <th className="px-4 py-3 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rubriques.map((rubrique) => (
                    <tr
                      key={rubrique.id}
                      className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {rubrique.nom}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {rubrique.ordre_affichage}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(rubrique)}
                            disabled={isBusy}
                            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Modifier
                          </button>
                          <button
                            type="button"
                            onClick={() => openDeleteModal(rubrique)}
                            disabled={isBusy}
                            className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="grid grid-cols-1 gap-3 md:hidden">
              {rubriques.map((rubrique) => (
                <li
                  key={rubrique.id}
                  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-gray-900">
                        {rubrique.nom}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Ordre : {rubrique.ordre_affichage}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(rubrique)}
                      disabled={isBusy}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => openDeleteModal(rubrique)}
                      disabled={isBusy}
                      className="w-full rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Supprimer
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {rubriqueASupprimer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4"
          role="presentation"
          onClick={closeDeleteModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="suppression-rubrique-titre"
            className="w-full max-w-md rounded-lg bg-white p-4 shadow-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <h3
              id="suppression-rubrique-titre"
              className="text-lg font-medium text-gray-900"
            >
              Supprimer la rubrique
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Êtes-vous sûr de vouloir supprimer « {rubriqueASupprimer.nom} » ?
              Cette action est définitive.
            </p>

            {deleteError && (
              <p
                role="alert"
                className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              >
                {deleteError}
              </p>
            )}

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? (
                  <>
                    <Spinner />
                    <span>Suppression…</span>
                  </>
                ) : (
                  'Supprimer'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}