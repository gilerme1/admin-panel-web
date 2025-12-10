// src/app/dashboard/page.tsx
'use client';

import { useProducts } from '@/hooks/useProducts';
import { useSales } from '@/hooks/useSales';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, DollarSign, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function DashboardPage() {
    const { products = [], isLoading: productsLoading } = useProducts();
    const { orders = [] } = useSales();

    const totalInventory = products.reduce((sum, p) => sum + p.stock, 0);
    const totalValue = products.reduce((sum, p) => sum + p.stock * p.precio, 0);

    const recentSales = [...orders]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    const productSalesMap = new Map<string, { nombre: string; totalQty: number; totalAmount: number }>();

    orders.forEach((order) => {
        order.items.forEach((item) => {
            const prev = productSalesMap.get(item.productId) || { nombre: item.product.nombre, totalQty: 0, totalAmount: 0 };
            productSalesMap.set(item.productId, {
                nombre: item.product.nombre,
                totalQty: prev.totalQty + item.quantity,
                totalAmount: prev.totalAmount + item.price * item.quantity,
            });
        });
    });

    const topProducts = Array.from(productSalesMap.entries())
        .sort(([, a], [, b]) => b.totalQty - a.totalQty)
        .slice(0, 5)
        .map(([id, data]) => ({ id, ...data }));

    if (productsLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <p className="text-lg text-muted-foreground">Cargando dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Responsive padding - más estrecho en móvil */}
            <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-12 xl:px-24 pt-4 pb-12 sm:pb-20">

                {/* Grid responsive: 1 columna móvil, 2 tablet, 3 desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">

                    {/* ==================== INVENTARIO DE PRODUCTOS ==================== */}
                    <Card className="rounded-2xl shadow-sm overflow-hidden">
                        <CardHeader className="border-b px-4 sm:px-6 py-4 sm:py-5">
                            <div className="flex items-center gap-3">
                                <Package className="h-5 w-5 text-muted-foreground" />
                                <CardTitle className="text-base sm:text-lg font-semibold text-foreground">
                                    Inventario de Productos
                                </CardTitle>
                            </div>
                        </CardHeader>

                        <CardContent className="p-4 sm:p-6">
                            <div className="text-3xl sm:text-4xl font-bold text-foreground">{totalInventory}</div>
                            <p className="text-sm text-muted-foreground mt-1">Productos en inventario</p>
                            <p className="text-base sm:text-lg font-semibold text-foreground mt-3">
                                Valor: ${totalValue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                            </p>

                            {/* Lista de productos - scroll en móvil si es muy larga */}
                            <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3 max-h-64 sm:max-h-none overflow-y-auto">
                                {products.slice(0, 8).map((p) => (
                                    <div key={p.id} className="flex justify-between text-sm gap-2">
                                        <span className="text-foreground truncate flex-1">{p.nombre}</span>
                                        <span className="font-medium text-foreground whitespace-nowrap">{p.stock} uds.</span>
                                    </div>
                                ))}
                                {products.length > 8 && (
                                    <p className="text-xs text-muted-foreground text-center pt-4">
                                        +{products.length - 8} productos más
                                    </p>
                                )}
                            </div>

                            {/* Botones responsivos */}
                            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 sm:gap-0 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t">
                                <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 w-full sm:w-auto" asChild>
                                    <Link href="/dashboard/productos">+ Añadir</Link> 
                                </Button>
                                <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground w-full sm:w-auto" asChild>
                                    <Link href="/dashboard/productos">... Ver todos</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* ==================== VENTAS RECIENTES ==================== */}
                    <Card className="rounded-2xl shadow-sm overflow-hidden">
                        <CardHeader className="border-b px-4 sm:px-6 py-4 sm:py-5">
                            <div className="flex items-center gap-3">
                                <DollarSign className="h-5 w-5 text-muted-foreground" />
                                <CardTitle className="text-base sm:text-lg font-semibold text-foreground">
                                    Ventas Recientes
                                </CardTitle>
                            </div>
                        </CardHeader>

                        <CardContent className="p-4 sm:p-6">
                            {recentSales.length === 0 ? (
                                <p className="text-center text-sm text-muted-foreground py-12 sm:py-16">
                                    No hay ventas recientes
                                </p>
                            ) : (
                                <div className="space-y-2 sm:space-y-3">
                                    {recentSales.map((sale) => (
                                        <div
                                            key={sale.id}
                                            className="bg-card border border-border rounded-xl p-3 sm:p-4 flex justify-between items-center shadow gap-2"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm text-foreground truncate">{sale.user.nombre}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                                                    Order #{sale.id.slice(0, 8)}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    {format(new Date(sale.createdAt), 'dd MMM yyyy', { locale: es })}
                                                </p>
                                            </div>
                                            <p className="text-sm font-bold text-green-500 whitespace-nowrap">
                                                ${sale.total.toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* ==================== PRODUCTOS MÁS VENDIDOS ==================== */}
                    <Card className="rounded-2xl shadow-sm overflow-hidden md:col-span-2 lg:col-span-1">
                        <CardHeader className="border-b px-4 sm:px-6 py-4 sm:py-5">
                            <div className="flex items-center gap-3">
                                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                                <CardTitle className="text-base sm:text-lg font-semibold text-foreground">
                                    Productos Más Vendidos
                                </CardTitle>
                            </div>
                        </CardHeader>

                        <CardContent className="p-4 sm:p-6">
                            {topProducts.length === 0 ? (
                                <p className="text-center text-sm text-muted-foreground py-12 sm:py-16">
                                    No hay productos top para mostrar.
                                </p>
                            ) : (
                                <div className="space-y-3 sm:space-y-4">
                                    {topProducts.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between gap-3">
                                            <p className="text-sm font-medium text-muted-foreground truncate flex-1">
                                                {item.nombre}
                                            </p>
                                            <div className="text-right whitespace-nowrap">
                                                <p className="text-base sm:text-lg font-bold text-foreground">
                                                    ${item.totalAmount.toFixed(2)}
                                                </p>
                                                <p className="text-xs text-muted-foreground">{item.totalQty} vendidos</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}