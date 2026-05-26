"use client";
import ChatCard from "@/components/chatCard";
import ChatInputField from "@/components/chatInpuField";
import ChatMain from "@/components/chatMain";
import Message from "@/components/message";
import ChatHeader from "@/components/chatHeader";
import { ThemeSwitch } from "@/components/theme-switch";
import ChatHome from "./chatHome/page.tsx"
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
  Clipboard,
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

export default function Chat() {
  const [value, setValue] = useState("");
  return (
    <div className=" flex-1 flex p-4 h-full overflow-hidden ">
      <Card className="h-full min-h-0 overflow-hidden flex rounded-3xl flex-col p-4 gap-3 ">
        <ChatHome/>
      </Card>
      <Card className="flex-1 min-h-0" variant="transparent">
        <Card.Content className="flex flex-col h-full overflow-hidden">
          
          <ChatHeader />
          <ChatMain />
          <ChatInputField />
        
        </Card.Content>
      </Card>
    </div>
  );
}
