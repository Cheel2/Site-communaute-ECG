"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createContenu } from "@/features/contenus/actions";
import { listRubriques } from "@/features/rubriques/actions";
import { ContenusForm } from "../contenus-form";
import type { Rubrique } from "@/types/database";

export default function NouveauContenuPage() {
  const router = useRouter();
  const [rubriques, setRubriques] = useState<Rubrique[]>([]);
  const [titre, setTitre] = useState("");
  const [texte, setTexte] = useState("");
  const [rubriqueId, setRubriqueId] = useState("");
  const [statut, setStatut] = useState<"publie" | "non_publie">("non_publie");
  const [imageUrl, setImageUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    listRubriques()
      .then((data) => {
        setRubriques(data);
        if (data.length === 1) {
          setRubriqueId(data[0].id);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (isSaving) return;

      const payload = {
        titre: titre.trim(),
        texte,
        rubrique_id: rubriqueId,
        statut,
        image_url: imageUrl.trim() || null,
      };

      setIsSaving(true);
      setFeedback(null);

      try {
        const response = await createContenu(payload);
        if (response.error) {
          setFeedback({ type: "error", message: response.error.message });
          return;
        }
        setFeedback({ type: "success", message: "Contenu créé avec succès." });
        setTimeout(() => router.push("/admin/contenus"), 1500);
      } catch {
        setFeedback({ type: "error", message: "Une erreur réseau est survenue." });
      } finally {
        setIsSaving(false);
      }
    },
    [titre, texte, rubriqueId, statut, imageUrl, isSaving, router]
  );

  const handleCancel = useCallback(() => {
    router.push("/admin/contenus");
  }, [router]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <p className="text-gray-600">Chargement des rubriques…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Nouveau contenu
      </h1>

      {feedback && (
        <div
          role="alert"
          className={`mb-4 rounded-md border px-4 py-3 text-sm ${
            feedback.type === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-green-200 bg-green-50 text-green-700"
          }`}
        >
          {feedback.message}
        </div>
      )}

      <ContenusForm
        rubriques={rubriques}
        titre={titre}
        texte={texte}
        rubriqueId={rubriqueId}
        statut={statut}
        imageUrl={imageUrl}
        isSaving={isSaving}
        isEditing={false}
        onTitreChange={setTitre}
        onTexteChange={setTexte}
        onRubriqueChange={setRubriqueId}
        onStatutChange={setStatut}
        onImageUrlChange={setImageUrl}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
