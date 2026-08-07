"use client";

import { useState, useEffect, useCallback } from "react";
import type { Livre } from "@/types/database";

export interface LivreFormValues {
  titre: string;
  description: string;
  prix: number;
  lien_amazon: string;
  lien_whatsapp: string;
}

interface LivresFormProps {
  mode: "create" | "edit";
  livre?: Livre | null;
  onSubmit: (values: LivreFormValues, couverture: File | null) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  error: string | null;
}

export function LivresForm({
  mode,
  livre,
  onSubmit,
  onCancel,
  isSubmitting,
  error,
}: LivresFormProps) {
  const [titre, setTitre] = useState(livre?.titre ?? "");
  const [description, setDescription] = useState(livre?.description ?? "");
  const [prix, setPrix] = useState(livre ? String(livre.prix) : "");
  const [lienAmazon, setLienAmazon] = useState(livre?.lien_amazon ?? "");
  const [lienWhatsapp, setLienWhatsapp] = useState(
    livre?.lien_whatsapp ?? ""
  );
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    setTitre(livre?.titre ?? "");
    setDescription(livre?.description ?? "");
    setPrix(livre ? String(livre.prix) : "");
    setLienAmazon(livre?.lien_amazon ?? "");
    setLienWhatsapp(livre?.lien_whatsapp ?? "");
    setFile(null);
    setPreviewUrl(null);
    setFormError(null);
  }, [livre]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0] ?? null;
      setFile(selectedFile);
      setFormError(null);

      if (selectedFile) {
        setPreviewUrl(URL.createObjectURL(selectedFile));
      } else {
        setPreviewUrl(null);
      }
    },
    []
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (!titre.trim()) {
      setFormError("Le titre est requis.");
      return;
    }

    const prixNumber = parseFloat(prix);
    if (Number.isNaN(prixNumber) || prixNumber <= 0) {
      setFormError("Le prix doit être un nombre positif.");
      return;
    }

    await onSubmit(
      {
        titre: titre.trim(),
        description,
        prix: prixNumber,
        lien_amazon: lienAmazon,
        lien_whatsapp: lienWhatsapp,
      },
      file
    );
  };

  const displayImage = previewUrl ?? livre?.image_couverture_url ?? null;
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
          htmlFor="livre-titre"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Titre <span className="text-red-500">*</span>
        </label>
        <input
          id="livre-titre"
          type="text"
          value={titre}
          onChange={(event) => setTitre(event.target.value)}
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Titre du livre"
        />
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="livre-description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          id="livre-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={4}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Description du livre"
        />
      </div>

      {/* Prix */}
      <div>
        <label
          htmlFor="livre-prix"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Prix <span className="text-red-500">*</span>
        </label>
        <input
          id="livre-prix"
          type="number"
          step="0.01"
          min="0"
          value={prix}
          onChange={(event) => setPrix(event.target.value)}
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="0.00"
        />
      </div>

      {/* Lien Amazon */}
      <div>
        <label
          htmlFor="livre-lien-amazon"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Lien Amazon
        </label>
        <input
          id="livre-lien-amazon"
          type="url"
          value={lienAmazon}
          onChange={(event) => setLienAmazon(event.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="https://www.amazon.com/..."
        />
      </div>

      {/* Lien WhatsApp */}
      <div>
        <label
          htmlFor="livre-lien-whatsapp"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Lien WhatsApp
        </label>
        <input
          id="livre-lien-whatsapp"
          type="url"
          value={lienWhatsapp}
          onChange={(event) => setLienWhatsapp(event.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="https://wa.me/..."
        />
      </div>

      {/* Couverture */}
      <div>
        <label
          htmlFor="livre-couverture"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Image de couverture
        </label>
        <input
          id="livre-couverture"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <p className="mt-1 text-xs text-gray-500">
          Formats acceptés : JPEG, PNG, WebP, GIF. Taille max : 5 Mo.
        </p>

        {displayImage && (
          <div className="mt-3">
            <p className="text-xs font-medium text-gray-600 mb-1">
              {previewUrl ? "Prévisualisation du nouveau fichier" : "Couverture actuelle"}
            </p>
            <img
              src={displayImage}
              alt="Prévisualisation de la couverture"
              className="h-48 w-auto object-cover rounded-md border border-gray-200"
            />
          </div>
        )}
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
              ? "Créer le livre"
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