import { Button, Card, Dropdown, Label, Popover } from "@heroui/react";
import { Clipboard, CornerDownLeft, Ellipsis, Pencil, Share2, SmilePlus, Trash } from "lucide-react";

export function MessageOption() {
    return (
        <Dropdown>
            <Button isIconOnly variant="outline" size="sm">
                <Ellipsis />
            </Button>
            <Dropdown.Popover>
                <Dropdown.Menu onAction={(key) => console.log(`Selected: ${key}`)}>
                    <Dropdown.Item id="new-file" textValue="New file">
                        <CornerDownLeft />
                        <Label>Responder</Label>
                    </Dropdown.Item>
                    <Dropdown.Item id="reecaminhar" textValue="New file">
                        <Share2 />
                        <Label>Reecaminhar</Label>
                    </Dropdown.Item>
                    <Dropdown.Item id="copy-link" textValue="Copy link">
                        <Clipboard />
                        <Label>Copiar</Label>
                    </Dropdown.Item>
                    <Dropdown.Item id="edit-file" textValue="Edit file">
                        <Pencil />
                        <Label>Editar</Label>
                    </Dropdown.Item>
                    <Dropdown.Item id="delete-file" textValue="Delete file" variant="danger">
                        <Trash />
                        <Label>Apagar</Label>
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown>
    )
}

export default function Message({ type }: MessageProps) {
    const isSend = type === "send"
    return (
        <div
            className={`flex w-full flex-col gap-2 ${isSend ? "items-end" : "items-start"}`}>
            <div className={`flex items-center gap-2 ${isSend ? "flex-row-reverse" : "flex-row"}`}>

                <Card className={`max-w-xl ${isSend? "bg-accent/10": ""}`} variant="default">
                    <Card.Content>
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            Suscipit consequatur ratione itaque impedit eius cum
                            repellat sunt maxime.
                        </p>
                    </Card.Content>
                </Card>
                <MessageOption />
                <Popover>
                    <Button isIconOnly variant="outline">
                        <SmilePlus></SmilePlus>
                    </Button>
                </Popover>
            </div>

            <div className={`flex items-center gap-2 ${isSend ? "flex-row-reverse" : "flex-row"}`}>
                <p className="text-sm px-2">14:32</p>

                <div className="w-3 h-3 bg-accent rounded-full"></div>
            </div>
        </div>
    )
}