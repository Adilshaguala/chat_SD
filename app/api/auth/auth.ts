"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        },
      },
    },
  );
}

export async function signUp(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const name = (formData.get("name") as string | null)?.trim() || "";
  const email = (formData.get("email") as string | null)?.trim() || "";
  const password = (formData.get("password") as string | null)?.trim() || "";

  // O profile é criado automaticamente no banco via trigger em auth.users,
  // usando raw_user_meta_data.name definido em options.data
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      data: { name },
    },
  });

  if (error) return { erro: error.message };

  redirect("/verificar-email");
}

export async function signIn(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Supabase retorna este erro quando o email não foi confirmado
    if (error.message === "Email not confirmed") {
      return {
        erro: "Email não confirmado. Verifica a tua caixa de entrada.",
        emailNaoConfirmado: true,
      };
    }
    return { erro: error.message };
  }

  redirect("/chat");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
