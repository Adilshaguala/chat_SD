import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  getOrCreatePrivateConversation,
  getPrivateConversations,
} from "@/utils/supabase/chat";

/**
 * POST /api/conversations/private
 * Criar ou obter conversa privada entre dois usuários
 */
export async function POST(request: NextRequest) {
  try {
    const { otherUserId } = await request.json();

    if (!otherUserId) {
      return NextResponse.json(
        { error: "otherUserId é obrigatório" },
        { status: 400 },
      );
    }

    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options),
              );
            } catch {
              // Handle cookie setting errors silently
            }
          },
        },
      },
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 },
      );
    }

    if (user.id === otherUserId) {
      return NextResponse.json(
        { error: "Não é possível criar conversa consigo mesmo" },
        { status: 400 },
      );
    }

    const conversation = await getOrCreatePrivateConversation(
      supabase,
      user.id,
      otherUserId,
    );

    return NextResponse.json(conversation);
  } catch (error) {
    console.error("Erro ao criar/obter conversa privada:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/conversations
 * Listar todas as conversas privadas do usuário
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options),
              );
            } catch {
              // Handle cookie setting errors silently
            }
          },
        },
      },
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 },
      );
    }

    const conversations = await getPrivateConversations(supabase, user.id);

    return NextResponse.json(conversations);
  } catch (error) {
    console.error("Erro ao listar conversas:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    );
  }
}
