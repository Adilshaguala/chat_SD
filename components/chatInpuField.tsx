"use client"
import { Button, Input, TextField } from "@heroui/react";
import { Mic, Paperclip, SmilePlus, Share } from "lucide-react";

export default function ChatInputField() {
    return (
        <div>
            <TextField className="flex flex-row items-center">
                <Input className="flex-1 h-12 rounded-full" placeholder="Envie uma messagem para adilson" />
                <div className="flex flex-row gap-3 ">
                    <Button isIconOnly variant="outline" size="lg">
                        <SmilePlus />
                    </Button>
                    <Button isIconOnly variant="outline" size="lg">
                        <Paperclip />
                    </Button>
                    <Button isIconOnly variant="outline" size="lg">
                        <Mic />
                    </Button>
                    <Button isIconOnly>
                        <Share />
                    </Button>
                </div>
            </TextField>
        </div>
    )
}