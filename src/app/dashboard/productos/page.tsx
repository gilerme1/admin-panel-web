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
        // **********************************************
        // 1. CONTENEDOR RAIZ (Aplicación de Responsividad)
        // Se aplica padding dinámico y ancho máximo.
        // **********************************************
        <div className="space-y-6 pt-6 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-screen-xl mx-auto">
            
            {/* 1. Encabezado y Botones de Acción */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Productos</h1> 
                </div>
                {/* Contenedor de botones: Se hace el botón 'Importar' oculto en móvil */}
                <div className="flex gap-2"> 
                    <Button variant="outline" className="hidden sm:inline-flex">
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
                        <span className="hidden sm:inline">Nuevo Producto</span>
                        <span className="sm:hidden">Nuevo</span>
                    </Button>
                </div>
            </div>

            {/* 2. CONTENEDOR PRINCIPAL DEL LISTADO */}
            <div className="bg-card rounded-lg shadow border border-border"> 
                
                {/* ********************************************** */}
                {/* 2.1. BARRA DE ACCIÓN (Búsqueda/Filtros) - RESPONSIVA */}
                {/* Se usa flex-col/sm:flex-row para apilar en móvil y poner lado a lado en desktop. */}
                {/* ********************************************** */}
                <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4 border-b border-border">
                    
                    {/* Buscador: w-full en móvil, max-w-sm en sm+ */}
                    <div className="relative w-full sm:max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                        <Input
                            placeholder="Buscar productos por nombre..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-full"
                        />
                    </div>
                    
                    {/* Botones de Filtro/Limpiar: Agrupados, ocupan ancho completo en móvil */}
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Button variant="outline" className="flex-1 sm:flex-initial">
                            <Filter size={20} className="mr-2" />
                            Filtros
                        </Button>
                        <Button variant="ghost" className="flex-1 sm:flex-initial">
                            Limpiar
                        </Button>
                    </div>
                </div>
                
                {/* 2.2. TEXTO DE CONTEO */}
                <div className="px-6 py-3 text-sm text-muted-foreground">
                    Mostrando {filteredProducts.length} de {products.length} productos
                </div>

                {/* ********************************************** */}
                {/* 2.3. CONTENEDOR DE LA TABLA (Scroll Horizontal) */}
                {/* Se usa overflow-x-auto y min-w-[800px] para garantizar el scroll horizontal en pantallas pequeñas. */}
                {/* ********************************************** */}
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden shadow ring-1 ring-border sm:rounded-lg"> 
                            <Table className="min-w-[800px] lg:min-w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="px-4 py-3">Nombre</TableHead>
                                        
                                        {/* Categoría - oculto en móvil pequeño */}
                                        <TableHead className="px-4 py-3 hidden sm:table-cell">
                                            Categoría
                                        </TableHead>
                                        
                                        {/* Marca - oculto en móvil y tablet */}
                                        <TableHead className="px-4 py-3 hidden md:table-cell">
                                            Marca
                                        </TableHead>
                                        
                                        {/* Stock Total */}
                                        <TableHead className="px-4 py-3 text-right">Stock Total</TableHead>
                                        
                                        {/* Estado - oculto en móvil pequeño */}
                                        <TableHead className="px-4 py-3 hidden sm:table-cell">
                                            Estado
                                        </TableHead>
                                        
                                        <TableHead className="px-4 py-3 text-right">
                                            Acciones
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                
                                <TableBody>
                                    {filteredProducts.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell className="px-4 py-2">
                                                <div>
                                                    <p className="font-medium text-sm">{product.nombre}</p>
                                                    <p className="text-xs text-muted-foreground truncate max-w-[150px] sm:max-w-[200px]">
                                                        {product.descripcion}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            
                                            {/* Celdas de datos correspondientes (Ocultas en móvil) */}
                                            <TableCell className="px-4 py-2 hidden sm:table-cell">
                                                <span className="text-sm">
                                                    {product.category?.nombre || product.genero}
                                                </span>
                                            </TableCell>
                                            
                                            <TableCell className="px-4 py-2 hidden md:table-cell">
                                                <span className="text-sm">{product.marca}</span>
                                            </TableCell>
                                            
                                            <TableCell className="px-4 py-2 text-right">
                                                <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded text-xs sm:text-sm whitespace-nowrap">
                                                    {product.stock} uds
                                                </span>
                                            </TableCell>
                                            
                                            <TableCell className="px-4 py-2 hidden sm:table-cell">
                                                <span className={`px-2 py-1 rounded text-xs sm:text-sm whitespace-nowrap ${
                                                    product.estado === 'ACTIVO' 
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                                    : 'bg-gray-100 text-gray-800 dark:bg-muted dark:text-muted-foreground'
                                                }`}>
                                                    {product.estado}
                                                </span>
                                            </TableCell>
                                            
                                            <TableCell className="px-4 py-2 text-right">
                                                {/* Botones de acción: Se reducen de tamaño en móvil con h-8 w-8 y size={16} */}
                                                <div className="flex justify-end gap-1 sm:gap-2">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon"
                                                        className="h-8 w-8 sm:h-10 sm:w-10"
                                                        onClick={() => handleEdit(product)}
                                                    >
                                                        <Edit size={16} className="sm:w-[18px] sm:h-[18px]" />
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon"
                                                        className="h-8 w-8 sm:h-10 sm:w-10"
                                                        onClick={() => handleDelete(product.id)}
                                                    >
                                                        <Trash2 
                                                            size={16}
                                                            className="text-red-600 dark:text-red-400 sm:w-[18px] sm:h-[18px]" 
                                                        />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Crear/Editar Producto */}
            <Dialog open={open} onOpenChange={setOpen}>
                {/* max-w-2xl para desktop y max-h-[90vh] para que sea scrollable si el contenido es grande */}
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{editingProduct ? 'Editar' : 'Crear'} Producto</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                    <Label>Nombre del Producto *</Label>
                    <Input placeholder="Nombre del producto" {...register('nombre')} />
                    {errors.nombre && <p className="text-sm text-red-600 dark:text-red-400">{errors.nombre.message}</p>}
                    </div>

                    <div>
                    <Label>Descripción</Label>
                    <Textarea placeholder="Descripción detallada del producto" {...register('descripcion')} />
                    </div>

                    {/* Uso de grid para layout de 2 columnas. En móvil, grid-cols-2 es funcional, pero podría ser flex/grid-cols-1 si el formulario fuese mucho más largo. */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        {errors.genero && <p className="text-sm text-red-600 dark:text-red-400">{errors.genero.message}</p>}
                    </div>

                    <div>
                        <Label>Marca *</Label>
                        <Input placeholder="Buscar marca..." {...register('marca')} />
                        {errors.marca && <p className="text-sm text-red-600 dark:text-red-400">{errors.marca.message}</p>}
                    </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <Label>Precio *</Label>
                        <Input type="number" step="0.01" {...register('precio', { valueAsNumber: true })} />
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
                    {errors.categoryId && <p className="text-sm text-red-600 dark:text-red-400">{errors.categoryId.message}</p>}
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                        Cancelar
                    </Button>
                    <Button 
                        type="submit" 
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