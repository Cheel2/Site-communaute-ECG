'use client';

import { useEffect, useState, type FormEvent } from 'react';
import type {
  CreateUtilisateurInput,
  UpdateUtilisateurInput,
} from '@/features/utilisateurs/schemas';
import type { Utilisateur } from '@/types/database';

type RoleUtilisateur = Utilisateur['role'];

const OPTIONS_ROLE: Array<{ value: RoleUtilisateur; label: string }> = [
  { value: 'total', label: 'Total' },
  { value: 'lecture_seule', label: 'Lecture seule' },
];

type UtilisateursFormProps = {
  utilisateurEnEdition: Utilisateur | null;
  isSubmitting: boolean;
  onSubmitCreate: (input: CreateUtilisateurInput) => void;
  onSubmitUpdate: (id: string, input: UpdateUtilisateurInput) => void;
  onCancelEdit: () => void;
};

export function UtilisateursForm({
  utilisateurEnEdition,
  isSubmitting,
  onSubmitCreate,
  onSubmitUpdate,
  onCancelEdit,
}: UtilisateursFormProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<RoleUtilisateur>('lecture_seule');

  const enEdition = utilisateurEnEdition !== null;

  useEffect(() => {
    if (utilisateurEnEdition) {
      setEmail(utilisateurEnEdition.email);
      setRole(utilisateurEnEdition.role);
    } else {
      setEmail('');
      setRole('lecture_seule');
    }
  }, [utilisateurEnEdition]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (enEdition && utilisateurEnEdition) {
      onSubmitUpdate(utilisateurEnEdition.id, { role });
      return;
    }

    onSubmitCreate({ email: email.trim(), role });
    setEmail('');
    setRole('lecture_seule');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6"
    >
      <h2 className="text-lg font-semibold text-gray-900">
        {enEdition ? 'Modifier le rôle' : 'Créer un utilisateur'}
      </h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="utilisateur-email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="utilisateur-email"
            name="email"
            type="email"
            required={!enEdition}
            disabled={enEdition}
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="utilisateur@example.com"
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
          />
          {enEdition && (
            <p className="mt-1 text-xs text-gray-500">L&apos;email ne peut pas être modifié.</p>
          )}
        </div>

        <div>
          <label htmlFor="utilisateur-role" className="block text-sm font-medium text-gray-700">
            Rôle
          </label>
          <select
            id="utilisateur-role"
            name="role"
            required
            value={role}
            onChange={(event) => setRole(event.target.value as RoleUtilisateur)}
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {OPTIONS_ROLE.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting && (
            <span
              aria-hidden="true"
              className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
            />
          )}
          {enEdition ? 'Enregistrer' : "Créer l'utilisateur"}
        </button>
        {enEdition && (
          <button
            type="button"
            onClick={onCancelEdit}
            disabled={isSubmitting}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}