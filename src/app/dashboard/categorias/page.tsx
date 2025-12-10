// app/dashboard/categorias/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Eye, Edit, Trash2, Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categorySchema } from '@/lib/validators';
import { Category } from '@/lib/types';

type CategoryForm = {
    nombre: string;
};

export default function CategoriasPage() {
    const { categories, isLoading, createCategory, updateCategory, deleteCategory } = useCategories();
    const [open, setOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const { register, handleSubmit, reset, formState: { errors } } = useForm<CategoryForm>({
        resolver: zodResolver(categorySchema),
    });

    const onSubmit = async (data: CategoryForm) => {
        try {
        if (editingCategory) {
            await updateCategory.mutateAsync({ id: editingCategory.id, dto: data });
        } else {
            await createCategory.mutateAsync(data);
        }
        setOpen(false);
        reset();
        setEditingCategory(null);
        } catch (error: any) {
        alert(error.response?.data?.message || 'Error al guardar categoría');
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        reset({ nombre: category.nombre });
        setOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('¿Estás seguro de eliminar esta categoría?')) {
        try {
            await deleteCategory.mutateAsync(id);
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error al eliminar categoría');
        }
        }
    };

    const filteredCategories = categories.filter((c) =>
        c.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) return <div>Cargando...</div>;

    return (
        // ⚠️ MEJORA 1: Padding lateral responsivo (px-4 para móvil, subiendo hasta px-28 en desktop)
        <div className="space-y-6 pt-6 px-4 sm:px-8 md:px-12 lg:px-28">
            {/* 1. Encabezado y Botón Nueva Categoría */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Categorías</h1>
                </div>
                <Button
                onClick={() => {
                    setEditingCategory(null);
                    reset({ nombre: '' });
                    setOpen(true);
                }}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                <Plus size={20} className="mr-2" />
                <span className="hidden sm:inline">Nueva Categoría</span>
                <span className="sm:hidden">Nueva</span>
                </Button>
            </div>

            {/* 2. CONTENEDOR PRINCIPAL DE LISTADO */}
            <div className="bg-card rounded-lg shadow border border-border">
                
                {/* 2.1. CONTENEDOR DE LA BARRA DE ACCIÓN (BUSCADOR) */}
                <div className="px-6 py-4 border-b border-border">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                        <Input
                        placeholder="Buscar por nombre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                        />
                    </div>
                </div>

                {/* 2.2. CONTENEDOR DE LA TABLA DE CATEGORÍAS */}
                <div className="overflow-x-auto"> 
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Posición</TableHead>
                                <TableHead>Nombre</TableHead>
                                {/* ⚠️ MEJORA 2: Ocultar columnas menos importantes en móvil (md:table-cell) */}
                                <TableHead className="hidden md:table-cell">Subcategorías</TableHead>
                                <TableHead className="hidden md:table-cell">Categoría Padre</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCategories.map((category, index) => (
                            <TableRow key={category.id}>
                                <TableCell>{index}</TableCell>
                                <TableCell className="font-medium">{category.nombre}</TableCell>
                                {/* ⚠️ MEJORA 2: Ocultar celdas de datos correspondientes en móvil */}
                                <TableCell className="text-muted-foreground hidden md:table-cell">
                                    {category._count?.products || 0} subcategorías
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded text-xs">
                                    Principal
                                </span>
                                </TableCell>
                                <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button variant="ghost" size="icon">
                                        <Eye size={18} />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(category)}>
                                        <Edit size={18} />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(category.id)}>
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

            {/* Modal Crear/Editar Categoría */}
            <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        {editingCategory ? 'Editar' : 'Nueva'} Categoría
                    </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    
                    {/* CAMPO 1: NOMBRE */}
                    <div>
                        <label htmlFor="nombre" className="text-base font-semibold block mb-1">Nombre</label>
                        <Input
                            id="nombre"
                            placeholder="Nombre de la categoría"
                            {...register('nombre')}
                        />
                        {errors.nombre && (
                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.nombre.message}</p>
                        )}
                    </div>

                    {/* CAMPO 2: CATEGORÍA PADRE (MOCK) */}
                    <div>
                        <label htmlFor="categoriaPadre" className="text-base font-semibold block mb-1">Categoría Padre</label>
                        <Input
                            id="categoriaPadre"
                            placeholder="Seleccione categoría padre"
                            // ⚠️ NO REGISTRADO
                            onChange={() => {}} 
                        />
                    </div>

                    {/* CAMPO 3: POSICIÓN (MOCK) */}
                    <div>
                        <label htmlFor="posicion" className="text-base font-semibold block mb-1">Posición</label>
                        <Input
                            id="posicion"
                            placeholder="Elija la posición"
                            type="number" // Se ve mejor como numérico
                            // ⚠️ NO REGISTRADO
                            onChange={() => {}} 
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button 
                            type="submit" 
                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                            {editingCategory ? 'Guardar' : 'Crear'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
            </Dialog>
        </div>
    );
}