interface ChatCardProps {
    isSelected?: boolean;
    name: string;
    avatarSrc?: string;
    avatarFallback: string;
    lastMessage: string;
    time: string;
    unreadCount?: number;
}


type MessageType = "send" | "receive"

interface MessageProps {
    type: MessageType

}