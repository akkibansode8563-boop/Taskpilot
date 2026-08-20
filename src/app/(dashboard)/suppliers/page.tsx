"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Star,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Supplier {
  id: string;
  name: string;
  country: string | null;
  city: string | null;
  performanceScore: number | null;
  _count: { orders: number; products: number };
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchSuppliers();
  }, [searchQuery]);

  async function fetchSuppliers() {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);

      const res = await fetch(`/api/suppliers?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setSuppliers(data);
      }
    } catch (err) {
      console.error("Failed to fetch suppliers:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
            Supplier Partners
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage global vendors, factories, and domestic suppliers</p>
        </div>
        <Link href="/suppliers/new">
          <Button className="gap-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md shadow-indigo-500/20 active:scale-95 spring-transition px-4 py-2 font-semibold">
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Add Supplier
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative group">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-indigo-500 spring-transition" />
        <Input
          placeholder="Search suppliers by name, country, or city..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-10 bg-muted/50 border border-border/40 focus-visible:bg-background focus-visible:border-indigo-500/50 rounded-xl text-sm"
        />
      </div>

      {/* Supplier Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {loading ? (
          <Card className="md:col-span-2 rounded-2xl border-border/50">
            <CardContent className="p-12 text-center">
              <div className="text-muted-foreground font-medium animate-pulse">Loading suppliers directory...</div>
            </CardContent>
          </Card>
        ) : (
          suppliers.map((supplier) => (
            <Link key={supplier.id} href={`/suppliers/${supplier.id}`}>
              <Card className="interactive-card rounded-2xl border border-border/60 hover:border-indigo-500/40 shadow-xs hover:shadow-md cursor-pointer h-full bg-card">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12 rounded-xl ring-2 ring-indigo-500/20 shadow-xs shrink-0">
                      <AvatarFallback className="bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-bold text-base">
                        {supplier.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-bold text-base tracking-tight truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 spring-transition">{supplier.name}</h3>
                        {supplier.performanceScore && (
                          <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-xs">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{supplier.performanceScore}</span>
                          </div>
                        )}
                      </div>

                      {supplier.country && (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-3">
                          <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                          {supplier.city ? `${supplier.city}, ` : ""}{supplier.country}
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/40">
                        <Badge variant="secondary" className="text-[11px] font-semibold bg-muted text-foreground">
                          {supplier._count?.orders ?? 0} active orders
                        </Badge>
                        <Badge variant="outline" className="text-[11px] font-mono text-muted-foreground border-border/60">
                          {supplier._count?.products ?? 0} catalog products
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
