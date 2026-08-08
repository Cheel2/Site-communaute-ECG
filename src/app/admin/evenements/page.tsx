import { listEvenements } from "@/features/evenements/actions";
import { EvenementsClient } from "./evenements-client";
import type { Evenement } from "@/types/database";

export default async function EvenementsPage() {
  const result = await listEvenements();
  const evenements: Evenement[] = result.data ?? [];

  return <EvenementsClient initialEvenements={evenements} />;
}
