"use client"
import ChatInputField from "@/components/chatInpuField";
import ChatMain from "@/components/chatMain";
import ChatHeader from "@/components/chatHeader";
import {
  Card,
} from "@heroui/react";
import { MessageSquare } from "lucide-react";
import ChatHome from "./chatHome/page";
import { Conversation, MessageData } from "@/lib/props";
import { useState } from "react";


const currentUserId = "user-001";

const exampleMessage: MessageData = {
  id: "msg-001",
  content: "Olá! Viste o documento que enviei ontem?",
  type: "text",
  created_at: "2025-05-27T14:32:00.000Z",
  updated_at: "2025-05-27T14:32:00.000Z",
  is_pinned: false,
  is_deleted: false,

  sender: {
    id: "user-002",            // diferente de currentUserId → receive
    name: "Ana Beatriz",
    avatar_url: "https://i.pravatar.cc/150?u=user-002",
    is_online: true,
  },

  status: undefined,           // status só aparece em mensagens enviadas

  reply_to: null,

  reactions: [
    { id: "r-001", user_id: "user-001", emoji: "👍" },  // mine: true
    { id: "r-002", user_id: "user-002", emoji: "👍" },  // mine: false → count = 2
    { id: "r-003", user_id: "user-003", emoji: "❤️" },
  ],

  attachments: [],
};


const deletedMessage: MessageData = {
  id: "msg-003",
  content: null,
  type: "deleted",
  created_at: "2025-05-27T14:40:00.000Z",
  updated_at: "2025-05-27T14:40:00.000Z",
  is_pinned: false,
  is_deleted: true,            // ← renderiza o placeholder "Mensagem apagada"
  sender: {
    id: "user-002",
    name: "Ana Beatriz",
    avatar_url: null,
    is_online: false,
  },
  status: undefined,
  reply_to: null,
  reactions: [],
  attachments: [],
};

// ── Mensagem enviada, com reply e status ──
const sentMessage: MessageData = {
  id: "msg-002",
  content: "Sim, já vi! Vou rever ainda hoje.",
  type: "text",
  created_at: "2025-05-27T14:35:00.000Z",
  updated_at: "2025-05-27T14:35:00.000Z",
  is_pinned: false,
  is_deleted: false,

  sender: {
    id: "user-001",            // igual a currentUserId → send
    name: "Adilson",
    avatar_url: null,
    is_online: true,
  },

  status: "read",

  reply_to: {
    id: "msg-001",
    content: "Olá! Viste o documento que enviei ontem?",
    sender_name: "Ana Beatriz",
  },

  reactions: [],

  attachments: [
    {
      id: "att-001",
      file_url: "https://example.com/doc.pdf",
      file_name: "relatorio_q1.pdf",
      file_type: "file",
      file_size: 204800,       // 200 KB em bytes
      mime_type: "application/pdf",
      thumbnail_url: null,
      duration: null,
    },
  ],
};

const mockConversations: Conversation[] = [
  {
    id: "conv-001",
    type: "private",
    name: "Adilson",
    image_url: "https://img.heroui.chat/image/avatar?w=400&h=400&u=2",
    avatarFallback: "AD",
    is_online: true,
    lastMessage: "Onde estas, estou na faculdade",
    time: "Ontem",
    unreadCount: 9,
    messages: [exampleMessage, sentMessage],
  },
  {
    id: "conv-002",
    type: "private",
    name: "Ana Beatriz",
    image_url: "https://img.heroui.chat/image/avatar?w=400&h=400&u=3",
    avatarFallback: "AB",
    is_online: false,
    lastMessage: "Sim, já vi o documento!",
    time: "10:30",
    unreadCount: 0,
    messages: [deletedMessage],
  },
  {
    id: "conv-003",
    type: "group",
    name: "Grupo da Família",
    avatarFallback: "GF",
    participant1: "João",
    participant2: "Marta",
    participant3: "Maria",
    participantsCount: 8,
    lastMessage: "Alguém vai ao jantar?",
    time: "Ontem",
    unreadCount: 3,
    messages: [],
  },
];

// ── Mensagem apagada ──




export default function Chat() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const selectedConversation = mockConversations.find(c => c.id === selectedConversationId);
  return (
    <div className=" flex-1 flex p-4 h-full overflow-hidden ">
      <Card className="h-full min-h-0 overflow-hidden flex rounded-3xl flex-col p-2 gap-3 ">
        <ChatHome
          selectedConversationId={selectedConversationId}
          onSelectConversation={setSelectedConversationId}
          conversations={mockConversations}
        />
      </Card>
      <Card className="flex-1 min-h-0 flex flex-col h-full overflow-hidden p-2" variant="transparent">

        {selectedConversation ? (
          <>
            <ChatHeader
              type={selectedConversation.type}
              name={selectedConversation.name}
              image_url={selectedConversation.image_url}
              fallback={selectedConversation.avatarFallback}  // ← avatarFallback → fallback
              is_online={selectedConversation.type === "private" ? selectedConversation.is_online : undefined}
              participant1={selectedConversation.participant1}
              participant2={selectedConversation.participant2}
              participant3={selectedConversation.participant3}
              participantsCount={selectedConversation.participantsCount}
            />
            <ChatMain messages={selectedConversation.messages} currentUserId={currentUserId} />
            <ChatInputField />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-muted">Selecciona uma conversa para começar</p>
          </div>
        )}
      </Card>
    </div>
  );
}
