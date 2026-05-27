"use client"
import { Conversation, ConversationHandlers, ConversationHeaderProps } from "@/lib/props";
import {
    Avatar,
    Button,
} from "@heroui/react";

import { EllipsisVertical, Phone, Video } from "lucide-react";



function formatParticipants(
    p1?: string,
    p2?: string,
    p3?: string,
    total: number = 0
): string {
    const shown = [p1, p2, p3].filter(Boolean).join(", ");
    const remaining = total - [p1, p2, p3].filter(Boolean).length;

    if (remaining <= 0) return shown;
    return `${shown} e mais ${remaining}`;
}

export default function ChatHeader({ 
    type, name, image_url, fallback, is_online,
    participant1, participant2, participant3, participantsCount,
    onCall, onVideoCall, onMenu
}: ConversationHeaderProps & ConversationHandlers) {
    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                <Avatar>
                    <Avatar.Image
                        alt="Blue"
                        src={image_url}
                    />
                    <Avatar.Fallback>{fallback}</Avatar.Fallback>
                </Avatar>
                <div className="text-sm font-bold">
                    <p>{name}</p>

                    {type === "group"
                        ? <p className="font-normal text-muted">
                            {formatParticipants(participant1, participant2, participant3, participantsCount)}
                        </p>
                        : <p className="font-normal text-accent">
                            {is_online ? "Online" : "Offline"}
                        </p>
                    }
                </div>
            </div>
            <div className="flex gap-2">
                <Button isIconOnly variant="tertiary" size="lg" onPress={onCall}>
                    <Phone />
                </Button>
                <Button isIconOnly variant="tertiary" size="lg" onPress={onVideoCall}>
                    <Video />
                </Button>
                <Button isIconOnly variant="tertiary" size="lg" onPress={onMenu}>
                    <EllipsisVertical />
                </Button>
            </div>
        </div>
    );
}
