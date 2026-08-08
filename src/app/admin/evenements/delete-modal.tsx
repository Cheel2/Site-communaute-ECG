import type { Evenement } from "@/types/database";

interface DeleteModalProps {
  evenement: Evenement | null;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

export function DeleteModal({
  evenement,
  onConfirm,
  onCancel,
  isDeleting,
}: DeleteModalProps) {
  if (!evenement) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-evenement-title"
    >
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <h2
          id="delete-evenement-title"
          className="text-lg font-semibold text-gray-900"
        >
          Confirmer la suppression
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Êtes-vous sûr de vouloir supprimer «{" "}
          <span className="font-medium">{evenement.titre}</span> » ? Cette
          action est irréversible.
        </p>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isDeleting ? "Suppression…" : "Supprimer"}
          </button>
        </div>
      </div>
    </div>
  );
}