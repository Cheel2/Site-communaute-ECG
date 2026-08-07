"use client";

import { useState, useCallback } from "react";
import type { Brouillon } from "@/types/database";
import { TiptapEditor } from "@/components/ui/tiptap-editor";
import { useAutoSave } from "@/features/contenus/use-auto-save";
import type { SaveBrouillonInput } from "@/features/brouillons/schemas";

interface RubriqueOption {
  id: string;
  nom: string;
}

interface ContenusFormProps {
  mode: "create" | "edit";
  contenuId?: string;
  initialTitre?: string;
  initialRubriqueId?: string;
  initialTexte?: string;
  initialStatut?: "publie" | "non_publie";
  initialMisEnAvant?: boolean;
  rubriques: RubriqueOption[];
  brouillonInitial?: Brouillon | null;
  onSubmit: (formData: FormData) => void;
  isSubmitting: boolean;
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
  mode,
  contenuId,
  initialTitre,
  initialRubriqueId,
  initialTexte,
  initialStatut,
  initialMisEnAvant,
  rubriques,
  brouillonInitial,
  onSubmit,
  isSubmitting,
}: ContenusFormProps) {
  const [titre, setTitre] = useState(
    brouillonInitial?.titre ?? initialTitre ?? ""
  );
  const [rubriqueId, setRubriqueId] = useState(
    brouillonInitial?.rubrique_id ?? initialRubriqueId ?? ""
  );
  const [texte, setTexte] = useState(
    brouillonInitial?.texte ?? initialTexte ?? ""
  );
  const [statut, setStatut] = useState<"publie" | "non_publie">(
    initialStatut ?? "non_publie"
  );
  const [misEnAvant, setMisEnAvant] = useState(initialMisEnAvant ?? false);

  const getData = useCallback((): SaveBrouillonInput => ({
    titre,
    rubrique_id: rubriqueId || null,
    texte,
    image_url: null,
  }), [titre, rubriqueId, texte]);

  const { isSaving, lastSaved, error } = useAutoSave({
    contenuId: contenuId ?? null,
    getData,
  });

  const handleTextChange = useCallback((html: string) => {
    setTexte(html);
  }, []);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    formData.set("titre", titre);
    formData.set("rubrique_id", rubriqueId);
    formData.set("texte", texte);
    formData.set("statut", statut);
    formData.set("mis_en_avant", String(misEnAvant));

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
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
          onChange={(event) => setTitre(event.target.value)}
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
          onChange={(event) => setRubriqueId(event.target.value)}
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

      {/* Éditeur TipTap */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Texte
        </label>
        <TiptapEditor content={texte} onChange={handleTextChange} />
        <div className="mt-1">
          <SaveStatusIndicator
            isSaving={isSaving}
            lastSaved={lastSaved}
            error={error}
          />
        </div>
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
            setStatut(event.target.value as "publie" | "non_publie")
          }
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="non_publie">Non publié</option>
          <option value="publie">Publié</option>
        </select>
      </div>

      {/* Mise en avant */}
      <div className="flex items-center gap-2">
        <input
          id="mis_en_avant"
          type="checkbox"
          checked={misEnAvant}
          onChange={(event) => setMisEnAvant(event.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label
          htmlFor="mis_en_avant"
          className="text-sm font-medium text-gray-700"
        >
          Mettre en avant sur l'accueil
        </label>
      </div>

      {/* Bouton de soumission */}
      <div className="pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting
            ? "Enregistrement…"
            : mode === "create"
              ? "Créer le contenu"
              : "Modifier le contenu"}
        </button>
      </div>
    </form>
  );
}