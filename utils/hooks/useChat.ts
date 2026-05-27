"use client";

import { useCallback, useEffect, useState } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import {
  getOrCreatePrivateConversation,
  getPrivateConversations,
  getMessages,
  sendMessage as sendMessageService,
  updateLastReadAt,
  markMessagesAsRead,
  getPrivateConversationOtherUser,
} from "@/utils/supabase/chat";
import { ChatMessage, PrivateConversation } from "@/types/index";

/**
 * Hook para gerenciar uma conversa privada
 */
export const usePrivateConversation = (conversationId: string | null) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otherUser, setOtherUser] = useState<any>(null);
  const [offset, setOffset] = useState(0);
  const supabase = createClient();

  // Carregar mensagens
  const loadMessages = useCallback(async () => {
    if (!conversationId) return;

    try {
      setIsLoading(true);
      setError(null);

      const data = await getMessages(supabase, conversationId, 50, offset);
      setMessages(data);

      // Atualizar último lido
      const session = await supabase.auth.getSession();
      if (session.data.session?.user) {
        await updateLastReadAt(
          supabase,
          conversationId,
          session.data.session.user.id,
        );
        await markMessagesAsRead(
          supabase,
          conversationId,
          session.data.session.user.id,
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar mensagens",
      );
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, offset, supabase]);

  // Carregar outro usuário
  const loadOtherUser = useCallback(async () => {
    if (!conversationId) return;

    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session?.user) return;

      const user = await getPrivateConversationOtherUser(
        supabase,
        conversationId,
        session.data.session.user.id,
      );
      setOtherUser(user);
    } catch (err) {
      console.error("Erro ao carregar outro usuário:", err);
    }
  }, [conversationId, supabase]);

  // Enviar mensagem
  const sendMessage = useCallback(
    async (content: string) => {
      if (!conversationId) throw new Error("Sem conversa selecionada");

      try {
        const session = await supabase.auth.getSession();
        if (!session.data.session?.user) throw new Error("Não autenticado");

        const newMessage = await sendMessageService(
          supabase,
          conversationId,
          session.data.session.user.id,
          content,
        );

        setMessages([...messages, newMessage]);
      } catch (err) {
        throw err instanceof Error ? err : new Error("Erro ao enviar mensagem");
      }
    },
    [conversationId, messages, supabase],
  );

  // Carregar mais mensagens (paginação)
  const loadMoreMessages = useCallback(() => {
    setOffset((prev) => prev + 50);
  }, []);

  // Efeito para carregar mensagens quando conversationId mudar
  useEffect(() => {
    setOffset(0);
    loadMessages();
    loadOtherUser();
  }, [conversationId, loadMessages, loadOtherUser]);

  // Efeito para paginação
  useEffect(() => {
    if (offset > 0) {
      loadMessages();
    }
  }, [offset, loadMessages]);

  return {
    messages,
    isLoading,
    error,
    otherUser,
    sendMessage,
    loadMoreMessages,
  };
};

/**
 * Hook para listar conversas privadas
 */
export const usePrivateConversations = () => {
  const [conversations, setConversations] = useState<PrivateConversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const loadConversations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const session = await supabase.auth.getSession();
      if (!session.data.session?.user) {
        throw new Error("Não autenticado");
      }

      const data = await getPrivateConversations(
        supabase,
        session.data.session.user.id,
      );
      setConversations(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar conversas",
      );
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  // Carregar conversas ao montar o componente
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return {
    conversations,
    isLoading,
    error,
    refetch: loadConversations,
  };
};

/**
 * Hook para criar ou obter conversa privada com um usuário
 */
export const useGetOrCreatePrivateConversation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const getOrCreate = useCallback(
    async (otherUserId: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const session = await supabase.auth.getSession();
        if (!session.data.session?.user) {
          throw new Error("Não autenticado");
        }

        const conversation = await getOrCreatePrivateConversation(
          supabase,
          session.data.session.user.id,
          otherUserId,
        );

        return conversation;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao criar/obter conversa";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [supabase],
  );

  return {
    isLoading,
    error,
    getOrCreate,
  };
};
