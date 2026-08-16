import { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import { RoleProvider } from "@/components/RoleContext";
import { AdminShell } from "@/components/AdminShell";

type Props = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: Props) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ⚠️ La redirection est gérée par le middleware.
  // On laisse passer toutes les requêtes, y compris /admin/login.
  // Si l'utilisateur n'est pas authentifié sur une route protégée,
  // le middleware le redirigera vers /admin/login.

  // Récupérer le rôle de l'utilisateur (si authentifié)
  let role = null;
  if (user) {
    const { data: userData } = await supabase
      .from("utilisateur")
      .select("role")
      .eq("id", user.id)
      .single();
    role = userData?.role ?? null;
  }

  return (
    <RoleProvider initialRole={role}>
      <AdminShell userEmail={user?.email ?? ""}>{children}</AdminShell>
    </RoleProvider>
  );
}
