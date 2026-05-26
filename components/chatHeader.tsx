"use client"
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
