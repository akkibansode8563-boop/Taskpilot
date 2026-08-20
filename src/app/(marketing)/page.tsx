"use client";

import Link from "next/link";
import {
  CheckSquare,
  Package,
  Calendar,
  Bell,
  Clock,
  AlertTriangle,
  Pause,
  TrendingUp,
  Globe,
  Zap,
  Shield,
  Smartphone,
  ArrowRight,
  Star,
  Users,
  BarChart3,
  Bot,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// ─── Hero Section ───────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background gradient */}
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
            TaskPilot is a mobile-first work operations system that helps you capture tasks quickly,
            manage China imports and domestic purchases, track milestones, and understand what&apos;s
            overdue, waiting, or next.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2 text-base px-8">
                Start Free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="text-base px-8">
                View Demo
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            No credit card required · Free for personal use
          </p>
        </div>

        {/* App Preview */}
        <div className="mt-16 md:mt-24 max-w-4xl mx-auto">
          <div className="relative rounded-2xl border border-border bg-card p-2 shadow-2xl">
            <div className="rounded-xl overflow-hidden bg-background">
              {/* Mock browser chrome */}
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

              {/* Mock dashboard */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">Dashboard</h3>
                    <p className="text-sm text-muted-foreground">What needs your attention today</p>
                  </div>
                  <Button size="sm" className="gap-1.5">
                    <CheckSquare className="w-4 h-4" />
                    Quick Add
                  </Button>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: "Overdue", value: "4", color: "text-red-500", bg: "bg-red-500/10" },
                    { label: "Today", value: "9", color: "text-amber-500", bg: "bg-amber-500/10" },
                    { label: "Waiting", value: "7", color: "text-blue-500", bg: "bg-blue-500/10" },
                    { label: "Done", value: "16", color: "text-green-500", bg: "bg-green-500/10" },
                  ].map((stat) => (
                    <div key={stat.label} className="p-3 rounded-lg bg-muted/50 text-center">
                      <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg border border-border">
                    <p className="text-sm font-medium mb-2">Today&apos;s Priorities</p>
                    <div className="space-y-2">
                      {["Follow up with Shenzhen supplier", "Review packing list", "Confirm CHA documents"].map((task, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? "bg-orange-500" : i === 1 ? "bg-red-500" : "bg-blue-500"}`} />
                          <span className="truncate">{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg border border-border">
                    <p className="text-sm font-medium mb-2">Active Orders</p>
                    <div className="space-y-2">
                      {["LED Lights - Shenzhen", "Ceramic Tiles - Guangzhou", "Plywood - Domestic"].map((order, i) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                          <span className="truncate">{order}</span>
                          <Badge variant="outline" className="text-[10px]">{45 + i * 15}%</Badge>
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

// ─── Features Section ───────────────────────────────────

const features = [
  {
    icon: CheckSquare,
    title: "Smart Task Engine",
    description: "Capture tasks in under 15 seconds. Priority, status, due dates, reminders, and waiting-for tracking built in.",
  },
  {
    icon: Package,
    title: "Import/Purchase Orders",
    description: "18-stage China import workflow and 8-stage domestic purchase flow. Track every milestone from requirement to GRN.",
  },
  {
    icon: Calendar,
    title: "Calendar View",
    description: "Month, week, and day views. See tasks, milestones, ETD/ETA, and payment deadlines at a glance.",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description: "Automatic reminders for due dates, overdue items, waiting follow-ups, and milestone-based alerts.",
  },
  {
    icon: FileText,
    title: "Document Management",
    description: "Attach PI, PO, invoices, packing lists, BL/AWB, and customs documents to orders. Validated file types and sizes.",
  },
  {
    icon: TrendingUp,
    title: "Landed Cost Calculator",
    description: "Calculate true cost per SKU including freight, insurance, duty, CHA, and transport. Multiple allocation methods.",
  },
  {
    icon: Users,
    title: "Supplier Intelligence",
    description: "Supplier profiles with contacts, payment terms, order history, and performance scoring.",
  },
  {
    icon: BarChart3,
    title: "Reports & Analytics",
    description: "Task completion, overdue trends, import status, supplier performance, and daily activity insights.",
  },
  {
    icon: Bot,
    title: "AI Assistant",
    description: "Natural language task creation, daily briefings, and import status questions. Coming in Phase 2.",
  },
];

function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">Features</Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Everything you need to manage your work
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built for import/export professionals who need to capture work quickly,
            identify the next action, and never miss a follow-up.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Workflow Section ───────────────────────────────────

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

function WorkflowSection() {
  return (
    <section id="workflow" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">Workflow</Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Structured import/purchase workflows
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Never lose track of where an order stands. TaskPilot enforces stage progression
            and keeps all related tasks, documents, and payments linked.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* China Import */}
          <Card className="overflow-hidden">
            <div className="p-6 bg-primary text-primary-foreground">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Globe className="w-5 h-5" />
                China Import
              </h3>
              <p className="text-sm opacity-80 mt-1">18-stage workflow</p>
            </div>
            <CardContent className="p-6">
              <div className="space-y-2">
                {chinaStages.map((stage, idx) => (
                  <div
                    key={stage}
                    className={`flex items-center gap-3 p-2 rounded ${
                      idx < 8 ? "bg-green-500/10" :
                      idx === 8 ? "bg-primary/10 ring-2 ring-primary/30" :
                      "bg-muted/50"
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      idx < 8 ? "bg-green-500 text-white" :
                      idx === 8 ? "bg-primary text-primary-foreground" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {idx < 8 ? "✓" : idx + 1}
                    </div>
                    <span className={`text-sm ${idx === 8 ? "font-medium" : ""}`}>
                      {stage}
                    </span>
                    {idx === 8 && (
                      <Badge className="ml-auto text-xs">Current</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Domestic Purchase */}
          <Card className="overflow-hidden">
            <div className="p-6 bg-secondary text-secondary-foreground">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Package className="w-5 h-5" />
                Domestic Purchase
              </h3>
              <p className="text-sm opacity-80 mt-1">8-stage workflow</p>
            </div>
            <CardContent className="p-6">
              <div className="space-y-2">
                {domesticStages.map((stage, idx) => (
                  <div
                    key={stage}
                    className={`flex items-center gap-3 p-2 rounded ${
                      idx < 5 ? "bg-green-500/10" :
                      idx === 5 ? "bg-primary/10 ring-2 ring-primary/30" :
                      "bg-muted/50"
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      idx < 5 ? "bg-green-500 text-white" :
                      idx === 5 ? "bg-primary text-primary-foreground" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {idx < 5 ? "✓" : idx + 1}
                    </div>
                    <span className={`text-sm ${idx === 5 ? "font-medium" : ""}`}>
                      {stage}
                    </span>
                    {idx === 5 && (
                      <Badge className="ml-auto text-xs">Current</Badge>
                    )}
                  </div>
                ))}
              </div>

              {/* Stats */}
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

// ─── Product Principles Section ─────────────────────────

const principles = [
  {
    icon: Clock,
    question: "What do I need to do?",
    answer: "Today's priorities and overdue items surface immediately on the dashboard.",
  },
  {
    icon: Calendar,
    question: "When do I need to do it?",
    answer: "Due dates, reminders, and calendar views keep you on schedule.",
  },
  {
    icon: AlertTriangle,
    question: "What is overdue?",
    answer: "Overdue items escalate to daily reminders until resolved.",
  },
  {
    icon: Pause,
    question: "What am I waiting for?",
    answer: "Waiting-for items with follow-up dates are tracked and re-notified.",
  },
  {
    icon: TrendingUp,
    question: "What should I do next?",
    answer: "Next actions on tasks and order milestones guide your workflow.",
  },
];

function PrinciplesSection() {
  return (
    <section className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">Product Principles</Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Five questions, answered immediately
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            TaskPilot is designed to answer these five questions the moment you open the app.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {principles.map((principle, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-6 rounded-xl bg-card border border-border hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <principle.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">{principle.question}</h3>
                <p className="text-muted-foreground">{principle.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Tech Stack Section ─────────────────────────────────

function TechSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">Technology</Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Built with modern technology
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Fast, reliable, and ready for production.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {[
            { label: "Next.js", desc: "Full-stack React" },
            { label: "TypeScript", desc: "Type safety" },
            { label: "Supabase", desc: "Auth & Database" },
            { label: "Prisma", desc: "ORM" },
            { label: "Tailwind CSS", desc: "Styling" },
            { label: "PWA", desc: "Offline support" },
            { label: "Vercel", desc: "Hosting" },
            { label: "OpenAI", desc: "AI Assistant" },
          ].map((tech) => (
            <div key={tech.label} className="text-center p-4 rounded-lg bg-muted/50">
              <p className="font-semibold">{tech.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{tech.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing Section ────────────────────────────────────

function PricingSection() {
  return (
    <section id="pricing" className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">Pricing</Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free, upgrade when you need more.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Free */}
          <Card className="relative">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">Free</h3>
              <p className="text-3xl font-bold mb-1">₹0</p>
              <p className="text-sm text-muted-foreground mb-6">per month</p>
              <ul className="space-y-3 text-sm mb-6">
                {["Unlimited tasks", "5 active orders", "Basic reminders", "Calendar view", "Mobile PWA"].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-green-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/dashboard" className="block">
                <Button variant="outline" className="w-full">Get Started</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Pro */}
          <Card className="relative border-primary shadow-lg">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">Pro</h3>
              <p className="text-3xl font-bold mb-1">₹499</p>
              <p className="text-sm text-muted-foreground mb-6">per month</p>
              <ul className="space-y-3 text-sm mb-6">
                {["Everything in Free", "Unlimited orders", "Push notifications", "Document storage", "Landed cost calculator", "Priority support"].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-green-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/dashboard" className="block">
                <Button className="w-full">Start Free Trial</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Business */}
          <Card className="relative">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">Business</h3>
              <p className="text-3xl font-bold mb-1">₹1,499</p>
              <p className="text-sm text-muted-foreground mb-6">per month</p>
              <ul className="space-y-3 text-sm mb-6">
                {["Everything in Pro", "Team collaboration", "AI Assistant", "Advanced reports", "API access", "Custom integrations"].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-green-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/dashboard" className="block">
                <Button variant="outline" className="w-full">Contact Sales</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

// ─── CTA Section ────────────────────────────────────────

function CTASection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Ready to take control of your work?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join import/export professionals who never miss a deadline.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="gap-2 text-base px-8">
              Start Free Today
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Main Page ──────────────────────────────────────────

export default function MarketingPage() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <WorkflowSection />
      <PrinciplesSection />
      <TechSection />
      <PricingSection />
      <CTASection />
    </main>
  );
}
