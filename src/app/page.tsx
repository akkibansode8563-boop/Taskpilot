"use client";

import Link from "next/link";
import {
  CheckSquare,
  ArrowRight,
  Package,
  Calendar,
  Bell,
  Clock,
  Pause,
  TrendingUp,
  FileText,
  Zap,
  Globe,
  Truck,
  Users,
  ShoppingCart,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// ─── Header ─────────────────────────────────────────────

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <CheckSquare className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">TaskPilot</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/preview">
            <Button variant="outline" size="sm">
              Preview App
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button>
              Open Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

// ─── Hero ───────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/50" />
      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            <Zap className="w-3 h-3 mr-1" />
            Built for Import/Export Professionals
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Never miss a{" "}
            <span className="text-primary">follow-up</span>,
            <br />
            <span className="text-primary">deadline</span>, or{" "}
            <span className="text-primary">shipment</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            TaskPilot is a mobile-first work operations system that helps you
            capture tasks quickly, manage China imports and domestic purchases,
            track milestones, and understand what&apos;s overdue, waiting, or next.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/preview">
              <Button size="lg" variant="outline" className="gap-2 text-base px-8">
                Preview App
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" className="gap-2 text-base px-8">
                Start Using TaskPilot <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* App Preview */}
        <div className="mt-16 md:mt-24 max-w-4xl mx-auto">
          <div className="relative rounded-2xl border border-border bg-card p-2 shadow-2xl">
            <div className="rounded-xl overflow-hidden bg-background">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-background rounded-md px-4 py-1 text-xs text-muted-foreground border border-border">
                    taskpilot.app/dashboard
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">Dashboard</h3>
                    <p className="text-sm text-muted-foreground">
                      What needs your attention today
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: "Overdue", value: "4", color: "text-red-500" },
                    { label: "Today", value: "9", color: "text-amber-500" },
                    { label: "Waiting", value: "7", color: "text-blue-500" },
                    { label: "Done", value: "16", color: "text-green-500" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="p-3 rounded-lg bg-muted/50 text-center"
                    >
                      <p className={`text-xl font-bold ${stat.color}`}>
                        {stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg border border-border">
                    <p className="text-sm font-medium mb-2">
                      Today&apos;s Priorities
                    </p>
                    <div className="space-y-2">
                      {[
                        "Follow up with Shenzhen supplier",
                        "Review packing list",
                        "Confirm CHA documents",
                      ].map((task, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-xs"
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              i === 0
                                ? "bg-orange-500"
                                : i === 1
                                ? "bg-red-500"
                                : "bg-blue-500"
                            }`}
                          />
                          <span className="truncate">{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg border border-border">
                    <p className="text-sm font-medium mb-2">Active Orders</p>
                    <div className="space-y-2">
                      {[
                        "LED Lights - Shenzhen",
                        "Ceramic Tiles - Guangzhou",
                        "Plywood - Domestic",
                      ].map((order, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-xs"
                        >
                          <span className="truncate">{order}</span>
                          <Badge variant="outline" className="text-[10px]">
                            {45 + i * 15}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Five Questions ─────────────────────────────────────

const questions = [
  {
    icon: Clock,
    q: "What do I need to do?",
    a: "Today's priorities and overdue items surface immediately on the dashboard.",
  },
  {
    icon: Calendar,
    q: "When do I need to do it?",
    a: "Due dates, reminders, and calendar views keep you on schedule.",
  },
  {
    icon: Pause,
    q: "What am I waiting for?",
    a: "Waiting-for items with follow-up dates are tracked and re-notified.",
  },
  {
    icon: TrendingUp,
    q: "What should I do next?",
    a: "Next actions on tasks and order milestones guide your workflow.",
  },
  {
    icon: Bell,
    q: "What is overdue?",
    a: "Overdue items escalate to daily reminders until resolved.",
  },
];

function FiveQuestions() {
  return (
    <section className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Product Principles
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Five questions, answered immediately
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            TaskPilot is designed to answer these five questions the moment you
            open the app.
          </p>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          {questions.map((p, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-6 rounded-xl bg-card border border-border hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <p.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">{p.q}</h3>
                <p className="text-muted-foreground">{p.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Features ───────────────────────────────────────────

const features = [
  {
    icon: CheckSquare,
    title: "Smart Task Engine",
    desc: "Capture tasks in under 15 seconds. Priority, status, due dates, reminders, and waiting-for tracking built in.",
  },
  {
    icon: Package,
    title: "Import/Purchase Orders",
    desc: "18-stage China import workflow and 8-stage domestic purchase flow. Track every milestone from requirement to GRN.",
  },
  {
    icon: Calendar,
    title: "Calendar View",
    desc: "Month, week, and day views. See tasks, milestones, ETD/ETA, and payment deadlines at a glance.",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    desc: "Automatic reminders for due dates, overdue items, waiting follow-ups, and milestone-based alerts.",
  },
  {
    icon: FileText,
    title: "Document Management",
    desc: "Attach PI, PO, invoices, packing lists, BL/AWB, and customs documents to orders.",
  },
  {
    icon: TrendingUp,
    title: "Landed Cost Calculator",
    desc: "Calculate true cost per SKU including freight, insurance, duty, CHA, and transport.",
  },
  {
    icon: Users,
    title: "Supplier Intelligence",
    desc: "Supplier profiles with contacts, payment terms, order history, and performance scoring.",
  },
  {
    icon: ShoppingCart,
    title: "Product Catalog",
    desc: "SKU management with HS codes, weights, CBM, and supplier linking for import costing.",
  },
  {
    icon: BarChart3,
    title: "Reports & Analytics",
    desc: "Task completion, overdue trends, import status, supplier performance, and daily activity insights.",
  },
];

function Features() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Features
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Everything you need to manage your work
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built for import/export professionals who need to capture work
            quickly, identify the next action, and never miss a follow-up.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f) => (
            <Card key={f.title} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Workflow ───────────────────────────────────────────

const chinaStages = [
  "Requirement", "Quotation", "Negotiation", "Sample", "PI", "PO",
  "Payment", "Production", "Inspection", "Ready to Ship", "Booking",
  "ETD", "BL/AWB", "Customs Docs", "CHA/Customs", "Duty/Charges",
  "Clearance", "Delivery/GRN",
];

const domesticStages = [
  "Requirement", "Quotation", "PO", "Supplier Confirmation",
  "Payment", "Dispatch", "Delivery", "GRN",
];

function Workflow() {
  return (
    <section className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Workflow
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Structured import/purchase workflows
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Never lose track of where an order stands. TaskPilot enforces stage
            progression and keeps all related tasks, documents, and payments
            linked.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="overflow-hidden">
            <div className="p-6 bg-primary text-primary-foreground">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Globe className="w-5 h-5" /> China Import
              </h3>
              <p className="text-sm opacity-80 mt-1">18-stage workflow</p>
            </div>
            <CardContent className="p-6">
              <div className="space-y-2">
                {chinaStages.map((stage, i) => (
                  <div
                    key={stage}
                    className={`flex items-center gap-3 p-2 rounded ${
                      i < 8
                        ? "bg-green-500/10"
                        : i === 8
                        ? "bg-primary/10 ring-2 ring-primary/30"
                        : "bg-muted/50"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        i < 8
                          ? "bg-green-500 text-white"
                          : i === 8
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {i < 8 ? "✓" : i + 1}
                    </div>
                    <span className={`text-sm ${i === 8 ? "font-medium" : ""}`}>
                      {stage}
                    </span>
                    {i === 8 && <Badge className="ml-auto text-xs">Current</Badge>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <div className="p-6 bg-secondary text-secondary-foreground">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Truck className="w-5 h-5" /> Domestic Purchase
              </h3>
              <p className="text-sm opacity-80 mt-1">8-stage workflow</p>
            </div>
            <CardContent className="p-6">
              <div className="space-y-2">
                {domesticStages.map((stage, i) => (
                  <div
                    key={stage}
                    className={`flex items-center gap-3 p-2 rounded ${
                      i < 5
                        ? "bg-green-500/10"
                        : i === 5
                        ? "bg-primary/10 ring-2 ring-primary/30"
                        : "bg-muted/50"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        i < 5
                          ? "bg-green-500 text-white"
                          : i === 5
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {i < 5 ? "✓" : i + 1}
                    </div>
                    <span className={`text-sm ${i === 5 ? "font-medium" : ""}`}>
                      {stage}
                    </span>
                    {i === 5 && <Badge className="ml-auto text-xs">Current</Badge>}
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-border">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">6</p>
                    <p className="text-xs text-muted-foreground">Active</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-amber-500">2</p>
                    <p className="text-xs text-muted-foreground">Delayed</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-500">15</p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

// ─── CTA ────────────────────────────────────────────────

function CTA() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          Ready to take control of your work?
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Start managing your imports, tasks, and follow-ups in one place.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/preview">
            <Button size="lg" variant="outline" className="gap-2 text-base px-8">
              Preview App
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" className="gap-2 text-base px-8">
              Open TaskPilot <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ─────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <CheckSquare className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">TaskPilot</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Mobile-first work operations for import/purchase management.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/dashboard" className="hover:text-foreground">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/tasks" className="hover:text-foreground">
                  Tasks
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-foreground">
                  Orders
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3">Modules</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/calendar" className="hover:text-foreground">
                  Calendar
                </Link>
              </li>
              <li>
                <Link href="/suppliers" className="hover:text-foreground">
                  Suppliers
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-foreground">
                  Products
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3">More</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/sales" className="hover:text-foreground">
                  Sales
                </Link>
              </li>
              <li>
                <Link href="/service" className="hover:text-foreground">
                  Service
                </Link>
              </li>
              <li>
                <Link href="/reports" className="hover:text-foreground">
                  Reports
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          © 2026 TaskPilot. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

// ─── Page ───────────────────────────────────────────────

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <FiveQuestions />
        <Features />
        <Workflow />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
