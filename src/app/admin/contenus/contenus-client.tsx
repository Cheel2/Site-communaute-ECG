'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Rubrique } from '@/types/database';
import type { StatutContenu } from '@/features/contenus/schemas';
import {
  createContenu,
  deleteContenu,
  updateContenu,
  type ContenuAvecRubrique,
} from '@/features/contenus/actions';
import ContenusForm from './contenus-form';
import ContenusList from './contenus-list';
import DeleteModal from './delete-modal';

type Feedback = {
  type: 'success' | 'error';
  message: string;
} | null;

type ContenusClientProps = {
  initialContenus: ContenuAvecRubrique[];
  rubriques: Rubrique[];
};

function sortContenus(items: ContenuAvecRubrique[]): ContenuAvecRubrique[] {
  return [...items].sort(
    (a, b) =>
      new Date(b.date_creation).getTime() - new Date(a.date_creation).getTime()
  );
}

export default function ContenusClient({
  initialContenus,
  rubriques,
}: ContenusClientProps) {
  const [contenus, setContenus] = useState<ContenuAvecRubrique[]>(() =>
    sortContenus(initialContenus)
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [contenuEnEdition, setContenuEnEdition] =
    useState<ContenuAvecRubrique | null>(null);
  const [titre, setTitre] = useState('');
  const [texte, setTexte] = useState('');
  const [rubriqueId, setRubriqueId] = useState('');
  const [statut, setStatut] = useState<StatutContenu>('non_publie');
  const [imageUrl, setImageUrl] = useState('');
  const [contenuASupprimer, setContenuASupprimer] =
    useState<ContenuAvecRubrique | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isBusy = isSaving || isDeleting;

  const resetForm = () => {
    setContenuEnEdition(null);
    setTitre('');
    setTexte('');
    setRubriqueId(rubriques.length === 1 ? rubriques[0]?.id ?? '' : '');
    setStatut('non_publie');
    setImageUrl('');
  };

  const openCreateForm = () => {
    if (isBusy) return;

    resetForm();
    setIsFormOpen(true);
    setFeedback(null);
    setDeleteError(null);
  };

  const openEditForm = (contenu: ContenuAvecRubrique) => {
    if (isBusy) return;

    setContenuEnEdition(contenu);
    setTitre(contenu.titre);
    setTexte(contenu.texte);
    setRubriqueId(contenu.rubrique_id);
    setStatut(contenu.statut === 'publie' ? 'publie' : 'non_publie');
    setImageUrl(contenu.image_url ?? '');
    setIsFormOpen(true);
    setFeedback(null);
    setDeleteError(null);
  };

  const closeForm = () => {
    if (isSaving) return;

    resetForm();
    setIsFormOpen(false);
  };

  const handleCancel = () => {
    closeForm();
    setFeedback(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSaving) return;

    const trimmedTitre = titre.trim();
    const trimmedImageUrl = imageUrl.trim();

    if (!trimmedTitre) {
      setFeedback({
        type: 'error',
        message: 'Le titre du contenu est requis.',
      });
      return;
    }

    if (!rubriqueId) {
      setFeedback({
        type: 'error',
        message: 'Veuillez sélectionner une rubrique.',
      });
      return;
    }

    const payload = {
      titre: trimmedTitre,
      texte,
      rubrique_id: rubriqueId,
      statut,
      image_url: trimmedImageUrl === '' ? null : trimmedImageUrl,
    };

    setIsSaving(true);
    setFeedback(null);

    try {
      const response = contenuEnEdition
        ? await updateContenu(contenuEnEdition.id, payload)
        : await createContenu(payload);

      if (response.error) {
        setFeedback({
          type: 'error',
          message: response.error.message,
        });
        return;
      }

      const savedContenu = response.data;

      if (!savedContenu) {
        setFeedback({
          type: 'error',
          message: 'La réponse du serveur est invalide.',
        });
        return;
      }

      if (contenuEnEdition) {
        setContenus((prev) =>
          sortContenus(
            prev.map((item) =>
              item.id === savedContenu.id ? savedContenu : item
            )
          )
        );
        setFeedback({
          type: 'success',
          message: 'Contenu modifié avec succès.',
        });
      } else {
        setContenus((prev) => sortContenus([savedContenu, ...prev]));
        setFeedback({
          type: 'success',
          message: 'Contenu créé avec succès.',
        });
      }

      resetForm();
      setIsFormOpen(false);
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
    const cible = contenuASupprimer;

    if (!cible || isDeleting) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const response = await deleteContenu(cible.id);

      if (response.error) {
        setDeleteError(response.error.message);
        return;
      }

      setContenus((prev) => prev.filter((item) => item.id !== cible.id));

      if (contenuEnEdition?.id === cible.id) {
        resetForm();
        setIsFormOpen(false);
      }

      setContenuASupprimer(null);
      setFeedback({
        type: 'success',
        message: 'Contenu supprimé avec succès.',
      });
    } catch {
      setDeleteError('Une erreur réseau est survenue.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="w-full space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-gray-900">Contenus</h1>
          <p className="text-sm text-gray-600">
            Créez, modifiez ou supprimez les contenus éditoriaux du site.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          disabled={isBusy}
          className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          Nouveau contenu
        </button>
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

      {isFormOpen && (
        <ContenusForm
          rubriques={rubriques}
          titre={titre}
          texte={texte}
          rubriqueId={rubriqueId}
          statut={statut}
          imageUrl={imageUrl}
          isSaving={isSaving}
          isEditing={Boolean(contenuEnEdition)}
          onTitreChange={setTitre}
          onTexteChange={setTexte}
          onRubriqueChange={setRubriqueId}
          onStatutChange={setStatut}
          onImageUrlChange={setImageUrl}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      <ContenusList
        contenus={contenus}
        isBusy={isBusy}
        onEdit={openEditForm}
        onDelete={(contenu) => {
          if (isBusy) return;

          setContenuASupprimer(contenu);
          setDeleteError(null);
          setFeedback(null);
        }}
      />

      {contenuASupprimer && (
        <DeleteModal
          contenu={contenuASupprimer}
          isDeleting={isDeleting}
          error={deleteError}
          onCancel={() => {
            if (isDeleting) return;

            setContenuASupprimer(null);
            setDeleteError(null);
          }}
          onConfirm={handleDelete}
        />
      )}
    </section>
  );
}