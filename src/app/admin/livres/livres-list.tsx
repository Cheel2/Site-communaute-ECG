import type { Livre } from "@/types/database";

interface LivresListProps {
  livres: Livre[];
  onEdit: (livre: Livre) => void;
  onDelete: (livre: Livre) => void;
}

export function LivresList({ livres, onEdit, onDelete }: LivresListProps) {
  if (livres.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">Aucun livre pour le moment.</p>
        <p className="text-sm text-gray-400 mt-1">
          Cliquez sur « Ajouter un livre » pour créer votre premier livre.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {livres.map((livre) => (
        <div
          key={livre.id}
          className="flex flex-col border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm"
        >
          <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden">
            {livre.image_couverture_url ? (
              <img
                src={livre.image_couverture_url}
                alt={`Couverture de ${livre.titre}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-sm text-gray-400">Pas de couverture</span>
              </div>
            )}
          </div>

          <div className="flex flex-col flex-1 p-4">
            <h3 className="font-semibold text-gray-900 line-clamp-2">
              {livre.titre}
            </h3>
            <p className="text-lg font-bold text-blue-600 mt-1">
              {Number(livre.prix).toFixed(2)} €
            </p>

            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => onEdit(livre)}
                className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
              >
                Modifier
              </button>
              <button
                type="button"
                onClick={() => onDelete(livre)}
                className="flex-1 px-3 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}