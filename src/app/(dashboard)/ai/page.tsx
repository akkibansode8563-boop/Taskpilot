"use client";

import { Bot, Sparkles, MessageSquare, Calendar, CheckSquare, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const examplePrompts = [
  {
    icon: CheckSquare,
    text: "Create a task to follow up with Shenzhen supplier on Friday",
    module: "Task",
  },
  {
    icon: Package,
    text: "What's overdue on the Mumbai warehouse order?",
    module: "Orders",
  },
  {
    icon: Calendar,
    text: "What should I do tomorrow?",
    module: "Planning",
  },
  {
    icon: MessageSquare,
    text: "Summarize my waiting items",
    module: "Tasks",
  },
];

export default function AIAssistantPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Bot className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">AI Assistant</h1>
        <p className="text-muted-foreground mt-2">
          Your natural language work assistant
        </p>
        <Badge className="mt-3" variant="secondary">
          <Sparkles className="w-3 h-3 mr-1" />
          Coming in Phase 2
        </Badge>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-medium mb-4">Example prompts you&apos;ll be able to use:</h3>
          <div className="space-y-3">
            {examplePrompts.map((prompt, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
              >
                <prompt.icon className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm">&ldquo;{prompt.text}&rdquo;</p>
                  <p className="text-xs text-muted-foreground mt-1">{prompt.module}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
