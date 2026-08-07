'use client';

import { useState, useTransition } from 'react';
import type { FormEvent } from 'react';
import type { Banniere } from '@/types/database';
import { updateBanniere } from '@/features/banniere/actions';
import { updateBanniereSchema } from '@/features/banniere/schemas';

type FormStatus =
  | { state: 'idle' }
  | { state: 'loading' }
  | { state: 'success'; message: string }
  | { state: 'error'; message: string };

type BanniereDashboardClientProps = {
  initialBanniere: Banniere | null;
};

export default function BanniereDashboardClient({
  initialBanniere,
}: BanniereDashboardClientProps) {
  const [message, setMessage] = useState(initialBanniere?.message ?? '');
  const [imageUrl, setImageUrl] = useState(initialBanniere?.image_url ?? '');
  const [status, setStatus] = useState<FormStatus>({ state: 'idle' });
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsed = updateBanniereSchema.safeParse({
      message,
      image_url: imageUrl,
    });

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      setStatus({
        state: 'error',
        message: firstIssue?.message ?? 'Le formulaire est invalide.',
      });
      return;
    }

    setStatus({ state: 'loading' });

    startTransition(async () => {
      try {
        const response = await updateBanniere(parsed.data);

        if (response.error) {
          setStatus({ state: 'error', message: response.error.message });
          return;
        }

        const savedBanniere = response.data;

        if (!savedBanniere) {
          setStatus({
            state: 'error',
            message: 'La réponse du serveur est invalide.',
          });
          return;
        }

        setMessage(savedBanniere.message);
        setImageUrl(savedBanniere.image_url ?? '');
        setStatus({
          state: 'success',
          message: 'La bannière a été enregistrée avec succès.',
        });
      } catch {
        setStatus({
          state: 'error',
          message: 'Une erreur réseau est survenue.',
        });
      }
    });
  };

  const isLoading = isPending || status.state === 'loading';

  return (
    <section className="w-full space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-900">Bannière</h1>
        <p className="text-sm text-gray-600">
          Modifiez le message et l&apos;image de la bannière unique.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="w-full space-y-4"
        aria-busy={isLoading}
        noValidate
      >
        <div className="flex flex-col gap-4">
          <div className="space-y-1">
            <label
              htmlFor="banniere-message"
              className="block text-sm font-medium text-gray-800"
            >
              Message
            </label>
            <input
              id="banniere-message"
              name="message"
              type="text"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              disabled={isLoading}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="banniere-image-url"
              className="block text-sm font-medium text-gray-800"
            >
              URL de l&apos;image
            </label>
            <input
              id="banniere-image-url"
              name="image_url"
              type="text"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              disabled={isLoading}
              placeholder="https://exemple.gouv.fr/banniere.webp"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            <p className="text-xs text-gray-500">
              Laissez vide pour retirer l&apos;image de la bannière.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isLoading ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>

        {status.state === 'error' && (
          <p
            role="alert"
            className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {status.message}
          </p>
        )}

        {status.state === 'success' && (
          <p
            role="status"
            className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700"
          >
            {status.message}
          </p>
        )}
      </form>
    </section>
  );
}