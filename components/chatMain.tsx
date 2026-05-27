import { Card, ScrollShadow } from "@heroui/react";
import Message from "./message";
import { MessageData } from "@/lib/props";


interface ChatMainProps {
  messages?: MessageData[];
  currentUserId: string;
}

export default function ChatMain({ messages, currentUserId }: ChatMainProps) {
  return (
    <div className="flex-1 min-h-0">
      <ScrollShadow className="h-full" hideScrollBar>
        <div className="mt-10">
          {
            messages && messages.length > 0 ? (
              messages.map((msg) => (
                <Message key={msg.id} message={msg} currentUserId={currentUserId} onReact={(id, emoji) => console.log(id, emoji)} />
              ))
            ) : (
              <div className="flex flex-col items-center">
                <Card className="">
                    Nenhuma messagem enviada até agora
                </Card>
              </div>
            )}
        </div>
      </ScrollShadow>
    </div>
  );
}
