// hooks/useSales.ts
'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Order, CreateSaleDto, User } from '@/lib/types';

export function useSales() {
    const queryClient = useQueryClient();

    const { data: orders, isLoading } = useQuery({
        queryKey: ['orders'],
        queryFn: async () => {
        const { data } = await api.get<Order[]>('/sales');
        return data;
        },
    });

    const { data: users } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
        const { data } = await api.get<User[]>('/users');
        return data;
        },
    });

    const createSale = useMutation({
        mutationFn: async (dto: CreateSaleDto) => {
        const { data } = await api.post<Order>('/sales/generate', dto);
        return data;
        },
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });

    return {
        orders: orders || [],
        users: users || [],
        isLoading,
        createSale,
    };
}