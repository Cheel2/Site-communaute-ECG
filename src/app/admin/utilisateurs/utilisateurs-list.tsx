'use client';

import type { Utilisateur } from '@/types/database';

type RoleUtilisateur = Utilisateur['role'];
type StatutUtilisateur = Utilisateur['statut'];

type UtilisateursListProps = {
  utilisateurs: Utilisateur[];
  onStartEdit: (utilisateur: Utilisateur) => void;
  onDesactiver: (utilisateur: Utilisateur) => void;
  onReactiver: (utilisateur: Utilisateur) => void;
};

type BoutonsActionProps = {
  utilisateur: Utilisateur;
  onStartEdit: (utilisateur: Utilisateur) => void;
  onDesactiver: (utilisateur: Utilisateur) => void;
  onReactiver: (utilisateur: Utilisateur) => void;
};

const LIBELLES_ROLE: Record<RoleUtilisateur, string> = {
  total: 'Total',
  lecture_seule: 'Lecture seule',
};

const LIBELLES_STATUT: Record<StatutUtilisateur, string> = {
  actif: 'Actif',
  desactive: 'Désactivé',
};

function RoleBadge({ role }: { role: RoleUtilisateur }) {
  const styles =
    role === 'total' ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-700';

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles}`}
    >
      {LIBELLES_ROLE[role]}
    </span>
  );
}

function StatutBadge({ statut }: { statut: StatutUtilisateur }) {
  const styles =
    statut === 'actif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700';

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles}`}
    >
      {LIBELLES_STATUT[statut]}
    </span>
  );
}

function BoutonsAction({
  utilisateur,
  onStartEdit,
  onDesactiver,
  onReactiver,
}: BoutonsActionProps) {
  return (
    <div className="flex flex-wrap justify-start gap-2 md:justify-end">
      <button
        type="button"
        onClick={() => onStartEdit(utilisateur)}
        className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
      >
        Modifier le rôle
      </button>
      {utilisateur.statut === 'actif' ? (
        <button
          type="button"
          onClick={() => onDesactiver(utilisateur)}
          className="rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          Désactiver
        </button>
      ) : (
        <button
          type="button"
          onClick={() => onReactiver(utilisateur)}
          className="rounded-lg border border-green-300 bg-white px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          Réactiver
        </button>
      )}
    </div>
  );
}

export function UtilisateursList({
  utilisateurs,
  onStartEdit,
  onDesactiver,
  onReactiver,
}: UtilisateursListProps) {
  if (utilisateurs.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
        Aucun utilisateur pour le moment. Créez un premier compte avec le formulaire ci-dessus.
      </div>
    );
  }

  return (
    <>
      {/* Desktop : tableau */}
      <div className="hidden overflow-x-auto rounded-lg border border-gray-200 bg-white md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th scope="col" className="px-4 py-3">Email</th>
              <th scope="col" className="px-4 py-3">Rôle</th>
              <th scope="col" className="px-4 py-3">Statut</th>
              <th scope="col" className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {utilisateurs.map((utilisateur) => (
              <tr key={utilisateur.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{utilisateur.email}</td>
                <td className="px-4 py-3">
                  <RoleBadge role={utilisateur.role} />
                </td>
                <td className="px-4 py-3">
                  <StatutBadge statut={utilisateur.statut} />
                </td>
                <td className="px-4 py-3">
                  <BoutonsAction
                    utilisateur={utilisateur}
                    onStartEdit={onStartEdit}
                    onDesactiver={onDesactiver}
                    onReactiver={onReactiver}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile : cartes (min 375px) */}
      <ul className="space-y-3 md:hidden">
        {utilisateurs.map((utilisateur) => (
          <li key={utilisateur.id} className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="break-all text-sm font-medium text-gray-900">{utilisateur.email}</p>
              <StatutBadge statut={utilisateur.statut} />
            </div>
            <div className="mt-2">
              <RoleBadge role={utilisateur.role} />
            </div>
            <div className="mt-4">
              <BoutonsAction
                utilisateur={utilisateur}
                onStartEdit={onStartEdit}
                onDesactiver={onDesactiver}
                onReactiver={onReactiver}
              />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}