import type { Evenement, EvenementType } from "@/types/database";

interface EvenementsListProps {
  evenements: Evenement[];
  onEdit: (evenement: Evenement) => void;
  onDelete: (evenement: Evenement) => void;
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function TypeBadge({ type }: { type: EvenementType }) {
  if (type === "recurrent") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
        Récurrent
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
      Spécial
    </span>
  );
}

function DateRange({
  dateDebut,
  dateFin,
}: {
  dateDebut: string;
  dateFin: string | null;
}) {
  if (dateFin) {
    return (
      <span>
        Du {formatDate(dateDebut)} au {formatDate(dateFin)}
      </span>
    );
  }

  return <span>{formatDate(dateDebut)}</span>;
}

export function EvenementsList({
  evenements,
  onEdit,
  onDelete,
}: EvenementsListProps) {
  if (evenements.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">Aucun événement pour le moment.</p>
        <p className="text-sm text-gray-400 mt-1">
          Cliquez sur « Ajouter un événement » pour créer votre premier
          événement.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {evenements.map((evenement) => (
        <div
          key={evenement.id}
          className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-gray-900 truncate">
                  {evenement.titre}
                </h3>
                <TypeBadge type={evenement.type} />
              </div>

              <p className="text-sm text-gray-600 mt-1">
                <DateRange
                  dateDebut={evenement.date_debut}
                  dateFin={evenement.date_fin}
                />
              </p>

              {evenement.lieu && (
                <p className="text-sm text-gray-500 mt-0.5">
                  📍 {evenement.lieu}
                </p>
              )}
            </div>

            <div className="flex gap-2 sm:flex-shrink-0">
              <button
                type="button"
                onClick={() => onEdit(evenement)}
                className="px-3 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
              >
                Modifier
              </button>
              <button
                type="button"
                onClick={() => onDelete(evenement)}
                className="px-3 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition-colors"
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