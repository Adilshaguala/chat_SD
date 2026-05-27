import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  sendMessage,
  getMessages,
  updateLastReadAt,
  verifyConversationAccess,
} from "@/utils/supabase/chat";

/**
 * POST /api/messages
 * Enviar uma mensagem
 */
export async function POST(request: NextRequest) {
  try {
    const {
      conversationId,
      content,
      messageType = "text",
    } = await request.json();

    if (!conversationId || !content) {
      return NextResponse.json(
        { error: "conversationId e content são obrigatórios" },
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

    // Verificar se o usuário tem acesso a esta conversa
    const hasAccess = await verifyConversationAccess(
      supabase,
      conversationId,
      user.id,
    );

    if (!hasAccess) {
      return NextResponse.json(
        { error: "Acesso negado a esta conversa" },
        { status: 403 },
      );
    }

    const message = await sendMessage(
      supabase,
      conversationId,
      user.id,
      content,
      messageType,
    );

    // Atualizar last_read_at
    await updateLastReadAt(supabase, conversationId, user.id);

    return NextResponse.json(message);
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/messages?conversationId=...&limit=50&offset=0
 * Recuperar mensagens de uma conversa
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    if (!conversationId) {
      return NextResponse.json(
        { error: "conversationId é obrigatório" },
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

    // Verificar se o usuário tem acesso a esta conversa
    const hasAccess = await verifyConversationAccess(
      supabase,
      conversationId,
      user.id,
    );

    if (!hasAccess) {
      return NextResponse.json(
        { error: "Acesso negado a esta conversa" },
        { status: 403 },
      );
    }

    const messages = await getMessages(supabase, conversationId, limit, offset);

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Erro ao recuperar mensagens:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    );
  }
}
