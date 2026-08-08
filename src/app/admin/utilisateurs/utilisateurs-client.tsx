'use client';

import { useState, useTransition } from 'react';
import {
  createUtilisateur,
  desactiverUtilisateur,
  reactiverUtilisateur,
  updateUtilisateur,
} from '@/features/utilisateurs/actions';
import type {
  CreateUtilisateurInput,
  UpdateUtilisateurInput,
} from '@/features/utilisateurs/schemas';
import type { Utilisateur } from '@/types/database';
import { ConfirmModal, type StatutAction } from './confirm-modal';
import { UtilisateursForm } from './utilisateurs-form';
import { UtilisateursList } from './utilisateurs-list';

type Feedback = { type: 'success' | 'error'; message: string } | null;

type ChangementStatutEnAttente = {
  utilisateur: Utilisateur;
  action: StatutAction;
};

type UtilisateursClientProps = {
  initialUtilisateurs: Utilisateur[];
  messageErreurInitial: string | null;
};

export function UtilisateursClient({
  initialUtilisateurs,
  messageErreurInitial,
}: UtilisateursClientProps) {
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>(initialUtilisateurs);
  const [utilisateurEnEdition, setUtilisateurEnEdition] = useState<Utilisateur | null>(null);
  const [changementStatut, setChangementStatut] = useState<ChangementStatutEnAttente | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(
    messageErreurInitial ? { type: 'error', message: messageErreurInitial } : null
  );
  const [isPending, startTransition] = useTransition();

  const handleCreate = (input: CreateUtilisateurInput) => {
    startTransition(async () => {
      const resultat = await createUtilisateur(input);
      if (resultat.error) {
        setFeedback({ type: 'error', message: resultat.error.message });
        return;
      }

      const utilisateurCree = resultat.data;
      setUtilisateurs((prev) => [utilisateurCree, ...prev]);
      setFeedback({ type: 'success', message: `Compte ${utilisateurCree.email} créé.` });
    });
  };

  const handleUpdateRole = (id: string, input: UpdateUtilisateurInput) => {
    startTransition(async () => {
      const resultat = await updateUtilisateur(id, input);
      if (resultat.error) {
        setFeedback({ type: 'error', message: resultat.error.message });
        return;
      }

      const utilisateurModifie = resultat.data;
      setUtilisateurs((prev) =>
        prev.map((item) => (item.id === utilisateurModifie.id ? utilisateurModifie : item))
      );
      setUtilisateurEnEdition(null);
      setFeedback({ type: 'success', message: 'Rôle mis à jour.' });
    });
  };

  const handleConfirmChangementStatut = () => {
    if (!changementStatut) return;
    const { utilisateur, action } = changementStatut;

    startTransition(async () => {
      const resultat =
        action === 'desactiver'
          ? await desactiverUtilisateur(utilisateur.id)
          : await reactiverUtilisateur(utilisateur.id);

      if (resultat.error) {
        setFeedback({ type: 'error', message: resultat.error.message });
        setChangementStatut(null);
        return;
      }

      const utilisateurModifie = resultat.data;
      setUtilisateurs((prev) =>
        prev.map((item) => (item.id === utilisateurModifie.id ? utilisateurModifie : item))
      );
      setFeedback({
        type: 'success',
        message:
          action === 'desactiver'
            ? `Compte ${utilisateur.email} désactivé.`
            : `Compte ${utilisateur.email} réactivé.`,
      });
      setChangementStatut(null);
    });
  };

  const handleStartEdit = (utilisateur: Utilisateur) => {
    setFeedback(null);
    setUtilisateurEnEdition(utilisateur);
  };

  const handleCancelEdit = () => {
    setUtilisateurEnEdition(null);
  };

  const handleOpenConfirm = (utilisateur: Utilisateur, action: StatutAction) => {
    setFeedback(null);
    setChangementStatut({ utilisateur, action });
  };

  return (
    <div className="space-y-6">
      {feedback && (
        <div
          role={feedback.type === 'error' ? 'alert' : 'status'}
          aria-live={feedback.type === 'error' ? 'assertive' : 'polite'}
          className={
            feedback.type === 'error'
              ? 'rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800'
              : 'rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800'
          }
        >
          {feedback.message}
        </div>
      )}

      <UtilisateursForm
        utilisateurEnEdition={utilisateurEnEdition}
        isSubmitting={isPending}
        onSubmitCreate={handleCreate}
        onSubmitUpdate={handleUpdateRole}
        onCancelEdit={handleCancelEdit}
      />

      <UtilisateursList
        utilisateurs={utilisateurs}
        onStartEdit={handleStartEdit}
        onDesactiver={(utilisateur) => handleOpenConfirm(utilisateur, 'desactiver')}
        onReactiver={(utilisateur) => handleOpenConfirm(utilisateur, 'reactiver')}
      />

      {changementStatut && (
        <ConfirmModal
          utilisateur={changementStatut.utilisateur}
          action={changementStatut.action}
          isSubmitting={isPending}
          onConfirm={handleConfirmChangementStatut}
          onCancel={() => setChangementStatut(null)}
        />
      )}
    </div>
  );
}