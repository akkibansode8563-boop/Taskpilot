"use client";

import { useEffect, useState } from "react";

// Register service worker
export function registerServiceWorker() {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("[PWA] Service Worker registered:", registration.scope);
      })
      .catch((error) => {
        console.error("[PWA] Service Worker registration failed:", error);
      });
  }
}

// Hook to detect online/offline status
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setWasOffline(true);
      // Trigger background sync if available
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          if ("sync" in registration) {
            (registration as unknown as { sync: { register: (tag: string) => Promise<void> } }).sync.register("sync-tasks");
          }
        });
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return { isOnline, wasOffline };
}

// Offline storage using localStorage
export const offlineStorage = {
  // Save task to offline queue
  saveTask(task: Record<string, unknown>) {
    const queue = this.getQueue();
    queue.push({
      ...task,
      id: `offline-${Date.now()}`,
      offlineCreatedAt: new Date().toISOString(),
      synced: false,
    });
    localStorage.setItem("taskpilot-offline-queue", JSON.stringify(queue));
  },

  // Get offline queue
  getQueue(): Record<string, unknown>[] {
    try {
      const data = localStorage.getItem("taskpilot-offline-queue");
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  // Mark task as synced
  markSynced(id: string) {
    const queue = this.getQueue();
    const updated = queue.map((item) =>
      item.id === id ? { ...item, synced: true } : item
    );
    localStorage.setItem("taskpilot-offline-queue", JSON.stringify(updated));
  },

  // Get unsynced items
  getUnsyncedItems() {
    return this.getQueue().filter((item) => !item.synced);
  },

  // Clear synced items
  clearSynced() {
    const queue = this.getQueue().filter((item) => !item.synced);
    localStorage.setItem("taskpilot-offline-queue", JSON.stringify(queue));
  },

  // Save task status change offline
  saveStatusChange(taskId: string, newStatus: string) {
    const changes = this.getStatusChanges();
    changes.push({
      taskId,
      newStatus,
      timestamp: new Date().toISOString(),
      synced: false,
    });
    localStorage.setItem("taskpilot-status-changes", JSON.stringify(changes));
  },

  // Get status changes
  getStatusChanges(): Record<string, unknown>[] {
    try {
      const data = localStorage.getItem("taskpilot-status-changes");
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
};
