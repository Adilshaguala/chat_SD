import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Busca ou cria uma conversa privada entre dois usuários
 */
export const getOrCreatePrivateConversation = async (
  supabase: SupabaseClient,
  currentUserId: string,
  otherUserId: string,
) => {
  // Buscar conversa privada existente entre os dois usuários
  const { data: existingConversation, error: searchError } = await supabase
    .from("conversations")
    .select("*, conversation_participants(*)")
    .eq("type", "private")
    .then(async (result) => {
      if (result.error) return result;

      // Filtrar no cliente já que não podemos fazer JOIN complexo direto
      const { data, error } = result;
      if (error) return { data: null, error };

      const conversation = data?.find((conv) => {
        const participants = conv.conversation_participants || [];
        const hasCurrentUser = participants.some(
          (p: any) => p.user_id === currentUserId,
        );
        const hasOtherUser = participants.some(
          (p: any) => p.user_id === otherUserId,
        );
        return hasCurrentUser && hasOtherUser && participants.length === 2;
      });

      return { data: conversation, error: null };
    });

  if (searchError) throw searchError;

  if (existingConversation) {
    return existingConversation;
  }

  // Criar nova conversa privada
  const { data: newConversation, error: createError } = await supabase
    .from("conversations")
    .insert({
      type: "private",
      created_by: currentUserId,
    })
    .select()
    .single();

  if (createError) throw createError;

  // Adicionar ambos os usuários como participantes
  const { error: participantsError } = await supabase
    .from("conversation_participants")
    .insert([
      {
        conversation_id: newConversation.id,
        user_id: currentUserId,
        role: "member",
      },
      {
        conversation_id: newConversation.id,
        user_id: otherUserId,
        role: "member",
      },
    ]);

  if (participantsError) throw participantsError;

  // Retornar conversa com participantes
  const { data: conversationWithParticipants, error: fetchError } =
    await supabase
      .from("conversations")
      .select("*, conversation_participants(*)")
      .eq("id", newConversation.id)
      .single();

  if (fetchError) throw fetchError;

  return conversationWithParticipants;
};

/**
 * Lista todas as conversas privadas do usuário autenticado
 */
export const getPrivateConversations = async (
  supabase: SupabaseClient,
  userId: string,
) => {
  const { data: conversations, error } = await supabase
    .from("conversation_participants")
    .select(
      `
      conversation_id,
      conversations(
        id,
        type,
        name,
        image_url,
        created_at,
        updated_at
      ),
      user_id
    `,
    )
    .eq("user_id", userId)
    .then(async (result) => {
      if (result.error) return result;

      // Filtrar apenas conversas privadas
      const privateConversations = result.data?.filter(
        (item: any) => item.conversations?.type === "private",
      );

      return { data: privateConversations, error: null };
    });

  if (error) throw error;

  // Enriquecer com última mensagem e outro participante
  const enrichedConversations = await Promise.all(
    (conversations || []).map(async (item: any) => {
      const conversationId = item.conversations.id;

      // Buscar último participante
      const { data: otherParticipant } = await supabase
        .from("conversation_participants")
        .select("user_id, profiles(*)")
        .eq("conversation_id", conversationId)
        .neq("user_id", userId)
        .single();

      // Buscar última mensagem
      const { data: lastMessage } = await supabase
        .from("messages")
        .select("id, content, created_at, sender_id")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      return {
        ...item.conversations,
        otherUser: otherParticipant?.profiles,
        lastMessage: lastMessage,
      };
    }),
  );

  return enrichedConversations;
};

/**
 * Envia uma mensagem em uma conversa
 */
export const sendMessage = async (
  supabase: SupabaseClient,
  conversationId: string,
  senderId: string,
  content: string,
  messageType: "text" | "image" | "video" | "audio" | "file" = "text",
) => {
  const { data: message, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      content,
      type: messageType,
    })
    .select()
    .single();

  if (error) throw error;

  // Criar status de mensagem (sent por padrão)
  await supabase.from("message_status").insert({
    message_id: message.id,
    user_id: senderId,
    status: "sent",
  });

  return message;
};

/**
 * Recupera mensagens de uma conversa com paginação
 */
export const getMessages = async (
  supabase: SupabaseClient,
  conversationId: string,
  limit: number = 50,
  offset: number = 0,
) => {
  const { data: messages, error } = await supabase
    .from("messages")
    .select(
      `
      *,
      sender:sender_id(id, name, avatar_url, is_online),
      message_attachments(*),
      message_reactions(*),
      message_status(*)
    `,
    )
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  return messages?.reverse() || []; // Reverter para ordem crescente
};

/**
 * Marca mensagens como lidas
 */
export const markMessagesAsRead = async (
  supabase: SupabaseClient,
  conversationId: string,
  userId: string,
) => {
  // Buscar IDs das mensagens não lidas
  const { data: messageIds } = await supabase
    .from("message_status")
    .select("message_id")
    .eq("status", "sent")
    .eq("user_id", userId)
    .then(async (result) => {
      if (result.error || !result.data) return { data: [] };

      // Filtrar apenas mensagens da conversa
      const { data: conversationMessageIds } = await supabase
        .from("messages")
        .select("id")
        .eq("conversation_id", conversationId)
        .in(
          "id",
          result.data.map((m) => m.message_id),
        );

      return { data: conversationMessageIds || [] };
    });

  if (!messageIds || messageIds.length === 0) return;

  // Atualizar status para 'read'
  const { error } = await supabase
    .from("message_status")
    .update({ status: "read" })
    .eq("user_id", userId)
    .in(
      "message_id",
      messageIds.map((m) => m.id),
    );

  if (error) throw error;
};

/**
 * Atualizar último momento visto do usuário na conversa
 */
export const updateLastReadAt = async (
  supabase: SupabaseClient,
  conversationId: string,
  userId: string,
) => {
  const { error } = await supabase
    .from("conversation_participants")
    .update({ last_read_at: new Date().toISOString() })
    .eq("conversation_id", conversationId)
    .eq("user_id", userId);

  if (error) throw error;
};

/**
 * Busca perfil do outro usuário em uma conversa privada
 */
export const getPrivateConversationOtherUser = async (
  supabase: SupabaseClient,
  conversationId: string,
  currentUserId: string,
) => {
  const { data: participant, error } = await supabase
    .from("conversation_participants")
    .select("user_id, profiles(*)")
    .eq("conversation_id", conversationId)
    .neq("user_id", currentUserId)
    .single();

  if (error) throw error;

  return participant?.profiles;
};

/**
 * Verifica se uma conversa existe (usado para validação)
 */
export const verifyConversationAccess = async (
  supabase: SupabaseClient,
  conversationId: string,
  userId: string,
) => {
  const { data, error } = await supabase
    .from("conversation_participants")
    .select("id")
    .eq("conversation_id", conversationId)
    .eq("user_id", userId)
    .single();

  if (error) return false;

  return !!data;
};
