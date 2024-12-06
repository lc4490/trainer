"use client";

import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { Onboarding } from "./_components/onboarding";
import { SignOut } from "./_components/sign-out-button";

export default function HomePage() {
  const user = useQuery(api.functions.user.get);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user && user.age == null && !open) {
      setOpen(true);
    }
  }, [user, open]);

  if (user == null) {
    return <div></div>;
  }

  return (
    <div className="flex-1 flex-col flex-divide-y">
      <header className="flex items-center justify-between p-4">
        <h1 className="font-semibold">Welcome, {user?.username}</h1>
        <div className="flex items-center gap-4">
          {/* Edit Profile */}
          <Button
            size="sm"
            onClick={() => {
              setOpen(true);
            }}
          >
            Edit Profile
          </Button>
          <SignOut />
        </div>
      </header>
      {open && (
        <Onboarding
          onClose={() => setOpen(false)} // Allow closing the modal manually
        />
      )}
    </div>
  );
}
