"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  CheckSquare,
  Calendar,
  MoreHorizontal,
} from "lucide-react";

const tabs = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/orders", label: "Orders", icon: Package },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/more", label: "More", icon: MoreHorizontal },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 safe-area-bottom shadow-lg">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.href || pathname.startsWith(tab.href + "/");
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center justify-center flex-1 h-full py-1 text-[11px] font-medium transition-all duration-200 active:scale-95 group"
            >
              <div
                className={cn(
                  "flex items-center justify-center px-4 py-1 rounded-full transition-all duration-200",
                  isActive
                    ? "bg-violet-100 text-violet-700 shadow-2xs scale-105"
                    : "text-slate-500 hover:text-slate-900 group-hover:bg-slate-100/60"
                )}
              >
                <tab.icon className={cn("w-5 h-5 stroke-[2.2]", isActive && "text-violet-700")} />
              </div>
              <span className={cn("mt-0.5 tracking-tight font-semibold", isActive ? "text-violet-800 font-bold" : "text-slate-500")}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
