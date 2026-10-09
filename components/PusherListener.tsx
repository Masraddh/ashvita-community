"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { pusherClient } from "@/lib/pusher";

export function PusherListener() {
  const router = useRouter();

  useEffect(() => {
    // Subscribe to the visitors channel
    const channel = pusherClient.subscribe("visitors");

    // Listen for events
    channel.bind("new-visitor", () => {
      router.refresh();
    });

    channel.bind("status-update", () => {
      router.refresh();
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [router]);

  return null;
}
