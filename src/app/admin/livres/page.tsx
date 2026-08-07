import { listLivres } from "@/features/livres/actions";
import { LivresClient } from "./livres-client";
import type { Livre } from "@/types/database";

export default async function LivresPage() {
  const result = await listLivres();
  const livres: Livre[] = result.data ?? [];

  return <LivresClient initialLivres={livres} />;
}
