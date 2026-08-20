"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CheckSquare,
  Package,
  Calendar,
  Users,
  ShoppingCart,
  Wrench,
  BarChart3,
  Settings,
  Bot,
  Search,
  Plus,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/orders", label: "Import / Purchase", icon: Package },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/suppliers", label: "Suppliers", icon: Users },
  { href: "/products", label: "Products", icon: ShoppingCart },
  { href: "/sales", label: "Sales", icon: BarChart3 },
  { href: "/service", label: "Service", icon: Wrench },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/ai", label: "AI Assistant", icon: Bot },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:border-r lg:border-slate-200/80 lg:bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 shadow-2xs">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
        <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center shadow-sm shadow-violet-600/20 spring-transition hover:scale-105">
          <CheckSquare className="w-5 h-5 text-white stroke-[2.2]" />
        </div>
        <div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            TaskPilot
          </span>
          <span className="block text-[10px] uppercase tracking-widest text-violet-600 font-bold">Workspace</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-3.5 border-b border-slate-100">
        <Link
          href="/tasks/new"
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-semibold shadow-sm shadow-violet-600/20 active:scale-[0.985] spring-transition"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Quick Add
        </Link>
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-b border-slate-100">
        <Link
          href="/search"
          className="flex items-center gap-2.5 w-full px-3.5 py-2 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/60 rounded-xl text-sm text-slate-500 hover:text-slate-900 transition-all duration-200 group"
        >
          <Search className="w-4 h-4 text-slate-400 group-hover:text-violet-600 spring-transition" />
          <span>Search...</span>
          <kbd className="ml-auto text-[10px] font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-2xs text-slate-400">⌘K</kbd>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ease-out group relative",
                isActive
                  ? "bg-violet-50 text-violet-700 font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-0.5"
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-2.5 bottom-2.5 w-1 bg-violet-600 rounded-r-full" />
              )}
              <item.icon className={cn(
                "w-4 h-4 transition-colors",
                isActive ? "text-violet-600" : "text-slate-400 group-hover:text-slate-700"
              )} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer User */}
      <div className="px-4 py-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white spring-transition cursor-pointer border border-transparent hover:border-slate-200/60">
          <div className="w-9 h-9 bg-violet-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-2xs">
            U
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate leading-tight">User</p>
            <p className="text-xs text-slate-500 truncate">user@taskpilot.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}


