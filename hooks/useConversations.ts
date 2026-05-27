import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Conversation } from "@/lib/props";

export function useConversations() {
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const supabase = createClient();
        async function fetchConversations(userId: string) {
            const { data, error } = await supabase
                .from("conversation_participants")
                .select(`
                    conversation_id,
                    conversations (
                        id,
                        type,
                        name,
                        image_url,
                        conversation_participants (
                            profiles (
                                id,
                                name,
                                avatar_url,
                                is_online
                            )
                        )
                    )
                `)
                .eq("user_id", userId);

            if (error) {
                setError(error.message);
                setLoading(false);
                return;
            }

            const mapped: Conversation[] = (data ?? [])
                .filter((row: any) => row.conversations != null)
                .map((row: any) => {
                    const conv = row.conversations;
                    const participants = (conv.conversation_participants ?? [])
                        .map((p: any) => p.profiles)
                        .filter((p: any) => p && p.id !== userId);

                    const isPrivate = conv.type === "private";
                    const other = isPrivate ? participants[0] : null;

                    return {
                        id: conv.id,
                        type: conv.type,
                        name: isPrivate ? (other?.name ?? "Desconhecido") : conv.name,
                        image_url: isPrivate
                            ? (other?.avatar_url ?? undefined)
                            : (conv.image_url ?? undefined),
                        avatarFallback: isPrivate
                            ? (other?.name?.slice(0, 2).toUpperCase() ?? "??")
                            : (conv.name?.slice(0, 2).toUpperCase() ?? "??"),
                        is_online: isPrivate ? (other?.is_online ?? false) : undefined,
                        participant1: !isPrivate ? participants[0]?.name : undefined,
                        participant2: !isPrivate ? participants[1]?.name : undefined,
                        participant3: !isPrivate ? participants[2]?.name : undefined,
                        participantsCount: !isPrivate ? participants.length : undefined,
                        lastMessage: "",
                        time: "",
                        unreadCount: 0,
                        messages: [],
                    };
                });

            setConversations(mapped);
            setLoading(false);
        }

        async function init() {
            const {
                data: { user },
                error: authError,
            } = await supabase.auth.getUser();

            if (authError || !user) {
                setError(authError?.message ?? "Utilizador não autenticado");
                setLoading(false);
                return;
            }

            setCurrentUserId(user.id);
            await fetchConversations(user.id);
            console.log(user.email);
        }

        init();
    }, []);
    console.log(conversations)
    return { conversations, currentUserId, loading, error };
}



