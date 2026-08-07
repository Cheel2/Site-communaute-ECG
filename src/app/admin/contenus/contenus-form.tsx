"use client";

import { useCallback } from "react";
import type { FormEvent } from "react";
import type { Rubrique } from "@/types/database";
import type { StatutContenu } from "@/features/contenus/schemas";
import { TiptapEditor } from "@/components/ui/tiptap-editor";
import { useAutoSave } from "@/features/contenus/use-auto-save";
import type { SaveBrouillonInput } from "@/features/brouillons/schemas";

interface ContenusFormProps {
  rubriques: Rubrique[];
  titre: string;
  texte: string;
  rubriqueId: string;
  statut: StatutContenu;
  imageUrl: string;
  isSaving: boolean;
  isEditing: boolean;
  contenuId?: string;
  onTitreChange: (value: string) => void;
  onTexteChange: (value: string) => void;
  onRubriqueChange: (value: string) => void;
  onStatutChange: (value: StatutContenu) => void;
  onImageUrlChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function SaveStatusIndicator({
  isSaving,
  lastSaved,
  error,
}: {
  isSaving: boolean;
  lastSaved: Date | null;
  error: string | null;
}) {
  if (error) {
    return (
      <p className="text-sm text-red-600" aria-live="polite">
        ⚠️ {error}
      </p>
    );
  }

  if (isSaving) {
    return (
      <p className="text-sm text-gray-500" aria-live="polite">
        Sauvegarde en cours…
      </p>
    );
  }

  if (lastSaved) {
    return (
      <p className="text-sm text-green-700" aria-live="polite">
        ✓ Dernière sauvegarde à {formatTime(lastSaved)}
      </p>
    );
  }

  return (
    <p className="text-sm text-gray-400" aria-live="polite">
      Sauvegarde automatique toutes les 30 secondes
    </p>
  );
}

export function ContenusForm({
  rubriques,
  titre,
  texte,
  rubriqueId,
  statut,
  imageUrl,
  isSaving,
  isEditing,
  contenuId,
  onTitreChange,
  onTexteChange,
  onRubriqueChange,
  onStatutChange,
  onImageUrlChange,
  onSubmit,
  onCancel,
}: ContenusFormProps) {
  const getData = useCallback(
    (): SaveBrouillonInput => ({
      titre,
      rubrique_id: rubriqueId || null,
      texte,
      image_url: imageUrl || null,
    }),
    [titre, rubriqueId, texte, imageUrl]
  );

  const {
    isSaving: isAutoSaving,
    lastSaved,
    error: autoSaveError,
  } = useAutoSave({
    contenuId: contenuId ?? null,
    getData,
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Titre */}
      <div>
        <label
          htmlFor="titre"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Titre <span className="text-red-500">*</span>
        </label>
        <input
          id="titre"
          type="text"
          value={titre}
          onChange={(event) => onTitreChange(event.target.value)}
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Titre du contenu"
        />
      </div>

      {/* Rubrique */}
      <div>
        <label
          htmlFor="rubrique_id"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Rubrique <span className="text-red-500">*</span>
        </label>
        <select
          id="rubrique_id"
          value={rubriqueId}
          onChange={(event) => onRubriqueChange(event.target.value)}
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">— Sélectionner une rubrique —</option>
          {rubriques.map((rubrique) => (
            <option key={rubrique.id} value={rubrique.id}>
              {rubrique.nom}
            </option>
          ))}
        </select>
      </div>

      {/* Éditeur TipTap + indicateur d'auto-save */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Texte
        </label>
        <TiptapEditor content={texte} onChange={onTexteChange} />
        <div className="mt-1">
          <SaveStatusIndicator
            isSaving={isAutoSaving}
            lastSaved={lastSaved}
            error={autoSaveError}
          />
        </div>
      </div>

      {/* Image (URL) */}
      <div>
        <label
          htmlFor="image_url"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Image (URL)
        </label>
        <input
          id="image_url"
          type="text"
          value={imageUrl}
          onChange={(event) => onImageUrlChange(event.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="URL de l'image (optionnel)"
        />
      </div>

      {/* Statut */}
      <div>
        <label
          htmlFor="statut"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Statut
        </label>
        <select
          id="statut"
          value={statut}
          onChange={(event) =>
            onStatutChange(event.target.value as StatutContenu)
          }
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="non_publie">Non publié</option>
          <option value="publie">Publié</option>
        </select>
      </div>

      {/* Boutons */}
      <div className="flex flex-col gap-3 border-t border-gray-200 pt-4 sm:flex-row">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving
            ? "Enregistrement…"
            : isEditing
              ? "Modifier le contenu"
              : "Créer le contenu"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}