"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { EditProfile } from "./_components/edit-profile";
import { Onboarding } from "./_components/onboarding";

export default function HomePage() {
  const user = useQuery(api.functions.user.get);
  return (
    <div className="flex-1 flex-col flex-divide-y">
      <header className="flex item-center justify-between p-4">
        <h1 className="font-semibold">Welcome, {user?.username}</h1>
        <EditProfile />
      </header>
      <Onboarding />
    </div>
  );
}
