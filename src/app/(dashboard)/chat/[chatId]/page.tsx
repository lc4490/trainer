"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Messages } from "@/components/messages";
import { Id } from "../../../../../convex/_generated/dataModel";
import { use } from "react";

export default function HomePage({
  params,
}: {
  params: Promise<{ chatId: Id<"channels"> }>;
}) {
  const { chatId } = use(params);
  const chat = useQuery(api.functions.channels.get, { id: chatId });
  return (
    <div className="flex flex-1 flex-col divide-y">
      <header className="p-4">
        <h1 className="font-semibold">{chat?.name}</h1>
      </header>
      <Messages id={chatId} ai_chat={true} />
    </div>
  );
}
