"use client"
import { Avatar, Card, CardContent, Separator } from "@heroui/react";
import { useState } from "react";


export default function ChatCard({
    isSelected = false,
    name,
    avatarSrc,
    avatarFallback,
    lastMessage,
    time,
    unreadCount = 0,
}: ChatCardProps) {

    const [hover, setHover] = useState(false)
    return (
        <Card variant={isSelected ? "secondary" : (hover ? "tertiary" : "transparent")} className="h"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >

            <CardContent className="flex flex-row items-start gap-3">
                <Avatar>
                    {avatarSrc && (
                        <Avatar.Image alt={name} src={avatarSrc} />
                    )}
                    <Avatar.Fallback>{avatarFallback}</Avatar.Fallback>
                </Avatar>

                <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                        <p className={isSelected ? "font-bold text- truncate" : "truncate"}>{name}</p>
                        <p className="text-xs text-muted ml-2 shrink-0">{time}</p>
                    </div>

                    <div className="flex justify-between items-center">
                        <p className={isSelected? "text-sm truncate  flex-1 text-foreground": "text-sm truncate flex-1 text-muted"}>
                            {lastMessage}
                        </p>
                        {unreadCount > 0 && (
                            <span className="ml-2 shrink-0 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}