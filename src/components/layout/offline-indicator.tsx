"use client";

import { useOnlineStatus } from "@/lib/pwa";
import { WifiOff, Wifi } from "lucide-react";

export function OfflineIndicator() {
  const { isOnline, wasOffline } = useOnlineStatus();

  if (isOnline && !wasOffline) return null;

  if (!isOnline) {
    return (
      <div className="fixed top-14 left-0 right-0 z-50 bg-amber-500 text-white px-4 py-2 text-sm font-medium flex items-center justify-center gap-2">
        <WifiOff className="w-4 h-4" />
        You&apos;re offline — changes will sync when reconnected
      </div>
    );
  }

  if (wasOffline && isOnline) {
    return (
      <div className="fixed top-14 left-0 right-0 z-50 bg-green-500 text-white px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 animate-fade-out">
        <Wifi className="w-4 h-4" />
        Back online — syncing changes...
      </div>
    );
  }

  return null;
}
