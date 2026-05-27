"use client"
import {
    Avatar,
    Button,
} from "@heroui/react";

import { EllipsisVertical, Phone, Video } from "lucide-react";

export default function ChatHeader() {
    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                <Avatar>
                    <Avatar.Image
                        alt="Blue"
                        src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
                    />
                    <Avatar.Fallback>B</Avatar.Fallback>
                </Avatar>
                <div className="text-sm font-bold">
                    <p>Adilson André Chaguala</p>
                    <p className="font-normal text-accent">Online</p>
                </div>
            </div>
            <div className="flex gap-2">
                <Button isIconOnly variant="tertiary" size="lg">
                    <Phone />
                </Button>
                <Button isIconOnly variant="tertiary" size="lg">
                    <Video />
                </Button>
                <Button isIconOnly variant="tertiary" size="lg">
                    <EllipsisVertical />
                </Button>
            </div>
        </div>
    );
}
