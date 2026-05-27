"use client"
import { MessageData, MessageProps, MessageReaction } from "@/lib/props";
import { Button, Card, Dropdown, Label, Popover } from "@heroui/react";
import { Clipboard, CornerDownLeft, Ellipsis, Pencil, Share2, SmilePlus, Trash } from "lucide-react";
import { useState } from "react";

// ─────────────────────────────────────────────
// Tipos derivados do schema do Supabase
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
// Constantes
// ─────────────────────────────────────────────

const QUICK_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];
const ALL_EMOJIS = [
  '😀', '😃', '😄', '😁', '😆', '🥹', '😅', '😂', '🤣', '😊',
  '😍', '🤩', '😘', '😎', '🥺', '😢', '😭', '😤', '😠', '🤯',
  '👍', '👎', '❤️', '🔥', '💯', '🙏', '👏', '🎉', '✅', '⭐',
];

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

/** Agrupa as reações por emoji e marca as que são do utilizador atual */
function groupReactions(
  reactions: MessageReaction[],
  currentUserId: string
): Record<string, { count: number; mine: boolean }> {
  return reactions.reduce<Record<string, { count: number; mine: boolean }>>(
    (acc, r) => {
      const prev = acc[r.emoji] ?? { count: 0, mine: false };
      return {
        ...acc,
        [r.emoji]: {
          count: prev.count + 1,
          mine: prev.mine || r.user_id === currentUserId,
        },
      };
    },
    {}
  );
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ─────────────────────────────────────────────
// Sub-componentes
// ─────────────────────────────────────────────

function EmojiPicker({ onSelect }: { onSelect: (emoji: string) => void }) {
  return (
    <Popover.Content className="p-2 w-66">
      <div className="flex flex-col gap-2">
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

function ReactionsBar({
  grouped,
  onToggle,
}: {
  grouped: Record<string, { count: number; mine: boolean }>;
  onToggle: (emoji: string) => void;
}) {
  const entries = Object.entries(grouped).filter(([, r]) => r.count > 0);
  if (entries.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1 px-1">
      {entries.map(([emoji, { count, mine }]) => (
        <button
          key={emoji}
          onClick={() => onToggle(emoji)}
          className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-sm transition-colors
            ${mine
              ? "bg-surface text-accent"
              : "bg-background hover:bg-muted"
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

function MessageActions({
  message,
  onReply,
  onCopy,
  onEdit,
  onDelete,
  onForward,
  isSend,
}: Pick<MessageProps, "onReply" | "onCopy" | "onEdit" | "onDelete" | "onForward"> & {
  message: MessageData;
  isSend: boolean;
}) {
  return (
    <Dropdown>
      <Button isIconOnly variant="outline" size="sm">
        <Ellipsis />
      </Button>
      <Dropdown.Popover>
        <Dropdown.Menu
          onAction={(key) => {
            switch (key) {
              case "reply": onReply?.(message); break;
              case "forward": onForward?.(message.id); break;
              case "copy": onCopy?.(message.content ?? ""); break;
              case "edit": onEdit?.(message.id, message.content ?? ""); break;
              case "delete": onDelete?.(message.id); break;
            }
          }}
        >
          <Dropdown.Item id="reply" textValue="Responder">
            <CornerDownLeft /><Label>Responder</Label>
          </Dropdown.Item>
          <Dropdown.Item id="forward" textValue="Reencaminhar">
            <Share2 /><Label>Reencaminhar</Label>
          </Dropdown.Item>
          <Dropdown.Item id="copy" textValue="Copiar">
            <Clipboard /><Label>Copiar</Label>
          </Dropdown.Item>
          {isSend && (
            <Dropdown.Item id="edit" textValue="Editar">
              <Pencil /><Label>Editar</Label>
            </Dropdown.Item>
          )}
          <Dropdown.Item id="delete" textValue="Apagar" variant="danger">
            <Trash /><Label>Apagar</Label>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}

// ─────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────

export default function Message({
  message,
  currentUserId,
  onReact,
  onReply,
  onCopy,
  onEdit,
  onDelete,
  onForward,
}: MessageProps) {
  const isSend = message.sender.id === currentUserId;

  // Reações agrupadas (derivado das props, sem estado local)
  const grouped = groupReactions(message.reactions, currentUserId);

  // O picker controla apenas estado local de UI (aberto/fechado)
  const [pickerOpen, setPickerOpen] = useState(false);

  const handleSelectEmoji = (emoji: string) => {
    onReact(message.id, emoji);
    setPickerOpen(false);
  };

  // Mensagem apagada
  if (message.is_deleted) {
    return (
      <div className={`flex w-full ${isSend ? "justify-end" : "justify-start"}`}>
        <Card className="text-sm text-muted-foreground italic px-3 py-2 border-2 border-dashed rounded-xl">
          Mensagem apagada
        </Card>
      </div>
    );
  }

  return (
    <div className={`flex w-full flex-col gap-2 ${isSend ? "items-end" : "items-start"}`}>
      {/* Balão + botões */}
      <div className={`flex items-center gap-2 ${isSend ? "flex-row-reverse" : "flex-row"}`}>
        <Card className={`max-w-xl ${isSend ? "bg-accent/10" : ""}`} variant="default">
          <Card.Content className="flex flex-col gap-1">
            {/* Preview de reply */}
            {message.reply_to && (
              <div className="border-l-2 border-accent pl-2 text-sm bg-background/40 p-2 rounded-2xl text-muted-foreground mb-1">
                <span className="font-semibold">{message.reply_to.sender_name}</span>
                <p className="truncate max-w-xs">{message.reply_to.content ?? "Anexo"}</p>
              </div>
            )}

            {/* Conteúdo de texto */}
            {message.content && <p>{message.content}</p>}

            {/* Indicador de anexos (rendering real fica em componentes próprios) */}
            {message.attachments.length > 0 && (
              <div className="text-xs text-muted-foreground">
                📎 {message.attachments.length} anexo(s)
              </div>
            )}
          </Card.Content>
        </Card>

        <MessageActions
          message={message}
          isSend={isSend}
          onReply={onReply}
          onCopy={onCopy}
          onEdit={onEdit}
          onDelete={onDelete}
          onForward={onForward}
        />

        {/* Picker de emojis */}
        <Popover isOpen={pickerOpen} onOpenChange={setPickerOpen}>
          <Button isIconOnly variant="outline" size="sm">
            <SmilePlus />
          </Button>
          <EmojiPicker onSelect={handleSelectEmoji} />
        </Popover>
      </div>

      {/* Reações */}
      <ReactionsBar grouped={grouped} onToggle={(emoji) => onReact(message.id, emoji)} />

      {/* Meta: hora + status */}
      <div className={`flex items-center gap-1.5 ${isSend ? "flex-row-reverse" : "flex-row"}`}>
        <p className="text-xs text-muted-foreground px-1">{formatTime(message.created_at)}</p>
        {message.is_pinned && <span className="text-xs">📌</span>}
        {/* Status (só para mensagens enviadas) */}
        {isSend && message.status && (
          <span className="text-xs text-muted-foreground">
            {message.status === "read"
              ? <div className="w-3 h-3 bg-accent rounded-full"></div>
              : message.status === "delivered"
                ? <div className="w-3 h-3 bg-accent-soft rounded-full"></div>
                : <div className="w-3 h-3 bg-foreground rounded-full"></div>}
          </span>
        )}
      </div>
    </div>
  );
}