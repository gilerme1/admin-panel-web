/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { User } from '@/lib/types';

interface LoginCredentials {
    email: string;
    password: string;
}

interface RegisterCredentials {
    email: string;
    password: string;
    nombre: string;
}

interface LoginResponse {
    access_token: string;
    user: User;
}

export function useAuth() {
    const queryClient = useQueryClient();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const login = useMutation({
        mutationFn: async (credentials: LoginCredentials) => {
        const { data } = await api.post<LoginResponse>('/auth/login', credentials);
        return data;
        },
        onSuccess: (data) => {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        queryClient.setQueryData(['user'], data.user);
        },
    });

    const register = useMutation({
        mutationFn: async (credentials: RegisterCredentials) => {
        const { data } = await api.post('/auth/register', credentials);
        return data;
        },
    });

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        queryClient.clear();
        window.location.href = '/login';
    };

    const { data: user, isLoading: isLoadingUser } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
        const { data } = await api.get<User>('/users/me');
        return data;
        },
        enabled: isClient && !!localStorage.getItem('token'),
        retry: false,
    });

    return {
        user: user ?? null,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isLoading: login.isPending || register.isPending || isLoadingUser,
        isClient,
    };
}