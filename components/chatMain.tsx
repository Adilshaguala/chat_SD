import { ScrollShadow } from "@heroui/react";
import Message from "./message";

export default function ChatMain() {
  return (
    <div className="flex-1 min-h-0">
      <ScrollShadow className="h-full" hideScrollBar>
        <div className="mt-10">
          <Message type="send" />
        </div>
      </ScrollShadow>
    </div>
  );
}
