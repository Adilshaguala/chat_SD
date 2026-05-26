"use client"
import { Button, Card, Dropdown, Label, Popover } from "@heroui/react";
import { Clipboard, CornerDownLeft, Ellipsis, Pencil, Share2, SmilePlus, Trash } from "lucide-react";
import { useState } from "react";

// --- tipos e constantes ---
const QUICK_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];
const ALL_EMOJIS = [
  '😀','😃','😄','😁','😆','🥹','😅','😂','🤣','😊',
  '😍','🤩','😘','😎','🥺','😢','😭','😤','😠','🤯',
  '👍','👎','❤️','🔥','💯','🙏','👏','🎉','✅','⭐',
  // ... adiciona os que precisares
];

type Reaction = { count: number; mine: boolean };
type ReactionsMap = Record<string, Reaction>;

// --- EmojiPicker ---
function EmojiPicker({ onSelect }: { onSelect: (emoji: string) => void }) {
  return (
    <Popover.Content className="p-2 w-66">
      <div className="flex flex-col gap-2">
        {/* Rápidas */}
        <div className="flex gap-1 pb-2 border-b border-border">
          {QUICK_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => onSelect(emoji)}
              className="flex-1 text-xl hover:bg-muted rounded-lg p-1 transition-transform hover:scale-125"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Todas */}
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground px-1">
          Todas
        </p>
        <div className="grid grid-cols-7 gap-0.5">
          {ALL_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => onSelect(emoji)}
              className="text-lg hover:bg-muted rounded-md p-1 transition-transform hover:scale-110"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </Popover.Content>
  );
}

// --- ReactionsBar ---
function ReactionsBar({
  reactions,
  onToggle,
}: {
  reactions: ReactionsMap;
  onToggle: (emoji: string) => void;
}) {
  const entries = Object.entries(reactions).filter(([, r]) => r.count > 0);
  if (entries.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1 px-1">
      {entries.map(([emoji, { count, mine }]) => (
        <button
          key={emoji}
          onClick={() => onToggle(emoji)}
          className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-sm
            transition-colors
            ${mine
              ? "bg-surface  text-accent"
              : "bg-background  hover:bg-muted"
            }`}
        >
          <span>{emoji}</span>
          <span className={`text-xs font-medium ${mine ? "text-accent" : "text-muted-foreground"}`}>
            {count}
          </span>
        </button>
      ))}
    </div>
  );
}

// --- MessageOption ---
export function MessageOption() {
  return (
    <Dropdown>
      <Button isIconOnly variant="outline" size="sm">
        <Ellipsis />
      </Button>
      <Dropdown.Popover>
        <Dropdown.Menu onAction={(key) => console.log(`Selected: ${key}`)}>
          <Dropdown.Item id="reply" textValue="Responder">
            <CornerDownLeft /><Label>Responder</Label>
          </Dropdown.Item>
          <Dropdown.Item id="forward" textValue="Reencaminhar">
            <Share2 /><Label>Reencaminhar</Label>
          </Dropdown.Item>
          <Dropdown.Item id="copy" textValue="Copiar">
            <Clipboard /><Label>Copiar</Label>
          </Dropdown.Item>
          <Dropdown.Item id="edit" textValue="Editar">
            <Pencil /><Label>Editar</Label>
          </Dropdown.Item>
          <Dropdown.Item id="delete" textValue="Apagar" variant="danger">
            <Trash /><Label>Apagar</Label>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}

// --- Message ---
interface MessageProps {
  type: "send" | "receive";
}

export default function Message({ type }: MessageProps) {
  const isSend = type === "send";

  // estado das reações: { "👍": { count: 2, mine: false }, ... }
  const [reactions, setReactions] = useState<ReactionsMap>({});

  const handleSelectEmoji = (emoji: string) => {
    setReactions((prev) => {
      const current = prev[emoji] ?? { count: 0, mine: false };
      if (current.mine) {
        // remover a minha reação
        const updated = { ...current, count: current.count - 1, mine: false };
        return updated.count === 0
          ? Object.fromEntries(Object.entries(prev).filter(([k]) => k !== emoji))
          : { ...prev, [emoji]: updated };
      }
      return { ...prev, [emoji]: { count: current.count + 1, mine: true } };
    });
  };

  return (
    <div className={`flex w-full flex-col gap-2 ${isSend ? "items-end" : "items-start"}`}>
      {/* Balão + botões */}
      <div className={`flex items-center gap-2 ${isSend ? "flex-row-reverse" : "flex-row"}`}>
        <Card className={`max-w-xl ${isSend ? "bg-accent/10" : ""}`} variant="default">
          <Card.Content>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Suscipit consequatur ratione itaque impedit eius cum
              repellat sunt maxime.
            </p>
          </Card.Content>
        </Card>

        <MessageOption />

        {/* Picker de emojis */}
        <Popover>
          <Button isIconOnly variant="outline" size="sm">
            <SmilePlus />
          </Button>
          <EmojiPicker onSelect={handleSelectEmoji} />
        </Popover>
      </div>

      {/* Reações */}
      <ReactionsBar reactions={reactions} onToggle={handleSelectEmoji} />

      {/* Meta */}
      <div className={`flex items-center gap-2 ${isSend ? "flex-row-reverse" : "flex-row"}`}>
        <p className="text-sm px-2">14:32</p>
        <div className="w-3 h-3 bg-accent rounded-full" />
      </div>
    </div>
  );
}