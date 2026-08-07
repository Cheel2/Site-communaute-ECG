'use client';

import type { Rubrique } from '@/types/database';

type RubriquesListProps = {
  rubriques: Rubrique[];
  isBusy: boolean;
  onEdit: (rubrique: Rubrique) => void;
  onDelete: (rubrique: Rubrique) => void;
};

export default function RubriquesList({
  rubriques,
  isBusy,
  onEdit,
  onDelete,
}: RubriquesListProps) {
  return (
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
                          onClick={() => onEdit(rubrique)}
                          disabled={isBusy}
                          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Modifier
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(rubrique)}
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
                    <p className="font-medium text-gray-900">{rubrique.nom}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      Ordre : {rubrique.ordre_affichage}
                    </p>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(rubrique)}
                    disabled={isBusy}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Modifier
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(rubrique)}
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