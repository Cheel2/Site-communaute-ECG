'use client';

import type { ContenuAvecRubrique } from '@/features/contenus/actions';

type ContenusListProps = {
  contenus: ContenuAvecRubrique[];
  isBusy: boolean;
  onEdit: (contenu: ContenuAvecRubrique) => void;
  onDelete: (contenu: ContenuAvecRubrique) => void;
};

function StatutBadge({ statut }: { statut: string }) {
  const isPublie = statut === 'publie';

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isPublie
          ? 'bg-green-50 text-green-700'
          : 'bg-gray-100 text-gray-700'
      }`}
    >
      {isPublie ? 'Publié' : 'Non publié'}
    </span>
  );
}

export default function ContenusList({
  contenus,
  isBusy,
  onEdit,
  onDelete,
}: ContenusListProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-medium text-gray-900">
          Contenus existants
        </h2>
        <span className="text-sm text-gray-500">
          {contenus.length} contenu{contenus.length > 1 ? 's' : ''}
        </span>
      </div>

      {contenus.length === 0 ? (
        <p className="rounded-md border border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-600">
          Aucun contenu. Créez le premier contenu avec le formulaire.
        </p>
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-lg border border-gray-200 md:block">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Titre</th>
                  <th className="px-4 py-3 font-medium">Rubrique</th>
                  <th className="px-4 py-3 font-medium">Statut</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contenus.map((contenu) => (
                  <tr
                    key={contenu.id}
                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {contenu.titre}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {contenu.rubrique?.nom ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      <StatutBadge statut={contenu.statut} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(contenu)}
                          disabled={isBusy}
                          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Modifier
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(contenu)}
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
            {contenus.map((contenu) => (
              <li
                key={contenu.id}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="font-medium text-gray-900">{contenu.titre}</p>
                    <p className="text-xs text-gray-500">
                      Rubrique : {contenu.rubrique?.nom ?? '—'}
                    </p>
                  </div>
                  <StatutBadge statut={contenu.statut} />
                </div>

                <div className="mt-3 grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(contenu)}
                    disabled={isBusy}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Modifier
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(contenu)}
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
  );
}