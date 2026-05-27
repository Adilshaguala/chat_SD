export interface ChatCardProps {
    id: string;
    isSelected?: boolean;
    name: string;
    avatarSrc?: string;
    avatarFallback: string;
    lastMessage: string;
    time: string;
    unreadCount?: number;
    onPress?: () => void;
}

export interface Profile {
    id: string;
    name: string;
    avatar_url: string | null;
    is_online: boolean;
}

export interface MessageAttachment {
    id: string;
    file_url: string;
    file_name: string;
    file_type: string;
    file_size: number;
    mime_type: string | null;
    thumbnail_url: string | null;
    duration: number | null;
}

export interface MessageReaction {
    id: string;
    user_id: string;
    emoji: string;
}

export interface ReplyPreview {
    id: string;
    content: string | null;
    sender_name: string;
}

export type MessageType = "text" | "image" | "video" | "audio" | "file" | "deleted";
export type MessageStatusValue = "sent" | "delivered" | "read";

export interface MessageData {
    id: string;
    content: string | null;
    type: MessageType;
    created_at: string;
    updated_at: string;
    is_pinned: boolean;
    is_deleted: boolean;
    sender: Profile;
    reactions: MessageReaction[];
    attachments: MessageAttachment[];
    status?: MessageStatusValue;
    reply_to?: ReplyPreview | null;
}

export interface MessageProps {
    message: MessageData;
    currentUserId: string;
    onReact: (messageId: string, emoji: string) => void;
    onReply?: (message: MessageData) => void;
    onCopy?: (content: string) => void;
    onEdit?: (messageId: string, content: string) => void;
    onDelete?: (messageId: string) => void;
    onForward?: (messageId: string) => void;
}

export interface ChatHomeProps {
    selectedConversationId: string | null;
    onSelectConversation: (id: string) => void;
}


export interface Conversation {
    id: string;
    type: "group" | "private";
    name: string;
    image_url?: string;
    fallback: string;
    avatarFallback: string;
    is_online?: boolean;
    participant1?: string;
    participant2?: string;
    participant3?: string;
    participantsCount?: number;
    lastMessage: string;
    time: string;
    unreadCount?: number;
    messages: MessageData[];
}

export interface ConversationHandlers {
    onCall?: () => void;
    onVideoCall?: () => void;
    onMenu?: () => void;
}