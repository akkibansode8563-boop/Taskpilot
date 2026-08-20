"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Package,
  Weight,
  Ruler,
  Trash2,
  ShoppingCart,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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
  description: string | null;
  notes: string | null;
  createdAt: string;
  defaultSupplier: {
    id: string;
    name: string;
  } | null;
  orderItems: Array<{
    id: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
    createdAt: string;
    order: {
      id: string;
      orderNumber: string;
      title: string;
      createdAt: string;
    };
  }>;
  _count: { orderItems: number };
}

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  async function fetchProduct() {
    try {
      const res = await fetch(`/api/products/${productId}`);
      if (res.ok) {
        const data = await res.json();
        setProduct(data);
      }
    } catch (err) {
      console.error("Failed to fetch product:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${productId}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/products");
      }
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-muted-foreground">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Product not found</p>
        <Link href="/products">
          <Button variant="link">Back to Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/products">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Package className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight">{product.name}</h1>
            {product.sku && (
              <Badge variant="outline" className="font-mono">{product.sku}</Badge>
            )}
          </div>
          {product.brand && (
            <p className="text-muted-foreground">{product.brand}</p>
          )}
        </div>
        <Button variant="destructive" size="icon" onClick={handleDelete}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Product Details */}
      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {product.hsCode && (
              <div>
                <p className="text-sm text-muted-foreground">HS Code</p>
                <p className="font-medium font-mono">{product.hsCode}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Unit</p>
              <p className="font-medium">{product.unit}</p>
            </div>
            {product.unitCost !== null && (
              <div>
                <p className="text-sm text-muted-foreground">Unit Cost</p>
                <p className="font-medium">
                  {product.unitCost > 100 ? "₹" : "$"}{product.unitCost.toLocaleString()}
                  <span className="text-muted-foreground">/{product.unit}</span>
                </p>
              </div>
            )}
            {product.weight !== null && (
              <div>
                <p className="text-sm text-muted-foreground">Weight</p>
                <p className="font-medium flex items-center gap-1">
                  <Weight className="w-4 h-4 text-muted-foreground" />
                  {product.weight} kg
                </p>
              </div>
            )}
            {product.cbm !== null && (
              <div>
                <p className="text-sm text-muted-foreground">CBM</p>
                <p className="font-medium flex items-center gap-1">
                  <Ruler className="w-4 h-4 text-muted-foreground" />
                  {product.cbm} m³
                </p>
              </div>
            )}
          </div>

          {product.description && (
            <>
              <Separator className="my-4" />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Description</p>
                <p>{product.description}</p>
              </div>
            </>
          )}

          {product.defaultSupplier && (
            <>
              <Separator className="my-4" />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Default Supplier</p>
                <Link
                  href={`/suppliers/${product.defaultSupplier.id}`}
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {product.defaultSupplier.name}
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Order History */}
      <Card>
        <CardHeader>
          <CardTitle>Order History ({product._count?.orderItems || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {!product.orderItems || product.orderItems.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No orders include this product yet
            </p>
          ) : (
            <div className="space-y-3">
              {product.orderItems.map((item) => (
                <Link key={item.id} href={`/orders/${item.order.id}`}>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                    <div>
                      <p className="font-medium">{item.order.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.order.orderNumber} · {new Date(item.order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {item.quantity} × {product.unit}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Total: {product.unitCost && product.unitCost > 100 ? "₹" : "$"}{item.totalCost.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
