"use client";
import { ThemeSwitch } from "@/components/theme-switch";
import { Avatar, ScrollShadow, SearchField } from "@heroui/react";
import { useState } from "react";
import ChatCard from "@/components/chatCard";
import { ChatCardProps, ChatHomeProps } from "@/lib/props";

export default function ChatHome({ 
  selectedConversationId, 
  onSelectConversation, 
  conversations = [] 
}: ChatHomeProps & { conversations?: ChatCardProps[] }) {
  const [value, setValue] = useState("");

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center">
        <ThemeSwitch />
      </div>

      <SearchField variant="secondary" name="search" value={value} onChange={setValue}>
        <SearchField.Group>
          <SearchField.SearchIcon />
          <SearchField.Input className="w-[280px]" placeholder="Procurar..." />
          <SearchField.ClearButton />
        </SearchField.Group>
      </SearchField>

      <ScrollShadow className="flex-1 min-h-0" hideScrollBar>
        <div className="my-4 flex flex-col gap-1">
          {conversations && conversations.length > 0 ? (
            conversations.map((conversation) => (
              <ChatCard
                key={conversation.id}
                id={conversation.id}
                name={conversation.name}
                avatarSrc={conversation.avatarSrc}
                avatarFallback={conversation.avatarFallback}
                lastMessage={conversation.lastMessage}
                time={conversation.time}
                unreadCount={conversation.unreadCount}
                isSelected={selectedConversationId === conversation.id}
                onPress={() => onSelectConversation(conversation.id!)}
              />
            ))
          ) : (
            <p className="text-sm text-muted text-center mt-4">Nenhuma conversa ainda</p>
          )}
        </div>
      </ScrollShadow>
    </div>
  );
}