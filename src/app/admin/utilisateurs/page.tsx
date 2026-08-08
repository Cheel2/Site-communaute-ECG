import type { Metadata } from 'next';
import { listUtilisateurs } from '@/features/utilisateurs/actions';
import type { Utilisateur } from '@/types/database';
import { UtilisateursClient } from './utilisateurs-client';

export const metadata: Metadata = {
  title: 'Utilisateurs — Administration',
  description: 'Gestion des comptes utilisateurs du back-office.',
};

export default async function UtilisateursPage() {
  const resultat = await listUtilisateurs();

  const utilisateurs: Utilisateur[] = resultat.error ? [] : resultat.data;
  const messageErreurInitial = resultat.error ? resultat.error.message : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Utilisateurs</h1>
        <p className="mt-1 text-sm text-gray-600">
          Créez des comptes, modifiez les rôles, désactivez ou réactivez des utilisateurs.
        </p>
      </div>
      <UtilisateursClient
        initialUtilisateurs={utilisateurs}
        messageErreurInitial={messageErreurInitial}
      />
    </div>
  );
}