"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Plus, Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-4 h-16 px-4 lg:px-8 border-b border-slate-200/80 bg-white/90 backdrop-blur-md spring-transition shadow-2xs">
      {/* Left section: Mobile menu & logo */}
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="lg:hidden rounded-xl hover:bg-slate-100 spring-transition">
                <Menu className="w-5 h-5 text-slate-700" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            }
          />
          <SheetContent side="left" className="w-64 p-0 border-r border-slate-200">
            <Sidebar />
          </SheetContent>
        </Sheet>

        {/* Mobile logo */}
        <Link href="/dashboard" className="lg:hidden flex items-center gap-2">
          <div className="w-8 h-8 bg-violet-600 rounded-xl flex items-center justify-center shadow-xs">
            <span className="text-xs font-bold text-white">TP</span>
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900">TaskPilot</span>
        </Link>
      </div>

      {/* Search bar */}
      <div className="flex-1 max-w-lg mx-2">
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-violet-600 spring-transition" />
          <Input
            type="search"
            placeholder="Search tasks, orders, suppliers, products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 bg-slate-50 border border-slate-200/80 focus-visible:bg-white focus-visible:border-violet-600/50 focus-visible:ring-3 focus-visible:ring-violet-600/15 rounded-xl text-sm transition-all duration-200"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2.5">
        <Button variant="ghost" size="icon" className="relative rounded-xl hover:bg-slate-100 spring-transition active:scale-95">
          <Bell className="w-5 h-5 text-slate-500 hover:text-slate-900" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-violet-600 rounded-full animate-ping" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-violet-600 rounded-full" />
          <span className="sr-only">Notifications</span>
        </Button>

        <Link href="/tasks/new" className="hidden sm:inline-flex">
          <Button size="sm" className="gap-2 bg-violet-600 hover:bg-violet-500 text-white shadow-sm shadow-violet-600/20 rounded-xl px-4 h-10 font-semibold active:scale-95 spring-transition">
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden md:inline">Quick Add</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}



