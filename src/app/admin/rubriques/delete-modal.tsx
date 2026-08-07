'use client';

import type { Rubrique } from '@/types/database';

type DeleteModalProps = {
  rubrique: Rubrique;
  isDeleting: boolean;
  error: string | null;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
};

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
    />
  );
}

export default function DeleteModal({
  rubrique,
  isDeleting,
  error,
  onCancel,
  onConfirm,
}: DeleteModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4"
      role="presentation"
      onClick={() => {
        if (!isDeleting) {
          onCancel();
        }
      }}
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
          Êtes-vous sûr de vouloir supprimer « {rubrique.nom} » ? Cette action
          est définitive.
        </p>

        {error && (
          <p
            role="alert"
            className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={onConfirm}
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
  );
}