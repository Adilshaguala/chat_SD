"use client"
import ChatCard from "@/components/chatCard";
import ChatInputField from "@/components/chatInpuField";
import Message from "@/components/message";
import { ThemeSwitch } from "@/components/theme-switch";
import { Avatar, Button, Card, Chip, Description, Dropdown, Input, Label, ScrollShadow, SearchField, Separator, TextField } from "@heroui/react";
import { Clipboard, CornerDownLeft, CornerDownRight, Ellipsis, EllipsisVertical, File, Mic, Paperclip, Pencil, Phone, Share, SmilePlus, Trash, Video } from "lucide-react";
import { useState } from "react";

export default function Chat() {
    const [value, setValue] = useState("");
    return (
        <div className=" flex-1 flex p-4 h-full overflow-hidden ">
            <Card className="h-full min-h-0 overflow-hidden flex rounded-3xl flex-col p-4 gap-3 ">
                <div className="flex justify-between">
                    <h1>Conversas</h1>
                    <ThemeSwitch />
                    <Avatar size="sm">
                        <Avatar.Image alt="John Doe" src="https://img.heroui.chat/image/avatar?w=400&h=400&u=3" />
                        <Avatar.Fallback>JD</Avatar.Fallback>
                    </Avatar>
                </div>
                <div>
                    <div className="flex flex-col gap-2">
                        <SearchField variant="secondary" name="search" value={value} onChange={setValue}>
                            <SearchField.Group>
                                <SearchField.SearchIcon />
                                <SearchField.Input className="w-[280px]" placeholder="Procurar..." />
                                <SearchField.ClearButton />
                            </SearchField.Group>
                            <Description>Pesquise por conversas, ficheiros...</Description>
                        </SearchField>
                        <div className="flex gap-2">
                            <Button variant="tertiary" onPress={() => setValue("")}>
                                Clear
                            </Button>
                            <Button variant="tertiary" onPress={() => setValue("example query")}>
                                Set example
                            </Button>
                        </div>
                    </div>
                </div>
                <ScrollShadow className="flex-1 min-h-0">
                    <div className="my-4">
                        <ChatCard unreadCount={9} isSelected={true} name="Adilson" avatarFallback="AD" avatarSrc="https://img.heroui.chat/image/avatar?w=400&h=400&u=2" lastMessage="Onde estas, estou na faculdade" time="Ontem" />
                        <ChatCard isSelected={false} name="Adilson" avatarFallback="AD" avatarSrc="https://img.heroui.chat/image/avatar?w=400&h=400&u=3" lastMessage="Onde estas, estou na faculdade" time="Ontem" />
                        <ChatCard isSelected={false} name="Adilson" avatarFallback="AD" lastMessage="Onde estas, estou na faculdade" time="Ontem" />
                        <ChatCard unreadCount={9} isSelected={false} name="Adilson" avatarFallback="AD" lastMessage="Onde estas, estou na faculdade" time="Ontem" />F
                    </div>
                </ScrollShadow>
            </Card>
            <Card className="flex-1 min-h-0" variant="transparent">
                <Card.Content className="flex flex-col h-full overflow-hidden">
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
                    <div className="flex-1 min-h-0">
                        <ScrollShadow className="h-full" hideScrollBar>
                            <div className="mt-10">
                                <Message type="send"/>

                            </div>
                        </ScrollShadow>

                    </div>
                    <ChatInputField />
                </Card.Content>
            </Card>

        </div>
    )
}