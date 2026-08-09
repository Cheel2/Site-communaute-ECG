// src/app/(public)/partenariat/partenariat-form.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { submitPartenariat, PartenaireFormData } from '@/features/partenariat/actions';

const STORAGE_KEY_PARTENARIAT = 'formulaire_partenariat_brouillon';
const DEBOUNCE_DELAY_MS = 500;

type FormState = 'idle' | 'pending' | 'success' | 'error';

interface PartenariatFormProps {
  numeroWhatsApp: string;
}

export function PartenariatForm({ numeroWhatsApp }: PartenariatFormProps) {
  const [formData, setFormData] = useState<PartenaireFormData>({
    nom: '',
    email: '',
    pays: '',
  });
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY_PARTENARIAT);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as PartenaireFormData;
        setFormData(parsed);
      } catch {
        localStorage.removeItem(STORAGE_KEY_PARTENARIAT);
      }
    }
  }, []);

  useEffect(() => {
    if (formState !== 'pending' && formState !== 'success') {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      debounceTimer.current = setTimeout(() => {
        localStorage.setItem(STORAGE_KEY_PARTENARIAT, JSON.stringify(formData));
      }, DEBOUNCE_DELAY_MS);
    }
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [formData, formState]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('pending');
    setErrorMessage('');

    try {
      const result = await submitPartenariat(formData);

      if (result.error) {
        setFormState('error');
        setErrorMessage(result.error.message);
      } else {
        setFormState('success');
        localStorage.removeItem(STORAGE_KEY_PARTENARIAT);

        if (numeroWhatsApp) {
          const message = `Bonjour, je souhaite devenir partenaire du ministère. Nom: ${formData.nom}, Email: ${formData.email}, Pays: ${formData.pays}`;
          const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(message)}`;
          window.open(url, '_blank', 'noopener,noreferrer');
        }
      }
    } catch {
      setFormState('error');
      setErrorMessage('Impossible de contacter le serveur. Vérifiez votre connexion et réessayez.');
    }
  };

  if (formState === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <p className="text-green-800 font-semibold">Votre demande de partenariat a été enregistrée.</p>
        <p className="text-green-700 text-sm mt-2">
          {numeroWhatsApp
            ? 'WhatsApp va s\'ouvrir pour finaliser votre inscription.'
            : 'Nous vous contacterons dans les plus brefs délais.'}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
          Nom
        </label>
        <input
          type="text"
          id="nom"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          required
          disabled={formState === 'pending'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={formState === 'pending'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
      </div>

      <div>
        <label htmlFor="pays" className="block text-sm font-medium text-gray-700 mb-1">
          Pays
        </label>
        <input
          type="text"
          id="pays"
          name="pays"
          value={formData.pays}
          onChange={handleChange}
          required
          disabled={formState === 'pending'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
      </div>

      {formState === 'error' && errorMessage && (
        <div role="alert" aria-live="assertive" className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-red-800 text-sm">{errorMessage}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={formState === 'pending'}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {formState === 'pending' ? 'Envoi en cours...' : 'Devenir partenaire'}
      </button>
    </form>
  );
}