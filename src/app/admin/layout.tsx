import { ReactNode } from "react";
import { redirect } from "next/navigation";
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

  if (!user) {
    redirect("/admin/login");
  }

  const { data: userData } = await supabase
    .from("utilisateur")
    .select("role")
    .eq("id", user.id)
    .single();

  return (
    <RoleProvider initialRole={userData?.role ?? null}>
      <AdminShell userEmail={user.email ?? ""}>{children}</AdminShell>
    </RoleProvider>
  );
}