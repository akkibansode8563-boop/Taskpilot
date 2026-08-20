"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  Package,
  ShoppingCart,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Supplier {
  id: string;
  name: string;
  country: string | null;
  city: string | null;
  contacts: Array<{
    name: string;
    phone?: string;
    email?: string;
    role?: string;
  }> | null;
  paymentTerms: string | null;
  website: string | null;
  notes: string | null;
  performanceScore: number | null;
  createdAt: string;
  orders: Array<{
    id: string;
    orderNumber: string;
    title: string;
    type: string;
    status: string;
    currentStage: string | null;
    createdAt: string;
  }>;
  products: Array<{
    id: string;
    name: string;
    sku: string | null;
    unitCost: number | null;
  }>;
  _count: { orders: number; products: number };
}

export default function SupplierDetailPage() {
  const router = useRouter();
  const params = useParams();
  const supplierId = params.id as string;

  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSupplier();
  }, [supplierId]);

  async function fetchSupplier() {
    try {
      const res = await fetch(`/api/suppliers/${supplierId}`);
      if (res.ok) {
        const data = await res.json();
        setSupplier(data);
      }
    } catch (err) {
      console.error("Failed to fetch supplier:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this supplier?")) return;
    try {
      const res = await fetch(`/api/suppliers/${supplierId}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/suppliers");
      }
    } catch (err) {
      console.error("Failed to delete supplier:", err);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-muted-foreground">Loading supplier...</div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Supplier not found</p>
        <Link href="/suppliers">
          <Button variant="link">Back to Suppliers</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/suppliers">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <Avatar className="h-16 w-16">
          <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
            {supplier.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight">{supplier.name}</h1>
            {supplier.performanceScore && (
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span className="font-medium">{supplier.performanceScore}</span>
              </div>
            )}
          </div>
          {supplier.country && (
            <p className="text-muted-foreground flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {supplier.city ? `${supplier.city}, ` : ""}{supplier.country}
            </p>
          )}
        </div>
        <Button variant="destructive" size="icon" onClick={handleDelete}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          {supplier.contacts && supplier.contacts.length > 0 ? (
            <div className="space-y-4">
              {supplier.contacts.map((contact, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {contact.name.split(" ").map((w) => w[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      {contact.role && (
                        <p className="text-xs text-muted-foreground">{contact.role}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {contact.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" />
                        {contact.phone}
                      </div>
                    )}
                    {contact.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5" />
                        {contact.email}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No contacts added yet</p>
          )}

          {supplier.website && (
            <div className="mt-4 flex items-center gap-2 text-sm">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <a
                href={supplier.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center gap-1"
              >
                {supplier.website}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {supplier.paymentTerms && (
            <div className="mt-4 text-sm">
              <span className="text-muted-foreground">Payment Terms: </span>
              <span className="font-medium">{supplier.paymentTerms}</span>
            </div>
          )}

          {supplier.notes && (
            <div className="mt-4 text-sm">
              <span className="text-muted-foreground">Notes: </span>
              <span>{supplier.notes}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs: Orders & Products */}
      <Tabs defaultValue="orders">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="orders" className="gap-1.5">
            <Package className="w-4 h-4" />
            Orders ({supplier._count?.orders || 0})
          </TabsTrigger>
          <TabsTrigger value="products" className="gap-1.5">
            <ShoppingCart className="w-4 h-4" />
            Products ({supplier._count?.products || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-3">
          {!supplier.orders || supplier.orders.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No orders with this supplier yet
              </CardContent>
            </Card>
          ) : (
            supplier.orders.map((order) => (
              <Link key={order.id} href={`/orders/${order.id}`}>
                <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{order.title}</p>
                        <p className="text-sm text-muted-foreground">{order.orderNumber}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={order.type === "CHINA_IMPORT" ? "default" : "secondary"}>
                          {order.type === "CHINA_IMPORT" ? "China" : "Domestic"}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{order.currentStage?.replace(/_/g, " ")}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </TabsContent>

        <TabsContent value="products" className="space-y-3">
          {supplier.products.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No products linked to this supplier
              </CardContent>
            </Card>
          ) : (
            supplier.products.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        {product.sku && (
                          <Badge variant="outline" className="text-xs font-mono mt-1">
                            {product.sku}
                          </Badge>
                        )}
                      </div>
                      {product.unitCost !== null && (
                        <p className="font-semibold">
                          {product.unitCost > 100 ? "₹" : "$"}{product.unitCost.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
