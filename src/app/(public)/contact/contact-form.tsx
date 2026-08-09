// src/app/(public)/contact/contact-form.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { submitContact, ContactFormData } from '@/features/contact/actions';

const STORAGE_KEY_CONTACT = 'formulaire_contact_brouillon';
const DEBOUNCE_DELAY_MS = 500;

type FormState = 'idle' | 'pending' | 'success' | 'error';

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    nom: '',
    email: '',
    message: '',
  });
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY_CONTACT);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as ContactFormData;
        setFormData(parsed);
      } catch {
        localStorage.removeItem(STORAGE_KEY_CONTACT);
      }
    }
  }, []);

  useEffect(() => {
    if (formState !== 'pending' && formState !== 'success') {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      debounceTimer.current = setTimeout(() => {
        localStorage.setItem(STORAGE_KEY_CONTACT, JSON.stringify(formData));
      }, DEBOUNCE_DELAY_MS);
    }
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [formData, formState]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('pending');
    setErrorMessage('');

    try {
      const result = await submitContact(formData);

      if (result.error) {
        setFormState('error');
        setErrorMessage(result.error.message);
      } else {
        setFormState('success');
        localStorage.removeItem(STORAGE_KEY_CONTACT);
      }
    } catch {
      setFormState('error');
      setErrorMessage('Impossible de contacter le serveur. Vérifiez votre connexion et réessayez.');
    }
  };

  if (formState === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <p className="text-green-800 font-semibold">Votre message a été envoyé avec succès.</p>
        <p className="text-green-700 text-sm mt-2">Nous vous répondrons dans les plus brefs délais.</p>
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
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
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
        {formState === 'pending' ? 'Envoi en cours...' : 'Envoyer'}
      </button>
    </form>
  );
}