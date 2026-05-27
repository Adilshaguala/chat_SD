"use client"
import ChatInputField from "@/components/chatInpuField";
import ChatMain from "@/components/chatMain";
import ChatHeader from "@/components/chatHeader";
import {
  Card,
} from "@heroui/react";
import {
} from "lucide-react";
import ChatHome from "./chatHome/page";

export default function Chat() {
  return (
    <div className=" flex-1 flex p-4 h-full overflow-hidden ">
      <Card className="h-full min-h-0 overflow-hidden flex rounded-3xl flex-col p-2 gap-3 ">
        <ChatHome />
      </Card>
      <Card className="flex-1 min-h-0 flex flex-col h-full overflow-hidden p-2" variant="transparent">
        <ChatHeader />
        <ChatMain />
        <ChatInputField />
      </Card>
    </div>
  );
}
