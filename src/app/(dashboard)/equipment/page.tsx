"use client";

import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "../../../../convex/_generated/api";

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

  return <div className="flex-1 flex-col flex-divide-y">WOrkout</div>;
}
