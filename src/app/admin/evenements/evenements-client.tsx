"use client";

import { useState } from "react";
import type { Evenement } from "@/types/database";
import { EvenementsForm, type EvenementFormValues } from "./evenements-form";
import { EvenementsList } from "./evenements-list";
import { DeleteModal } from "./delete-modal";
import {
  createEvenement,
  updateEvenement,
  deleteEvenement,
  listEvenements,
} from "@/features/evenements/actions";

interface EvenementsClientProps {
  initialEvenements: Evenement[];
}

export function EvenementsClient({
  initialEvenements,
}: EvenementsClientProps) {
  const [evenements, setEvenements] =
    useState<Evenement[]>(initialEvenements);
  const [editingEvenement, setEditingEvenement] = useState<Evenement | null>(
    null
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Evenement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenCreate = () => {
    setEditingEvenement(null);
    setError(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (evenement: Evenement) => {
    setEditingEvenement(evenement);
    setError(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingEvenement(null);
    setError(null);
  };

  const handleOpenDelete = (evenement: Evenement) => {
    setDeleteTarget(evenement);
    setError(null);
  };

  const handleCloseDelete = () => {
    setDeleteTarget(null);
  };

  const handleSubmit = async (values: EvenementFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = editingEvenement
        ? await updateEvenement(editingEvenement.id, values)
        : await createEvenement(values);

      if (result.error) {
        setError(result.error.message);
        return;
      }

      const refreshResult = await listEvenements();
      if (refreshResult.data) {
        setEvenements(refreshResult.data);
      }

      handleCloseForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    setError(null);

    try {
      const result = await deleteEvenement(deleteTarget.id);

      if (result.error) {
        setError(result.error.message);
        return;
      }

      setEvenements((prev) =>
        prev.filter((e) => e.id !== deleteTarget.id)
      );
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Événements</h1>
        <button
          type="button"
          onClick={handleOpenCreate}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          Ajouter un événement
        </button>
      </div>

      {error && (
        <div
          className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      )}

      {isFormOpen && (
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingEvenement
              ? "Modifier l'événement"
              : "Nouvel événement"}
          </h2>
          <EvenementsForm
            mode={editingEvenement ? "edit" : "create"}
            evenement={editingEvenement}
            onSubmit={handleSubmit}
            onCancel={handleCloseForm}
            isSubmitting={isSubmitting}
            error={error}
          />
        </div>
      )}

      <EvenementsList
        evenements={evenements}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      <DeleteModal
        evenement={deleteTarget}
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}