"use server";

import { createClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api";
import { loginSchema } from "./schemas";

type AuthActionResult = ApiResponse<{ success: boolean; redirectTo?: string }>;

export async function login(
  _prevState: AuthActionResult,
  formData: FormData
): Promise<AuthActionResult> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    return {
      error: {
        code: "VALIDATION_ERROR",
        message: "Email ou mot de passe invalide.",
      },
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return {
      error: {
        code: "INVALID_CREDENTIALS",
        message: "Identifiants invalides",
      },
    };
  }

  // ✅ Récupérer redirectedFrom du formData s'il est présent
  const redirectedFrom = formData.get("redirectedFrom")?.toString() || null;

  return {
    data: {
      success: true,
      redirectTo: redirectedFrom || "/admin/tableau-de-bord",
    },
  };
}

export async function logout(): Promise<ApiResponse<{ success: boolean }>> {
  const supabase = await createClient();

  await supabase.auth.signOut();

  return {
    data: {
      success: true,
    },
  };
}
