// hooks/useProducts.ts
'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Product, CreateProductDto, UpdateProductDto, Genero, EstadoProducto } from '@/lib/types';

interface ProductFilters {
    genero?: Genero;
    marca?: string;
    categoryId?: string;
    minPrecio?: number;
    maxPrecio?: number;
    estado?: EstadoProducto;
}

export function useProducts(filters?: ProductFilters) {
    const queryClient = useQueryClient();

    const { data: products, isLoading } = useQuery({
        queryKey: ['products', filters],
        queryFn: async () => {
        const params = new URLSearchParams();
        if (filters?.genero) params.append('genero', filters.genero);
        if (filters?.marca) params.append('marca', filters.marca);
        if (filters?.categoryId) params.append('categoryId', filters.categoryId);
        if (filters?.minPrecio) params.append('minPrecio', filters.minPrecio.toString());
        if (filters?.maxPrecio) params.append('maxPrecio', filters.maxPrecio.toString());
        if (filters?.estado) params.append('estado', filters.estado);

        const { data } = await api.get<Product[]>(`/products?${params.toString()}`);
        return data;
        },
    });

    const createProduct = useMutation({
        mutationFn: async (dto: CreateProductDto) => {
        const { data } = await api.post<Product>('/products', dto);
        return data;
        },
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });

    const updateProduct = useMutation({
        mutationFn: async ({ id, dto }: { id: string; dto: UpdateProductDto }) => {
        const { data } = await api.patch<Product>(`/products/${id}`, dto);
        return data;
        },
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });

    const deleteProduct = useMutation({
        mutationFn: async (id: string) => {
        await api.delete(`/products/${id}`);
        },
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });

    return {
        products: products || [],
        isLoading,
        createProduct,
        updateProduct,
        deleteProduct,
    };
}