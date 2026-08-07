'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Rubrique } from '@/types/database';
import {
  createRubrique,
  deleteRubrique,
  updateRubrique,
} from '@/features/rubriques/actions';
import RubriquesForm from './rubriques-form';
import RubriquesList from './rubriques-list';
import DeleteModal from './delete-modal';

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
    const rawOrdre =
      ordreAffichage.trim() === '' ? '0' : ordreAffichage.trim();
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

      <RubriquesForm
        nom={nom}
        ordreAffichage={ordreAffichage}
        isSaving={isSaving}
        isEditing={Boolean(rubriqueEnEdition)}
        onNomChange={setNom}
        onOrdreChange={setOrdreAffichage}
        onSubmit={handleSubmit}
        onCancel={() => {
          resetForm();
          setFeedback(null);
        }}
      />

      <RubriquesList
        rubriques={rubriques}
        isBusy={isBusy}
        onEdit={startEdit}
        onDelete={openDeleteModal}
      />

      {rubriqueASupprimer && (
        <DeleteModal
          rubrique={rubriqueASupprimer}
          isDeleting={isDeleting}
          error={deleteError}
          onCancel={closeDeleteModal}
          onConfirm={handleDelete}
        />
      )}
    </section>
  );
}