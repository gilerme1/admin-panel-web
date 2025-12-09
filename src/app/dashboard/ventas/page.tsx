// app/dashboard/ventas/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import { useSales } from '@/hooks/useSales';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Eye, Search, Edit, ArrowDownUp, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SaleItemDto, Order } from '@/lib/types';

// Definición de tipos para la ordenación
type SortKey = 'nombre' | 'createdAt' | 'total';

export default function VentasPage() {
    const { orders, users, createSale } = useSales();
    const { products } = useProducts();
    const [open, setOpen] = useState(false);
    const [detailOpen, setDetailOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Estado del carrito
    const [selectedUserId, setSelectedUserId] = useState('');
    const [cart, setCart] = useState<SaleItemDto[]>([]);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [quantity, setQuantity] = useState(1);
    
    // Estado de ordenación
    const [sortBy, setSortBy] = useState<SortKey>('createdAt');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    const addToCart = () => {
        const product = products.find((p) => p.id === selectedProductId);
        if (!product) return;

        const existingItem = cart.find((item) => item.productId === selectedProductId);
        
        if (existingItem) {
            setCart(cart.map((item) =>
                item.productId === selectedProductId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ));
        } else {
            // Se usa el precio del producto actual en el momento de la venta
            setCart([...cart, { productId: product.id, quantity, price: product.precio }]);
        }

        setSelectedProductId('');
        setQuantity(1);
    };

    const removeFromCart = (productId: string) => {
        setCart(cart.filter((item) => item.productId !== productId));
    };

    const totalCart = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleCreateSale = async () => {
        if (!selectedUserId || cart.length === 0) {
            alert('Selecciona un usuario y agrega productos al carrito');
            return;
        }

        try {
            await createSale.mutateAsync({
                userId: selectedUserId,
                items: cart,
            });
            setOpen(false);
            setCart([]);
            setSelectedUserId('');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error al generar venta');
        }
    };

    const handleViewDetail = (order: Order) => {
        setSelectedOrder(order);
        setDetailOpen(true);
    };

    const toggleSort = (key: SortKey) => {
        if (sortBy === key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(key);
            setSortDirection('desc'); // Por defecto, descendente en una nueva columna
        }
    };
    
    // PASO 1: FILTRAR (DEBE IR ANTES DE ORDENAR)
    const filteredOrders = orders.filter((o) =>
        o.user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // PASO 2: ORDENAR (USA LA LISTA FILTRADA)
    const filteredAndSortedOrders = filteredOrders.sort((a, b) => {
        const direction = sortDirection === 'asc' ? 1 : -1;
        
        if (sortBy === 'nombre') {
            return a.user.nombre.localeCompare(b.user.nombre) * direction;
        }
        if (sortBy === 'createdAt') {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return (dateA - dateB) * direction;
        }
        if (sortBy === 'total') {
            return (a.total - b.total) * direction;
        }
        return 0;
    });

    return (
        <div className="space-y-6 pt-6 px-28">
            {/* Encabezado y Botón Nuevo Pedido */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Ventas</h1>
                </div>
                <Button onClick={() => setOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Plus size={20} className="mr-2" />
                    Nuevo Pedido
                </Button>
            </div>

            {/* CONTENEDOR PRINCIPAL DE LISTADO (CORREGIDO Dark Mode) */}
            <div className="bg-card rounded-lg shadow border border-border">
    
                {/* 1. CONTENEDOR DEL TÍTULO */}
                <div className="pt-4 pb-2 px-6"> 
                    <h2 className="text-xl font-semibold text-foreground">Listado de Ventas</h2>
                </div>

                {/* 2. CONTENEDOR DE LA BARRA DE ACCIÓN (BUSCADOR/FILTROS) */}
                <div className="px-6 py-4 flex items-center justify-between gap-4 border-b border-border">
                    {/* Buscador */}
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                        <Input
                            placeholder="Buscar por nombre o ID de orden..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    {/* Botones de Acción */}
                    <div className="flex gap-2">
                        <Button 
                            variant="outline" 
                            onClick={() => toggleSort('createdAt')}
                            className="flex items-center gap-1"
                        >
                            <ArrowDownUp size={18} />
                            Ordenar
                        </Button>
                        <Button variant="outline" className="flex items-center gap-1">
                            <Filter size={18} />
                            Filtros
                        </Button>
                    </div>
                </div>
                
                {/* 3. TABLA DE VENTAS (Asegura el scroll si es necesario) */}
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {/* Cliente */}
                                <TableHead 
                                    className="cursor-pointer hover:bg-accent/50 transition" 
                                    onClick={() => toggleSort('nombre')}
                                >
                                    Cliente
                                </TableHead>
                                
                                {/* Número de Orden/Fecha */}
                                <TableHead 
                                    className="cursor-pointer hover:bg-accent/50 transition"
                                    onClick={() => toggleSort('createdAt')}
                                >
                                    Número de Orden
                                </TableHead>
                                
                                <TableHead>Estado</TableHead>
                                <TableHead 
                                    className="cursor-pointer hover:bg-accent/50 transition"
                                    onClick={() => toggleSort('total')}
                                >
                                    Total
                                </TableHead>
                                
                                <TableHead>Pago</TableHead>
                                
                                {/* Acciones */}
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        
                        <TableBody>
                            {filteredAndSortedOrders.map((order) => (
                                <TableRow key={order.id}>
                                    {/* Celda Cliente */}
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{order.user.nombre}</p>
                                            <p className="text-sm text-muted-foreground">{order.user.email}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-mono text-sm">{order.id.slice(0, 8).toUpperCase()}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(order.createdAt).toLocaleDateString('es-MX')}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded text-sm">
                                            Enviado 
                                        </span>
                                    </TableCell>
                                    <TableCell className="font-semibold">
                                        ${order.total.toFixed(2)}
                                        <p className="text-xs text-muted-foreground mt-1">Tarjeta</p>
                                    </TableCell>
                                    
                                    <TableCell>
                                        <div className="flex flex-col"> 
                                            <span className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs w-fit">
                                                Pagado
                                            </span>
                                        </div>
                                    </TableCell>
                                    
                                    {/* Celda Acciones */}
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleViewDetail(order)}>
                                                <Eye size={18} />
                                            </Button>
                                            <Button variant="ghost" size="icon">
                                                <Edit size={18} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Modal Crear Venta */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Generar Nueva Venta</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                        <Label className="mb-4 block">Seleccionar Cliente *</Label>
                        <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                            <SelectTrigger>
                            <SelectValue placeholder="Selecciona un cliente" />
                            </SelectTrigger>
                            <SelectContent>
                            {users.map((user) => (
                                <SelectItem key={user.id} value={user.id}>
                                {user.nombre} ({user.email})
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        </div>

                        <div className="border-t pt-4">
                        <h3 className="font-semibold mb-3">Agregar Productos</h3>
                        <div className="flex gap-2">
                            <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                            <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Selecciona un producto" />
                            </SelectTrigger>
                            <SelectContent>
                                {products.map((product) => (
                                <SelectItem key={product.id} value={product.id}>
                                    {product.nombre} - ${product.precio} (Stock: {product.stock})
                                </SelectItem>
                                ))}
                            </SelectContent>
                            </Select>

                            <Input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="w-24"
                            placeholder="Cant."
                            />

                            <Button onClick={addToCart} disabled={!selectedProductId}>
                            Agregar
                            </Button>
                        </div>
                        </div>

                        {cart.length > 0 && (
                        <div className="border rounded-lg">
                            <div className="p-3 border-b border-border bg-muted">
                            <h3 className="font-semibold">Carrito ({cart.length} productos)</h3>
                            </div>
                            <div className="divide-y divide-border">
                            {cart.map((item) => {
                                const product = products.find((p) => p.id === item.productId);
                                return (
                                <div key={item.productId} className="p-3 flex justify-between items-center">
                                    <div>
                                    <p className="font-medium">{product?.nombre}</p>
                                    <p className="text-sm text-muted-foreground">
                                        ${item.price} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                    </div>
                                    <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFromCart(item.productId)}
                                    className="text-red-600 dark:text-red-400" 
                                    >
                                    Eliminar
                                    </Button>
                                </div>
                                );
                            })}
                            </div>
                            <div className="p-3 border-t border-border bg-muted flex justify-between items-center">
                            <span className="font-semibold">Total:</span>
                            <span className="text-xl font-bold">${totalCart.toFixed(2)}</span>
                            </div>
                        </div>
                        )}

                        <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleCreateSale}
                            disabled={cart.length === 0 || !selectedUserId}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                            Generar Venta
                        </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Modal Ver Detalle (Corregido cierre de JSX) */}
            <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Gestionar Orden</DialogTitle>
                    </DialogHeader>

                    {selectedOrder && (
                        <div className="space-y-4">
                        <div className="p-4 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-lg">
                            <p className="text-sm">Estado Actual: Enviado</p>
                            <p className="text-sm text-muted-foreground">Orden #{selectedOrder.id.slice(0, 8)}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="border border-border rounded-lg p-4">
                            <h3 className="font-semibold mb-2">Información del Cliente</h3>
                            <p className="text-sm"><strong>Nombre:</strong> {selectedOrder.user.nombre}</p>
                            <p className="text-sm"><strong>Email:</strong> {selectedOrder.user.email}</p>
                            <p className="text-sm"><strong>Teléfono:</strong> {selectedOrder.user.tel || 'N/A'}</p>
                            </div>

                            <div className="border border-border rounded-lg p-4">
                            <h3 className="font-semibold mb-2">Información de Pago</h3>
                            <p className="text-sm"><strong>Método:</strong> Tarjeta de Crédito</p>
                            <p className="text-sm"><strong>Estado:</strong> Pagado</p>
                            <p className="text-sm"><strong>Total:</strong> ${selectedOrder.total.toFixed(2)}</p>
                            </div>
                        </div>

                        <div className="border border-border rounded-lg p-4">
                            <h3 className="font-semibold mb-2">Productos</h3>
                            <div className="space-y-2">
                            {selectedOrder.items.map((item) => (
                                <div key={item.id} className="flex justify-between text-sm">
                                <span>{item.product.nombre} x{item.quantity}</span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                            </div>
                        </div>
                        </div>
                    )} {/* Cierre del bloque selectedOrder && (...) */}
                </DialogContent>
            </Dialog>
        </div>
    );
}