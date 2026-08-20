"use client";

import Link from "next/link";
import {
  BarChart3,
  Wrench,
  Bot,
  Users,
  ShoppingCart,
  Settings,
  ChevronRight,
  FileText,
  HelpCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const menuItems = [
  {
    section: "Business Modules",
    items: [
      { href: "/sales", label: "Sales", icon: BarChart3, description: "Enquiries and quotations" },
      { href: "/service", label: "Service", icon: Wrench, description: "Complaints and visits" },
      { href: "/suppliers", label: "Suppliers", icon: Users, description: "Supplier profiles" },
      { href: "/products", label: "Products", icon: ShoppingCart, description: "Product catalog" },
    ],
  },
  {
    section: "Intelligence",
    items: [
      { href: "/ai", label: "AI Assistant", icon: Bot, description: "Natural language assistant" },
      { href: "/reports", label: "Reports", icon: FileText, description: "Performance insights" },
    ],
  },
  {
    section: "System",
    items: [
      { href: "/settings", label: "Settings", icon: Settings, description: "Profile and preferences" },
    ],
  },
];

export default function MorePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">More</h1>
        <p className="text-muted-foreground">Access all modules and settings</p>
      </div>

      {menuItems.map((section) => (
        <div key={section.section}>
          <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
            {section.section}
          </h2>
          <Card>
            <CardContent className="p-0">
              {section.items.map((item, idx) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors ${
                    idx !== section.items.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div className="p-2 rounded-lg bg-muted">
                    <item.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
