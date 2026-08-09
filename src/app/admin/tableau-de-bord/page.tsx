// src/app/admin/tableau-de-bord/page.tsx
// Server Component — Tableau de bord admin.
// MODIFICATION MC-18 : Ajout import + rendu DashboardStatsClient sous la bannière.
// Bannière MC-4 restaurée à l'identique : fetch serveur + prop required `initialBanniere`.

import { getBanniere } from "@/features/banniere/actions";
import BanniereDashboardClient from "./banniere-dashboard-client";
// --- AJOUT MC-18 ---
import DashboardStatsClient from "./dashboard-stats-client";

export default async function TableauDeBordPage() {
  const banniere = await getBanniere();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>

      {/* Section Bannière — MC-4 (signature d'origine respectée) */}
      <section aria-label="Gestion de la bannière">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">Bannière</h2>
        <BanniereDashboardClient initialBanniere={banniere} />
      </section>

      {/* --- AJOUT MC-18 : Statistiques --- */}
      <section aria-label="Statistiques">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Statistiques
        </h2>
        <DashboardStatsClient />
      </section>
    </div>
  );
}