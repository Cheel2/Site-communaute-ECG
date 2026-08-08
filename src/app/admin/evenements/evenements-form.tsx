"use client";

import { useState, useEffect } from "react";
import type { Evenement } from "@/types/database";

export type EvenementType = "recurrent" | "special";

export interface EvenementFormValues {
  titre: string;
  description: string;
  date_debut: string;
  date_fin: string | null;
  lieu: string | null;
  type: EvenementType;
  image_url: string | null;
  statut: string;
}

interface EvenementsFormProps {
  mode: "create" | "edit";
  evenement?: Evenement | null;
  onSubmit: (values: EvenementFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  error: string | null;
}

const STATUT_OPTIONS = [
  { value: "planifie", label: "Planifié" },
  { value: "publie", label: "Publié" },
  { value: "annule", label: "Annulé" },
] as const;

export function EvenementsForm({
  mode,
  evenement,
  onSubmit,
  onCancel,
  isSubmitting,
  error,
}: EvenementsFormProps) {
  const [titre, setTitre] = useState(evenement?.titre ?? "");
  const [description, setDescription] = useState(evenement?.description ?? "");
  const [dateDebut, setDateDebut] = useState(evenement?.date_debut ?? "");
  const [dateFin, setDateFin] = useState(evenement?.date_fin ?? "");
  const [lieu, setLieu] = useState(evenement?.lieu ?? "");
  const [type, setType] = useState<EvenementType>(evenement?.type ?? "recurrent");
  const [imageUrl, setImageUrl] = useState(evenement?.image_url ?? "");
  const [statut, setStatut] = useState(evenement?.statut ?? "planifie");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    setTitre(evenement?.titre ?? "");
    setDescription(evenement?.description ?? "");
    setDateDebut(evenement?.date_debut ?? "");
    setDateFin(evenement?.date_fin ?? "");
    setLieu(evenement?.lieu ?? "");
    setType(evenement?.type ?? "recurrent");
    setImageUrl(evenement?.image_url ?? "");
    setStatut(evenement?.statut ?? "planifie");
    setFormError(null);
  }, [evenement]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (!titre.trim()) {
      setFormError("Le titre est requis.");
      return;
    }

    if (!dateDebut) {
      setFormError("La date de début est requise.");
      return;
    }

    if (dateFin && Date.parse(dateFin) < Date.parse(dateDebut)) {
      setFormError("La date de fin ne peut pas précéder la date de début.");
      return;
    }

    await onSubmit({
      titre: titre.trim(),
      description,
      date_debut: dateDebut,
      date_fin: dateFin || null,
      lieu: lieu.trim() || null,
      type,
      image_url: imageUrl.trim() || null,
      statut,
    });
  };

  const displayError = formError ?? error;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {displayError && (
        <div
          className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md"
          role="alert"
          aria-live="polite"
        >
          {displayError}
        </div>
      )}

      {/* Titre */}
      <div>
        <label
          htmlFor="evenement-titre"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Titre <span className="text-red-500">*</span>
        </label>
        <input
          id="evenement-titre"
          type="text"
          value={titre}
          onChange={(event) => setTitre(event.target.value)}
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Titre de l'événement"
        />
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="evenement-description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          id="evenement-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={4}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Description de l'événement"
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="evenement-date-debut"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Date de début <span className="text-red-500">*</span>
          </label>
          <input
            id="evenement-date-debut"
            type="date"
            value={dateDebut}
            onChange={(event) => setDateDebut(event.target.value)}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="evenement-date-fin"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Date de fin
          </label>
          <input
            id="evenement-date-fin"
            type="date"
            value={dateFin}
            onChange={(event) => setDateFin(event.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Lieu */}
      <div>
        <label
          htmlFor="evenement-lieu"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Lieu
        </label>
        <input
          id="evenement-lieu"
          type="text"
          value={lieu}
          onChange={(event) => setLieu(event.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Lieu de l'événement"
        />
      </div>

      {/* Type — SÉLECTEUR STRICT 2 OPTIONS */}
      <div>
        <label
          htmlFor="evenement-type"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Type <span className="text-red-500">*</span>
        </label>
        <select
          id="evenement-type"
          value={type}
          onChange={(event) => setType(event.target.value as EvenementType)}
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="recurrent">Récurrent</option>
          <option value="special">Spécial</option>
        </select>
      </div>

      {/* Image URL */}
      <div>
        <label
          htmlFor="evenement-image-url"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          URL de l'image
        </label>
        <input
          id="evenement-image-url"
          type="url"
          value={imageUrl}
          onChange={(event) => setImageUrl(event.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="https://..."
        />
      </div>

      {/* Statut */}
      <div>
        <label
          htmlFor="evenement-statut"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Statut
        </label>
        <select
          id="evenement-statut"
          value={statut}
          onChange={(event) => setStatut(event.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          {STATUT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting
            ? "Enregistrement…"
            : mode === "create"
              ? "Créer l'événement"
              : "Enregistrer les modifications"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}