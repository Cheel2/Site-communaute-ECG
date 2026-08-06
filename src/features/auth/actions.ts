"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import type { ApiResponse } from "@/types/api";
import { loginSchema } from "./schemas";

type AuthActionResult = ApiResponse<{ success: boolean }>;

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

  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

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

  return {
    data: {
      success: true,
    },
  };
}

export async function logout(): Promise<AuthActionResult> {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  await supabase.auth.signOut();

  return {
    data: {
      success: true,
    },
  };
}