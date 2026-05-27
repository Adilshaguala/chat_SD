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
import { useConversations } from "@/hooks/useConversations";
import { useMessages } from "@/hooks/useMessages";




export default function Chat() {
  const { conversations, currentUserId, loading: loadingConversations } = useConversations();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const selectedConversation = conversations.find(c => c.id === selectedConversationId);
  const { messages, loading: loadingMessages } = useMessages(selectedConversationId);
  console.log(currentUserId)

  return (
    <div className=" flex-1 flex p-4 h-full overflow-hidden ">
      <Card className="h-full min-h-0 overflow-hidden flex rounded-3xl flex-col p-2 gap-3 ">
        <ChatHome
          selectedConversationId={selectedConversationId}
          onSelectConversation={setSelectedConversationId}
          conversations={conversations}
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
            {
              currentUserId ? (
                <ChatMain messages={messages} currentUserId={currentUserId} />
              ):
              <>ola</>
            }
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
