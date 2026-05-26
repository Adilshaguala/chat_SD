"use client";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  Avatar,
  Button,
  Card,
  Chip,
  Description,
  Dropdown,
  Input,
  Label,
  ScrollShadow,
  SearchField,
  Separator,
  TextField,
} from "@heroui/react";
import {
  CornerDownLeft,
  CornerDownRight,
  Ellipsis,
  EllipsisVertical,
  File,
  Mic,
  Paperclip,
  Pencil,
  Phone,
  Share,
  SmilePlus,
  Trash,
  Video,
} from "lucide-react";
import { useState } from "react";
import ChatCard from "@/components/chatCard";

export default function ChatHome() {
  const [value, setValue] = useState("");

  return (
    <div>
      <div className="flex justify-between">
        <h1>Conversas</h1>
        <ThemeSwitch />
        <Avatar size="sm">
          <Avatar.Image
            alt="John Doe"
            src="https://img.heroui.chat/image/avatar?w=400&h=400&u=3"
          />
          <Avatar.Fallback>JD</Avatar.Fallback>
        </Avatar>
      </div>
      <div>
        <div className="flex flex-col gap-2">
          <SearchField
            variant="secondary"
            name="search"
            value={value}
            onChange={setValue}
          >
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input
                className="w-[280px]"
                placeholder="Procurar..."
              />
              <SearchField.ClearButton />
            </SearchField.Group>
            <Description>Pesquise por conversas, ficheiros...</Description>
          </SearchField>
          <div className="flex gap-2">
            <Button variant="tertiary" onPress={() => setValue("")}>
              Clear
            </Button>
            <Button
              variant="tertiary"
              onPress={() => setValue("example query")}
            >
              Set example
            </Button>
          </div>
        </div>
      </div>
      <ScrollShadow className="flex-1 min-h-0">
        <div className="my-4">
          <ChatCard
            unreadCount={9}
            isSelected={true}
            name="Adilson"
            avatarFallback="AD"
            avatarSrc="https://img.heroui.chat/image/avatar?w=400&h=400&u=2"
            lastMessage="Onde estas, estou na faculdade"
            time="Ontem"
          />
          <ChatCard
            isSelected={false}
            name="Adilson"
            avatarFallback="AD"
            avatarSrc="https://img.heroui.chat/image/avatar?w=400&h=400&u=3"
            lastMessage="Onde estas, estou na faculdade"
            time="Ontem"
          />
          <ChatCard
            isSelected={false}
            name="Adilson"
            avatarFallback="AD"
            lastMessage="Onde estas, estou na faculdade"
            time="Ontem"
          />
          <ChatCard
            unreadCount={9}
            isSelected={false}
            name="Adilson"
            avatarFallback="AD"
            lastMessage="Onde estas, estou na faculdade"
            time="Ontem"
          />
        </div>
      </ScrollShadow>
    </div>
  );
}
