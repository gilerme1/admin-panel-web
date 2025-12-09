// app/dashboard/productos/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema } from '@/lib/validators';
import { Genero, EstadoProducto, Product } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type ProductForm = {
    nombre: string;
    descripcion?: string;
    genero: Genero;
    marca: string;
    precio: number;
    stock?: number;
    estado?: EstadoProducto;
    categoryId: string;
    };

    export default function ProductosPage() {
    const { products, isLoading, createProduct, updateProduct, deleteProduct } = useProducts();
    const { categories } = useCategories();
    const [open, setOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const { register, handleSubmit, reset, control, formState: { errors } } = useForm<ProductForm>({
        resolver: zodResolver(productSchema),
    });

    const onSubmit = async (data: ProductForm) => {
        try {
        if (editingProduct) {
            await updateProduct.mutateAsync({ id: editingProduct.id, dto: data });
        } else {
            await createProduct.mutateAsync(data);
        }
        setOpen(false);
        reset();
        setEditingProduct(null);
        } catch (error: any) {
        alert(error.response?.data?.message || 'Error al guardar producto');
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        reset({
        nombre: product.nombre,
        descripcion: product.descripcion,
        genero: product.genero,
        marca: product.marca,
        precio: product.precio,
        stock: product.stock,
        estado: product.estado,
        categoryId: product.categoryId,
        });
        setOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('¿Estás seguro de eliminar este producto?')) {
        try {
            await deleteProduct.mutateAsync(id);
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error al eliminar producto');
        }
        }
    };

    const filteredProducts = products.filter((p) =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) return <div>Cargando...</div>;

    return (
        <div className="space-y-6 pt-6 px-28">
            {/* 1. Encabezado y Botones de Acción */}
            <div className="flex items-center justify-between">
                <div>
                    {/* Clase corregida para Dark Mode */}
                    <h1 className="text-3xl font-bold text-foreground">Productos</h1> 
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        Importar Productos
                    </Button>
                    <Button
                        onClick={() => {
                        setEditingProduct(null);
                        reset();
                        setOpen(true);
                        }}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                        <Plus size={20} className="mr-2" />
                        Nuevo Producto
                    </Button>
                </div>
            </div>

            {/* 2. CONTENEDOR PRINCIPAL DEL LISTADO */}
            {/* Se cambió bg-white por bg-card y se agregó el borde y el shadow */}
            <div className="bg-card rounded-lg shadow border border-border"> 
                
                {/* 2.1. BARRA DE ACCIÓN (Búsqueda/Filtros) */}
                {/* Se eliminó el div con mx/border/shadow innecesarios y se ajusta el padding y borde inferior */}
                <div className="p-6 py-3 flex gap-4 border-b border-border">
                    <div className="relative flex-1 max-w-sm">
                        {/* Clase corregida para Dark Mode */}
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                        <Input
                        placeholder="Buscar productos por nombre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                        />
                    </div>
                    <Button variant="outline">
                        <Filter size={20} className="mr-2" />
                        Filtros
                    </Button>
                    <Button variant="ghost">Limpiar</Button>
                </div>
                
                {/* 2.2. TEXTO DE CONTEO */}
                <div className="px-6 py-3 text-sm text-muted-foreground">
                    Mostrando {filteredProducts.length} de {products.length} productos
                </div>

                {/* 2.3. CONTENEDOR DE LA TABLA (CORREGIDO) */}
                {/* Se ELIMINÓ el div extra que tenía border/mx/px y que rompía el fondo: */}
                {/* <div className="px-6 border border-gray-200 rounded-lg mx-6"> */}
                <div className="overflow-x-auto">
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Marca</TableHead>
                        <TableHead>Stock Total</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell>
                            <div>
                                <p className="font-medium">{product.nombre}</p>
                                {/* Clase corregida para Dark Mode */}
                                <p className="text-sm text-muted-foreground truncate">{product.descripcion}</p>
                            </div>
                            </TableCell>
                            <TableCell>{product.category?.nombre || product.genero}</TableCell>
                            <TableCell>{product.marca}</TableCell>
                            <TableCell>
                            {/* Clase ajustada para Dark Mode */}
                            <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded text-sm">
                                {product.stock} unidades
                            </span>
                            </TableCell>
                            <TableCell>
                            {/* Clase ajustada para Dark Mode */}
                            <span className={`px-2 py-1 rounded text-sm ${
                                product.estado === 'ACTIVO' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                : 'bg-gray-100 text-gray-800 dark:bg-muted dark:text-muted-foreground'
                            }`}>
                                {product.estado}
                            </span>
                            </TableCell>
                            <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                                <Edit size={18} />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                                {/* Clase corregida para Dark Mode */}
                                <Trash2 size={18} className="text-red-600 dark:text-red-400" />
                                </Button>
                            </div>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </div>
            </div>

            {/* Modal Crear/Editar Producto (Ajustes de color para el botón de Submit) */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{editingProduct ? 'Editar' : 'Crear'} Producto</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                    <Label>Nombre del Producto *</Label>
                    <Input placeholder="Nombre del producto" {...register('nombre')} />
                    {/* Clase corregida para Dark Mode */}
                    {errors.nombre && <p className="text-sm text-red-600 dark:text-red-400">{errors.nombre.message}</p>}
                    </div>

                    <div>
                    <Label>Descripción</Label>
                    <Textarea placeholder="Descripción detallada del producto" {...register('descripcion')} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Género *</Label>
                        <Controller
                        name="genero"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un género" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="HOMBRE">Hombre</SelectItem>
                                <SelectItem value="MUJER">Mujer</SelectItem>
                                <SelectItem value="NINO">Niño</SelectItem>
                            </SelectContent>
                            </Select>
                        )}
                        />
                        {/* Clase corregida para Dark Mode */}
                        {errors.genero && <p className="text-sm text-red-600 dark:text-red-400">{errors.genero.message}</p>}
                    </div>

                    <div>
                        <Label>Marca *</Label>
                        <Input placeholder="Buscar marca..." {...register('marca')} />
                        {/* Clase corregida para Dark Mode */}
                        {errors.marca && <p className="text-sm text-red-600 dark:text-red-400">{errors.marca.message}</p>}
                    </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                    <div>
                        <Label>Precio *</Label>
                        <Input type="number" step="0.01" {...register('precio', { valueAsNumber: true })} />
                        {/* Clase corregida para Dark Mode */}
                        {errors.precio && <p className="text-sm text-red-600 dark:text-red-400">{errors.precio.message}</p>}
                    </div>

                    <div>
                        <Label>Stock</Label>
                        <Input type="number" {...register('stock', { valueAsNumber: true })} />
                    </div>

                    <div>
                        <Label>Estado</Label>
                        <Controller
                        name="estado"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                                <SelectValue placeholder="Estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ACTIVO">Activo</SelectItem>
                                <SelectItem value="INACTIVO">Inactivo</SelectItem>
                            </SelectContent>
                            </Select>
                        )}
                        />
                    </div>
                    </div>

                    <div>
                    <Label>Categoría *</Label>
                    <Controller
                        name="categoryId"
                        control={control}
                        render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                            <SelectValue placeholder="Selecciona una categoría" />
                            </SelectTrigger>
                            <SelectContent>
                            {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                {cat.nombre}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        )}
                    />
                    {/* Clase corregida para Dark Mode */}
                    {errors.categoryId && <p className="text-sm text-red-600 dark:text-red-400">{errors.categoryId.message}</p>}
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                        Cancelar
                    </Button>
                    <Button 
                        type="submit" 
                        // Clase corregida para Dark Mode
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                        {editingProduct ? 'Actualizar' : 'Crear'} Producto
                    </Button>
                    </div>
                </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}