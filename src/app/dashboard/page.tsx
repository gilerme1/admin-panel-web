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
        // Se cambió bg-white por bg-background para el soporte de Dark Mode en el fondo de carga
        <div className="flex h-screen items-center justify-center bg-background">
            <p className="text-lg text-gray-500">Cargando dashboard...</p>
        </div>
        );
    }

    return (
        // Se cambió bg-white por bg-background para el soporte de Dark Mode en el fondo de la página
        <div className="min-h-screen bg-background">
        {/* Contenido principal - márgenes laterales más amplios y centrado perfecto */}
        <div className="mx-auto max-w-screen-xl px-24 pt-4 pb-20">

            {/* Grid de 3 columnas con separación perfecta */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ==================== INVENTARIO DE PRODUCTOS ==================== */}
            {/* Se eliminó bg-white y border-gray-200. Card usa bg-card y border-border por defecto */}
            <Card className="rounded-2xl shadow-sm overflow-hidden">
                {/* Se eliminó border-gray-200. CardHeader usa border-border por defecto en su borde inferior */}
                <CardHeader className="border-b px-6 py-5">
                <div className="flex items-center gap-3">
                    {/* Se cambió text-gray-600 por text-muted-foreground */}
                    <Package className="h-5 w-5 text-muted-foreground" />
                    {/* Se cambió text-gray-900 por text-foreground */}
                    <CardTitle className="text-lg font-semibold text-foreground">
                    Inventario de Productos
                    </CardTitle>
                </div>
                </CardHeader>

                <CardContent className="p-6">
                {/* Se cambió text-gray-900 por text-foreground */}
                <div className="text-4xl font-bold text-foreground">{totalInventory}</div>
                {/* Se cambió text-gray-600 por text-muted-foreground */}
                <p className="text-sm text-muted-foreground mt-1">Productos en inventario</p>
                {/* Se cambió text-gray-900 por text-foreground */}
                <p className="text-lg font-semibold text-foreground mt-3">
                    Valor: ${totalValue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>

                <div className="mt-6 space-y-3">
                    {products.slice(0, 8).map((p) => (
                    <div key={p.id} className="flex justify-between text-sm">
                        {/* Se cambió text-gray-700 por text-foreground */}
                        <span className="text-foreground truncate max-w-[240px]">{p.nombre}</span>
                        {/* Se cambió text-gray-900 por text-foreground */}
                        <span className="font-medium text-foreground">{p.stock} uds.</span>
                    </div>
                    ))}
                    {products.length > 8 && (
                    <p className="text-xs text-gray-500 text-center pt-4">
                        +{products.length - 8} productos más
                    </p>
                    )}
                </div>

                {/* Botones */}
                {/* Se eliminó border-gray-200. Se usará border-border por defecto */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t">
                    {/* Se cambió bg-black y hover:bg-gray-900 por bg-primary y hover:bg-primary/90 */}
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground px-5" asChild>
                        <Link href="/dashboard/productos">+ Añadir</Link> 
                    </Button>
                    {/* Se cambió text-gray-600 y hover:text-gray-900 por text-muted-foreground y hover:text-foreground */}
                    <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground" asChild>
                        <Link href="/dashboard/productos">... Ver todos</Link>
                    </Button>
                </div>
                </CardContent>
            </Card>

            {/* ==================== VENTAS RECIENTES ==================== */}
            {/* Se eliminó bg-white y border-gray-200. Card usa bg-card y border-border por defecto */}
            <Card className="rounded-2xl shadow-sm overflow-hidden">
                {/* Se eliminó border-gray-200. CardHeader usa border-border por defecto en su borde inferior */}
                <CardHeader className="border-b px-6 py-5">
                <div className="flex items-center gap-3">
                    {/* Se cambió text-gray-600 por text-muted-foreground */}
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    {/* Se cambió text-gray-900 por text-foreground */}
                    <CardTitle className="text-lg font-semibold text-foreground">
                    Ventas Recientes
                    </CardTitle>
                </div>
                </CardHeader>

                <CardContent className="p-6">
                {recentSales.length === 0 ? (
                    <p className="text-center text-sm text-gray-500 py-16">
                    No hay ventas recientes
                    </p>
                ) : (
                    <div className="space-y-3">
                        {recentSales.map((sale) => (
                            <div
                            key={sale.id}
                            // Se cambiaron clases de color fijo a clases de tema
                            className="bg-card border border-border rounded-xl p-4 flex justify-between items-center shadow" 
                            >
                                {/* ... Contenido de la izquierda (múltiples líneas) ... */}
                                <div>
                                    {/* Se cambió text-gray-900 por text-foreground */}
                                    <p className="font-semibold text-sm text-foreground">{sale.user.nombre}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                    Order #{sale.id.slice(0, 8)} · {format(new Date(sale.createdAt), 'dd MMM yyyy HH:mm', { locale: es })}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">Status: SHIPPED</p>
                                </div>
                                {/* ... Monto de la derecha (una sola línea) ... */}
                                {/* Se cambió text-green-600 por color custom si existe o green-400 para Dark Mode */}
                                <p className="text-sm font-bold text-green-500">
                                    ${sale.total.toFixed(2)}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
                </CardContent>
            </Card>

            {/* ==================== PRODUCTOS MÁS VENDIDOS ==================== */}
            {/* Se eliminó bg-white y border-gray-200. Card usa bg-card y border-border por defecto */}
            <Card className="rounded-2xl shadow-sm overflow-hidden">
                {/* Se eliminó border-gray-200. CardHeader usa border-border por defecto en su borde inferior */}
                <CardHeader className="border-b px-6 py-5">
                <div className="flex items-center gap-3">
                    {/* Se cambió text-gray-600 por text-muted-foreground */}
                    <TrendingUp className="h-5 w-5 text-muted-foreground" />
                    {/* Se cambió text-gray-900 por text-foreground */}
                    <CardTitle className="text-lg font-semibold text-foreground">
                    Productos Más Vendidos
                    </CardTitle>
                </div>
                </CardHeader>

                <CardContent className="p-6">
                {topProducts.length === 0 ? (
                    <p className="text-center text-sm text-gray-500 py-16">
                    No hay productos top para mostrar.
                    </p>
                ) : (
                    <div className="space-y-4">
                    {topProducts.map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                        {/* Se cambió text-gray-700 por text-muted-foreground */}
                        <p className="text-sm font-medium text-muted-foreground truncate max-w-[210px]">
                            {item.nombre}
                        </p>
                        <div className="text-right">
                            {/* Se cambió text-gray-900 por text-foreground */}
                            <p className="text-lg font-bold text-foreground">
                            ${item.totalAmount.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500">{item.totalQty} vendidos</p>
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