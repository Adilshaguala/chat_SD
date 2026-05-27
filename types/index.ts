import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface MessageAttachment {
  id: string;
  message_id: string;
  file_url: string;
  file_name: string;
  file_type: string;
  file_size: number;
  mime_type: string | null;
  thumbnail_url: string | null;
  duration: number | null;
  created_at: string;
}

export interface MessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
}

export interface MessageStatus {
  id: string;
  message_id: string;
  user_id: string;
  status: "sent" | "delivered" | "read";
  updated_at: string;
}

export interface PrivateConversation {
  id: string;
  type: "private";
  created_at: string;
  updated_at: string;
  otherUser: {
    id: string;
    name: string;
    avatar_url: string | null;
    is_online: boolean;
  };
  lastMessage?: {
    id: string;
    content: string | null;
    created_at: string;
    sender_id: string;
  };
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string | null;
  type: "text" | "image" | "video" | "audio" | "file" | "deleted";
  reply_to_id: string | null;
  thread_id: string | null;
  is_pinned: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  sender: {
    id: string;
    name: string;
    avatar_url: string | null;
    is_online: boolean;
  };
  message_attachments: MessageAttachment[];
  message_reactions: MessageReaction[];
  message_status: MessageStatus[];
}

export interface PrivateConversationContextType {
  currentConversationId: string | null;
  otherUser: PrivateConversation["otherUser"] | null;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  loadMoreMessages: () => Promise<void>;
  markAsRead: () => Promise<void>;
}
