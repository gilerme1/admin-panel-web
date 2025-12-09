// hooks/useCategories.ts
'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '@/lib/types';

export function useCategories() {
    const queryClient = useQueryClient();

    const { data: categories, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
        const { data } = await api.get<Category[]>('/categories');
        return data;
        },
    });

    const createCategory = useMutation({
        mutationFn: async (dto: CreateCategoryDto) => {
        const { data } = await api.post<Category>('/categories', dto);
        return data;
        },
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });

    const updateCategory = useMutation({
        mutationFn: async ({ id, dto }: { id: string; dto: UpdateCategoryDto }) => {
        const { data } = await api.patch<Category>(`/categories/${id}`, dto);
        return data;
        },
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });

    const deleteCategory = useMutation({
        mutationFn: async (id: string) => {
        await api.delete(`/categories/${id}`);
        },
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });

    return {
        categories: categories || [],
        isLoading,
        createCategory,
        updateCategory,
        deleteCategory,
    };
}