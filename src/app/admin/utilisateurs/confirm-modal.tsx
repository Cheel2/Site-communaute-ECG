'use client';

import type { Utilisateur } from '@/types/database';

export type StatutAction = 'desactiver' | 'reactiver';

type ConfirmModalProps = {
  utilisateur: Utilisateur;
  action: StatutAction;
  isSubmitting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  utilisateur,
  action,
  isSubmitting,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const estDesactivation = action === 'desactiver';

  const titre = estDesactivation
    ? "Désactiver l'utilisateur ?"
    : "Réactiver l'utilisateur ?";

  const description = estDesactivation
    ? `Le compte de ${utilisateur.email} sera désactivé. L'utilisateur ne pourra plus se connecter au back-office. Vous pourrez le réactiver à tout moment.`
    : `Le compte de ${utilisateur.email} sera réactivé. L'utilisateur pourra de nouveau se connecter au back-office.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Fermer"
        onClick={onCancel}
        disabled={isSubmitting}
        className="fixed inset-0 cursor-default bg-black/50"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-titre"
        aria-describedby="confirm-modal-description"
        className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
      >
        <h2 id="confirm-modal-titre" className="text-lg font-semibold text-gray-900">
          {titre}
        </h2>
        <p id="confirm-modal-description" className="mt-2 text-sm text-gray-600">
          {description}
        </p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60 ${
              estDesactivation
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
            }`}
          >
            {isSubmitting && (
              <span
                aria-hidden="true"
                className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
              />
            )}
            {estDesactivation ? 'Désactiver' : 'Réactiver'}
          </button>
        </div>
      </div>
    </div>
  );
}