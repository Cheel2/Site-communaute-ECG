// src/app/admin/tableau-de-bord/page.tsx
// Server Component — Tableau de bord admin.
// MODIFICATION MC-18 : Ajout import + rendu DashboardStatsClient.
// Le code bannière MC-4 reste strictement inchangé.

import BanniereDashboardClient from "./banniere-dashboard-client";
// --- AJOUT MC-18 ---
import DashboardStatsClient from "./dashboard-stats-client";

export default async function TableauDeBordPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>

      {/* Section Bannière — MC-4 (inchangé) */}
      <section aria-label="Gestion de la bannière">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">Bannière</h2>
        <BanniereDashboardClient />
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