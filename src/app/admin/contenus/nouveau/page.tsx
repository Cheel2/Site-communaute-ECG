import { listRubriques } from "@/features/rubriques/actions";
import NouveauContenuClient from "./nouveau-client";

export default async function NouveauContenuPage() {
  const rubriques = await listRubriques();

  return <NouveauContenuClient rubriques={rubriques} />;
}
