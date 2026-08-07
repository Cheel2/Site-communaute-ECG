"use client";

import { useState } from "react";
import type { Livre } from "@/types/database";
import { LivresForm, type LivreFormValues } from "./livres-form";
import { LivresList } from "./livres-list";
import { DeleteModal } from "./delete-modal";
import {
  createLivre,
  updateLivre,
  deleteLivre,
  uploadCouverture,
  listLivres,
} from "@/features/livres/actions";

interface LivresClientProps {
  initialLivres: Livre[];
}

export function LivresClient({ initialLivres }: LivresClientProps) {
  const [livres, setLivres] = useState<Livre[]>(initialLivres);
  const [editingLivre, setEditingLivre] = useState<Livre | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Livre | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenCreate = () => {
    setEditingLivre(null);
    setError(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (livre: Livre) => {
    setEditingLivre(livre);
    setError(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingLivre(null);
    setError(null);
  };

  const handleOpenDelete = (livre: Livre) => {
    setDeleteTarget(livre);
    setError(null);
  };

  const handleCloseDelete = () => {
    setDeleteTarget(null);
  };

  const handleSubmit = async (
    values: LivreFormValues,
    couverture: File | null
  ) => {
    setIsSubmitting(true);
    setError(null);

    try {
      let imageUrl = editingLivre?.image_couverture_url ?? null;

      if (couverture) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", couverture);

        const uploadResult = await uploadCouverture(uploadFormData);

        if (uploadResult.error) {
          setError(uploadResult.error.message);
          return;
        }

        imageUrl = uploadResult.data.url;
      }

      const livreData = {
        ...values,
        image_couverture_url: imageUrl,
      };

      const result = editingLivre
        ? await updateLivre(editingLivre.id, livreData)
        : await createLivre(livreData);

      if (result.error) {
        setError(result.error.message);
        return;
      }

      const refreshResult = await listLivres();
      if (refreshResult.data) {
        setLivres(refreshResult.data);
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
      const result = await deleteLivre(deleteTarget.id);

      if (result.error) {
        setError(result.error.message);
        return;
      }

      setLivres((prev) => prev.filter((l) => l.id !== deleteTarget.id));
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Livres</h1>
        <button
          type="button"
          onClick={handleOpenCreate}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          Ajouter un livre
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
            {editingLivre ? "Modifier le livre" : "Nouveau livre"}
          </h2>
          <LivresForm
            mode={editingLivre ? "edit" : "create"}
            livre={editingLivre}
            onSubmit={handleSubmit}
            onCancel={handleCloseForm}
            isSubmitting={isSubmitting}
            error={error}
          />
        </div>
      )}

      <LivresList
        livres={livres}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      <DeleteModal
        livre={deleteTarget}
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}