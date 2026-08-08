'use client';

import { useState, useTransition, type FormEvent } from 'react';
import {
  upsertSeo,
  updateWhatsappConfig,
  type WhatsappConfig,
} from '@/features/parametres/actions';
import type { UpdateSeoInput } from '@/features/parametres/schemas';
import type { PageSeo } from '@/types/database';

type Feedback = { type: 'success' | 'error'; message: string } | null;

type SeoChampsValeurs = {
  titre: string;
  meta_description: string;
  mots_cles: string;
};

type ParametresClientProps = {
  initialWhatsapp: WhatsappConfig;
  initialPagesSeo: PageSeo[];
  messageErreurWhatsapp: string | null;
  messageErreurSeo: string | null;
};

type SeoItemFormProps = {
  seo: PageSeo;
  isSubmitting: boolean;
  onSubmit: (input: UpdateSeoInput) => void;
  onCancel: () => void;
};

type SeoAddFormProps = {
  isSubmitting: boolean;
  onSubmit: (input: UpdateSeoInput) => void;
  onCancel: () => void;
};

const VALEURS_SEO_VIDES: SeoChampsValeurs = {
  titre: '',
  meta_description: '',
  mots_cles: '',
};

export function ParametresClient({
  initialWhatsapp,
  initialPagesSeo,
  messageErreurWhatsapp,
  messageErreurSeo,
}: ParametresClientProps) {
  // --- Section WhatsApp : état de sauvegarde indépendant ---
  const [numero, setNumero] = useState(initialWhatsapp.numero);
  const [messageDefaut, setMessageDefaut] = useState(initialWhatsapp.message_defaut);
  const [feedbackWhatsapp, setFeedbackWhatsapp] = useState<Feedback>(
    messageErreurWhatsapp ? { type: 'error', message: messageErreurWhatsapp } : null
  );
  const [isWhatsappPending, startWhatsappTransition] = useTransition();

  // --- Section SEO : état de sauvegarde indépendant ---
  const [pagesSeo, setPagesSeo] = useState<PageSeo[]>(initialPagesSeo);
  const [feedbackSeo, setFeedbackSeo] = useState<Feedback>(
    messageErreurSeo ? { type: 'error', message: messageErreurSeo } : null
  );
  const [isSeoPending, startSeoTransition] = useTransition();
  const [cheminEnEdition, setCheminEnEdition] = useState<string | null>(null);
  const [formAjoutOuverte, setFormAjoutOuverte] = useState(false);

  const handleSaveWhatsapp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startWhatsappTransition(async () => {
      const resultat = await updateWhatsappConfig({
        numero: numero.trim(),
        message_defaut: messageDefaut.trim(),
      });

      if (resultat.error) {
        setFeedbackWhatsapp({ type: 'error', message: resultat.error.message });
        return;
      }

      const config = resultat.data;
      setNumero(config.numero);
      setMessageDefaut(config.message_defaut);
      setFeedbackWhatsapp({
        type: 'success',
        message: 'Configuration WhatsApp enregistrée.',
      });
    });
  };

  const handleUpsertSeo = (input: UpdateSeoInput) => {
    startSeoTransition(async () => {
      const resultat = await upsertSeo(input);

      if (resultat.error) {
        setFeedbackSeo({ type: 'error', message: resultat.error.message });
        return;
      }

      const seoEnregistre = resultat.data;
      setPagesSeo((prev) => {
        const existe = prev.some((item) => item.id === seoEnregistre.id);
        if (existe) {
          return prev.map((item) => (item.id === seoEnregistre.id ? seoEnregistre : item));
        }
        return [...prev, seoEnregistre].sort((a, b) => a.chemin.localeCompare(b.chemin));
      });
      setCheminEnEdition(null);
      setFormAjoutOuverte(false);
      setFeedbackSeo({
        type: 'success',
        message: `Référencement de la page ${seoEnregistre.chemin} enregistré.`,
      });
    });
  };

  const handleStartEdit = (chemin: string) => {
    setFormAjoutOuverte(false);
    setCheminEnEdition(chemin);
  };

  const handleOpenAjout = () => {
    setCheminEnEdition(null);
    setFormAjoutOuverte(true);
  };

  return (
    <div className="space-y-8">
      {/* Section 1 : Coordonnées WhatsApp */}
      <section
        aria-labelledby="parametres-whatsapp-titre"
        className="rounded-lg border border-gray-200 bg-white"
      >
        <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
          <h2 id="parametres-whatsapp-titre" className="text-lg font-semibold text-gray-900">
            Coordonnées WhatsApp
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Numéro utilisé pour les redirections WhatsApp (livres, événements, partenariat).
          </p>
        </div>
        <form onSubmit={handleSaveWhatsapp} className="space-y-4 p-4 sm:p-6">
          <FeedbackBanner feedback={feedbackWhatsapp} />
          <div>
            <label htmlFor="whatsapp-numero" className="block text-sm font-medium text-gray-700">
              Numéro (format international)
            </label>
            <input
              id="whatsapp-numero"
              name="numero"
              type="tel"
              required
              autoComplete="tel"
              value={numero}
              onChange={(event) => setNumero(event.target.value)}
              placeholder="+24106000000"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">Exemple : +24106000000</p>
          </div>
          <div>
            <label
              htmlFor="whatsapp-message-defaut"
              className="block text-sm font-medium text-gray-700"
            >
              Message pré-rempli par défaut
            </label>
            <textarea
              id="whatsapp-message-defaut"
              name="message_defaut"
              rows={3}
              value={messageDefaut}
              onChange={(event) => setMessageDefaut(event.target.value)}
              placeholder="Bonjour, je vous contacte depuis le site du ministère."
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isWhatsappPending}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isWhatsappPending && <Spinner />}
              Sauvegarder
            </button>
          </div>
        </form>
      </section>

      {/* Section 2 : Référencement (SEO) par page */}
      <section
        aria-labelledby="parametres-seo-titre"
        className="rounded-lg border border-gray-200 bg-white"
      >
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-200 px-4 py-4 sm:px-6">
          <div>
            <h2 id="parametres-seo-titre" className="text-lg font-semibold text-gray-900">
              Référencement (SEO) par page
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Titre, meta description et mots-clés de chaque page du site.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenAjout}
            disabled={formAjoutOuverte || isSeoPending}
            className="rounded-lg border border-blue-600 bg-white px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Ajouter un chemin
          </button>
        </div>
        <div className="space-y-4 p-4 sm:p-6">
          <FeedbackBanner feedback={feedbackSeo} />

          {formAjoutOuverte && (
            <SeoAddForm
              isSubmitting={isSeoPending}
              onSubmit={handleUpsertSeo}
              onCancel={() => setFormAjoutOuverte(false)}
            />
          )}

          {pagesSeo.length === 0 && !formAjoutOuverte ? (
            <p className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-500">
              Aucun chemin configuré. Utilisez « Ajouter un chemin » pour créer une première
              entrée (ex : /evenements).
            </p>
          ) : (
            <ul className="space-y-3">
              {pagesSeo.map((seo) => (
                <li key={seo.id} className="rounded-lg border border-gray-200">
                  {cheminEnEdition === seo.chemin ? (
                    <SeoItemForm
                      seo={seo}
                      isSubmitting={isSeoPending}
                      onSubmit={handleUpsertSeo}
                      onCancel={() => setCheminEnEdition(null)}
                    />
                  ) : (
                    <div className="flex flex-wrap items-center justify-between gap-2 p-4">
                      <div className="min-w-0">
                        <p className="break-all font-mono text-sm font-medium text-gray-900">
                          {seo.chemin}
                        </p>
                        <p className="truncate text-xs text-gray-500">
                          {seo.titre || 'Titre non défini'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleStartEdit(seo.chemin)}
                        disabled={isSeoPending}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Modifier
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

function FeedbackBanner({ feedback }: { feedback: Feedback }) {
  if (!feedback) {
    return null;
  }

  return (
    <div
      role={feedback.type === 'error' ? 'alert' : 'status'}
      aria-live={feedback.type === 'error' ? 'assertive' : 'polite'}
      className={
        feedback.type === 'error'
          ? 'rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800'
          : 'rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800'
      }
    >
      {feedback.message}
    </div>
  );
}

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
    />
  );
}

function SeoChamps({
  valeurs,
  onChange,
  idPrefix,
}: {
  valeurs: SeoChampsValeurs;
  onChange: (valeurs: SeoChampsValeurs) => void;
  idPrefix: string;
}) {
  return (
    <div className="space-y-3">
      <div>
        <label htmlFor={`${idPrefix}-titre`} className="block text-sm font-medium text-gray-700">
          Titre
        </label>
        <input
          id={`${idPrefix}-titre`}
          type="text"
          value={valeurs.titre}
          onChange={(event) => onChange({ ...valeurs, titre: event.target.value })}
          placeholder="Titre affiché dans les résultats de recherche"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div>
        <label
          htmlFor={`${idPrefix}-meta-description`}
          className="block text-sm font-medium text-gray-700"
        >
          Meta description
        </label>
        <input
          id={`${idPrefix}-meta-description`}
          type="text"
          value={valeurs.meta_description}
          onChange={(event) =>
            onChange({ ...valeurs, meta_description: event.target.value })
          }
          placeholder="Description courte pour les moteurs de recherche"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div>
        <label
          htmlFor={`${idPrefix}-mots-cles`}
          className="block text-sm font-medium text-gray-700"
        >
          Mots-clés
        </label>
        <input
          id={`${idPrefix}-mots-cles`}
          type="text"
          value={valeurs.mots_cles}
          onChange={(event) => onChange({ ...valeurs, mots_cles: event.target.value })}
          placeholder="mot1, mot2, mot3"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}

function SeoItemForm({ seo, isSubmitting, onSubmit, onCancel }: SeoItemFormProps) {
  const [valeurs, setValeurs] = useState<SeoChampsValeurs>({
    titre: seo.titre,
    meta_description: seo.meta_description,
    mots_cles: seo.mots_cles,
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      chemin: seo.chemin,
      titre: valeurs.titre.trim(),
      meta_description: valeurs.meta_description.trim(),
      mots_cles: valeurs.mots_cles.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4">
      <p className="break-all font-mono text-sm font-medium text-gray-900">{seo.chemin}</p>
      <SeoChamps valeurs={valeurs} onChange={setValeurs} idPrefix={`seo-${seo.id}`} />
      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting && <Spinner />}
          Mettre à jour
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}

function SeoAddForm({ isSubmitting, onSubmit, onCancel }: SeoAddFormProps) {
  const [chemin, setChemin] = useState('');
  const [valeurs, setValeurs] = useState<SeoChampsValeurs>(VALEURS_SEO_VIDES);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      chemin: chemin.trim(),
      titre: valeurs.titre.trim(),
      meta_description: valeurs.meta_description.trim(),
      mots_cles: valeurs.mots_cles.trim(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-lg border border-dashed border-gray-300 p-4"
    >
      <div>
        <label htmlFor="seo-ajout-chemin" className="block text-sm font-medium text-gray-700">
          Chemin de la page
        </label>
        <input
          id="seo-ajout-chemin"
          type="text"
          required
          value={chemin}
          onChange={(event) => setChemin(event.target.value)}
          placeholder="/evenements"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">Exemple : /evenements</p>
      </div>
      <SeoChamps valeurs={valeurs} onChange={setValeurs} idPrefix="seo-ajout" />
      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting && <Spinner />}
          Ajouter
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}