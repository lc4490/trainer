import { useImageUpload } from "@/hooks/use-image-upload";
import { useMutation, useQuery } from "convex/react";
import { FunctionReturnType } from "convex/server";
import {
  LoaderIcon,
  MoreVerticalIcon,
  PlusIcon,
  SendIcon,
  TrashIcon,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";

export function Messages({
  id,
  ai_chat,
}: {
  id: Id<"directMessages" | "channels">;
  ai_chat?: boolean;
}) {
  const messages = useQuery(api.functions.message.list, {
    dmOrChannelId: id,
  });
  return (
    <div className="relative flex flex-col h-full">
      <ScrollArea className="h-full py-4">
        {messages?.map((message) => (
          <MessageItem key={message._id} message={message} />
        ))}
      </ScrollArea>
      <div className="sticky bottom-0 bg-background">
        <TypingIndicator id={id} />
        <MessageInput id={id} ai_chat={ai_chat} />
      </div>
    </div>
  );
}
function TypingIndicator({ id }: { id: Id<"directMessages" | "channels"> }) {
  const usernames = useQuery(api.functions.typing.list, { dmOrChannelId: id });
  if (!usernames || usernames.length === 0) {
    return null;
  }
  return (
    <div className="text-sm text-muted-foreground px-4 py-2">
      {usernames.join(", ")} is typing...
    </div>
  );
}

type Message = FunctionReturnType<typeof api.functions.message.list>[number];

function MessageItem({ message }: { message: Message }) {
  const user = useQuery(api.functions.user.get);
  if (message.ai) {
    return (
      <div className="flex items-center px-4 gap-2 py-2">
        <Avatar className="size-8 border self-start">
          {message.sender && <AvatarImage src={message.sender?.image} />}
          <AvatarFallback />
        </Avatar>
        <div className="flex flex-col mr-auto">
          <p className="text-xs text-muted-foreground">{"trAIner"}</p>
          {message.deleted ? (
            <p className="text-sm text-destructive">
              This message was deleted.
              {message.deletedReason && (
                <span> Reason: {message.deletedReason}</span>
              )}
            </p>
          ) : (
            <>
              <p className="text-sm">{message.content}</p>
              {message.attachment && (
                <Image
                  src={message.attachment}
                  alt="attachment"
                  width={300}
                  height={300}
                  className="rounded border overflow-hidden"
                />
              )}
            </>
          )}
        </div>
        <MessageActions message={message} />
      </div>
    );
  }
  if (user?._id === message.sender?._id) {
    return (
      <div className="flex items-center px-4 gap-2 py-2">
        <MessageActions message={message} />
        <div className="flex flex-col ml-auto text-right">
          {/* <p className="text-xs text-muted-foreground">
            {message.sender?.username ?? "Deleted User"}
          </p> */}
          {message.deleted ? (
            <p className="text-sm text-destructive">
              This message was deleted.
              {message.deletedReason && (
                <span> Reason: {message.deletedReason}</span>
              )}
            </p>
          ) : (
            <>
              <p className="text-sm">{message.content}</p>
              {message.attachment && (
                <Image
                  src={message.attachment}
                  alt="attachment"
                  width={300}
                  height={300}
                  className="rounded border overflow-hidden"
                />
              )}
            </>
          )}
        </div>
        <Avatar className="size-8 border">
          {message.sender && <AvatarImage src={message.sender?.image} />}
          <AvatarFallback />
        </Avatar>
      </div>
    );
  }
  return (
    <div className="flex items-center px-4 gap-2 py-2">
      <Avatar className="size-8 border">
        {message.sender && <AvatarImage src={message.sender?.image} />}
        <AvatarFallback />
      </Avatar>
      <div className="flex flex-col mr-auto">
        <p className="text-xs text-muted-foreground">
          {message.sender?.username ?? "Deleted User"}
        </p>
        {message.deleted ? (
          <p className="text-sm text-destructive">
            This message was deleted.
            {message.deletedReason && (
              <span> Reason: {message.deletedReason}</span>
            )}
          </p>
        ) : (
          <>
            <p className="text-sm">{message.content}</p>
            {message.attachment && (
              <Image
                src={message.attachment}
                alt="attachment"
                width={300}
                height={300}
                className="rounded border overflow-hidden"
              />
            )}
          </>
        )}
      </div>
      <MessageActions message={message} />
    </div>
  );
}

function MessageActions({ message }: { message: Message }) {
  const user = useQuery(api.functions.user.get);
  const removeMutation = useMutation(api.functions.message.remove);
  if (!user || message.sender?._id !== user._id) {
    return null;
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreVerticalIcon className="size-4 text-muted-foreground" />
        <span className="sr-only">Message Actions</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="text-destructive"
          onClick={() => removeMutation({ id: message._id })}
        >
          <TrashIcon />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MessageInput({
  id,
  ai_chat,
}: {
  id: Id<"directMessages" | "channels">;
  ai_chat?: boolean;
}) {
  const [content, setContent] = useState("");
  const sendMessage = useMutation(api.functions.message.create);
  const sendTypingIndicator = useMutation(api.functions.typing.upsert);
  const imageUpload = useImageUpload();
  const removeAttachment = useMutation(api.functions.storage.remove);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await sendMessage({
        dmOrChannelId: id,
        attachment: imageUpload.storageId,
        content,
        ai_chat,
      });
      setContent("");
      imageUpload.reset();
    } catch (error) {
      toast.error("Failed to send message", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };
  return (
    <>
      <form className="flex items-end p-4 gap-2" onSubmit={handleSubmit}>
        <Button
          type="button"
          size="icon"
          onClick={() => {
            imageUpload.open();
          }}
        >
          <PlusIcon />
          <span className="sr-only">Attach</span>
        </Button>
        <div className="flex flex-col flex-1 gap-2">
          {imageUpload.previewUrl && (
            <ImagePreview
              url={imageUpload.previewUrl}
              isUploading={imageUpload.isUploading}
              onDelete={() => {
                if (imageUpload.storageId) {
                  removeAttachment({
                    storageId: imageUpload.storageId,
                  });
                }
                imageUpload.reset();
              }}
            />
          )}
          <Input
            placeholder="Message"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={() => {
              if (content.length > 0) {
                sendTypingIndicator({ dmOrChannelId: id });
              }
            }}
          />
        </div>

        <Button size="icon">
          <SendIcon /> <span className="sr-only">Send</span>
        </Button>
      </form>
      <input {...imageUpload.inputProps} />
    </>
  );
}

function ImagePreview({
  url,
  isUploading,
  onDelete,
}: {
  url: string;
  isUploading: boolean;
  onDelete: () => void;
}) {
  return (
    <div className="relative size-40 rounded border overflow-hidden group">
      <Image src={url} alt="attacument" width={300} height={300} />
      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <LoaderIcon className="animate-spin size-8" />
        </div>
      )}
      <Button
        type="button"
        className="absolute top-2 right-2 group-hover:opacity-100 opacity-0 transition-opacity"
        variant="destructive"
        size="icon"
        onClick={onDelete}
      >
        <TrashIcon />
        <span className="sr-only">Delete</span>
      </Button>
    </div>
  );
}
