import { ScrollShadow } from "@heroui/react";
import Message from "./message";
import { MessageData } from "@/lib/props";

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

// ── Mensagem apagada ──
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



export default function ChatMain() {
  return (
    <div className="flex-1 min-h-0">
      <ScrollShadow className="h-full" hideScrollBar>
        <div className="mt-10">
          <Message message={exampleMessage} currentUserId={currentUserId} onReact={(id, emoji) => console.log(id, emoji)} />
          <Message message={sentMessage} currentUserId={currentUserId} onReact={(id, emoji) => console.log(id, emoji)} />
          <Message message={deletedMessage} currentUserId={currentUserId} onReact={(id, emoji) => console.log(id, emoji)} />


        </div>
      </ScrollShadow>
    </div>
  );
}
