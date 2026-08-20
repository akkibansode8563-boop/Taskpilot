"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Product {
  id: string;
  sku: string | null;
  name: string;
  brand: string | null;
  hsCode: string | null;
  unit: string;
  unitCost: number | null;
  weight: number | null;
  cbm: number | null;
  defaultSupplier: { id: string; name: string } | null;
  _count: { orderItems: number };
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [searchQuery]);

  async function fetchProducts() {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);

      const res = await fetch(`/api/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Product catalog and HS codes</p>
        </div>
        <Link href="/products/new">
          <Button className="gap-1.5">
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, SKU, HS code, or supplier..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Product Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <Card className="md:col-span-2 lg:col-span-3">
            <CardContent className="p-8 text-center">
              <div className="text-muted-foreground">Loading products...</div>
            </CardContent>
          </Card>
        ) : (
          products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {product.sku && (
                          <Badge variant="outline" className="text-xs font-mono">
                            {product.sku}
                          </Badge>
                        )}
                        {product.hsCode && (
                          <Badge variant="secondary" className="text-xs">
                            HS: {product.hsCode}
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-semibold">{product.name}</h3>
                      {product.brand && (
                        <p className="text-sm text-muted-foreground">{product.brand}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {product.unitCost !== null && (
                      <div>
                        <p className="text-muted-foreground">Unit Cost</p>
                        <p className="font-medium">
                          {product.unitCost > 100 ? "₹" : "$"}
                          {product.unitCost.toLocaleString()}
                          <span className="text-muted-foreground">/{product.unit}</span>
                        </p>
                      </div>
                    )}
                    {product.weight !== null && (
                      <div>
                        <p className="text-muted-foreground">Weight</p>
                        <p className="font-medium">{product.weight} kg</p>
                      </div>
                    )}
                    {product.cbm !== null && (
                      <div>
                        <p className="text-muted-foreground">CBM</p>
                        <p className="font-medium">{product.cbm}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-muted-foreground">Orders</p>
                      <p className="font-medium">{product._count?.orderItems || 0}</p>
                    </div>
                  </div>

                  {product.defaultSupplier && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        Default Supplier: {product.defaultSupplier.name}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
