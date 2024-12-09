"use client";

import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import Onboarding from "./_components/onboarding2";

import { ProfilePage } from "./_components/edit-profile-page";

export default function HomePage() {
  const user = useQuery(api.functions.user.get);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user && (user.age == null || user.age == "") && !open) {
      setOpen(true);
    }
  }, [
    user,
    // open
  ]);

  if (user == null) {
    return <div></div>;
  }

  return (
    <div className="flex-1 flex-col flex-divide-y">
      <header className="flex item-center justify-between p-4">
        <h1 className="font-semibold">Welcome, {user?.username}</h1>
        <ProfilePage />
      </header>
      {open && (
        <Onboarding
          onClose={() => setOpen(false)} // Allow closing the modal manually
        />
      )}
    </div>
  );
}
