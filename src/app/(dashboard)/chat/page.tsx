"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Messages } from "@/components/messages";

export default function HomePage() {
  const user = useQuery(api.functions.user.get);
  const defaultChannelId = useQuery(api.functions.server.getDefaultChannel, {
    id: user?.server,
  });
  return (
    <div className="flex flex-1 flex-col divide-y">
      <header className="p-4">
        <h1 className="font-semibold">Chat</h1>
      </header>
      {defaultChannelId ? (
        // <div>{defaultChannelId}</div>
        <>
          <Messages id={defaultChannelId} />
        </>
      ) : (
        <div>nothing</div>
      )}
    </div>
  );
}
