"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { saveBrouillon } from "@/features/brouillons/actions";
import type { SaveBrouillonInput } from "@/features/brouillons/schemas";

interface UseAutoSaveParams {
  contenuId: string | null;
  getData: () => SaveBrouillonInput;
}

interface UseAutoSaveReturn {
  isSaving: boolean;
  lastSaved: Date | null;
  error: string | null;
}

export function useAutoSave({
  contenuId,
  getData,
}: UseAutoSaveParams): UseAutoSaveReturn {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const lastSavedSnapshot = useRef<string>("");
  const getDataRef = useRef(getData);
  const contenuIdRef = useRef(contenuId);

  // Keep refs updated without re-creating the interval
  useEffect(() => {
    getDataRef.current = getData;
  }, [getData]);

  useEffect(() => {
    contenuIdRef.current = contenuId;
  }, [contenuId]);

  const performSave = useCallback(async () => {
    // Ne sauvegarder que si on édite un contenu existant
    const currentContenuId = contenuIdRef.current;
    if (!currentContenuId) return;

    const currentData = getDataRef.current();
    const currentSnapshot = JSON.stringify(currentData);

    // Ne pas sauvegarder si rien n'a changé
    if (currentSnapshot === lastSavedSnapshot.current) return;

    setIsSaving(true);
    setError(null);

    const result = await saveBrouillon({
      ...currentData,
      contenu_id: currentContenuId,
    });

    if (result.error) {
      setError(result.error.message);
      setIsSaving(false);
      return;
    }

    lastSavedSnapshot.current = currentSnapshot;
    setLastSaved(new Date());
    setIsSaving(false);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(performSave, 30000);

    return () => {
      clearInterval(intervalId);
    };
  }, [performSave]);

  return { isSaving, lastSaved, error };
}