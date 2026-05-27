import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { MessageData } from "@/lib/props";

export function useMessages(conversationId: string | null) {
    const [messages, setMessages] = useState<MessageData[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!conversationId) return;
        const supabase = createClient();

        async function fetchMessages() {
            setLoading(true);
            const { data, error } = await supabase
                .from("messages")
                .select(`
                    id,
                    content,
                    type,
                    created_at,
                    updated_at,
                    is_pinned,
                    is_deleted,
                    reply_to_id,
                    sender:profiles!sender_id (
                        id,
                        name,
                        avatar_url,
                        is_online
                    ),
                    message_reactions (
                        id,
                        user_id,
                        emoji
                    ),
                    message_attachments (
                        id,
                        file_url,
                        file_name,
                        file_type,
                        file_size,
                        mime_type,
                        thumbnail_url,
                        duration
                    )
                `)
                .eq("conversation_id", conversationId)
                .order("created_at", { ascending: true });

            if (error) {
                setLoading(false);
                return;
            }

            const mapped: MessageData[] = (data ?? []).map((msg: any) => ({
                id: msg.id,
                content: msg.content,
                type: msg.type,
                created_at: msg.created_at,
                updated_at: msg.updated_at,
                is_pinned: msg.is_pinned,
                is_deleted: msg.is_deleted,
                sender: msg.sender,
                reactions: msg.message_reactions ?? [],
                attachments: msg.message_attachments ?? [],
                status: undefined,
                reply_to: null,
            }));

            setMessages(mapped);
            setLoading(false);
        }

        fetchMessages();
    }, [conversationId]);

    return { messages, loading };
}