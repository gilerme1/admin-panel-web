// src/app/dashboard/layout.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth(); // Asegúrate de que useAuth devuelva isLoading si lo tienes

    useEffect(() => {
        if (!isLoading && !localStorage.getItem('token')) {
            router.replace('/login');
        }
    }, [isLoading, router]);

    if (isLoading || !isAuthenticated) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <p className="text-lg text-muted-foreground">Verificando autenticación...</p>
            </div>
        );
    }

    return (
        <div className="flex bg-background min-h-screen">
            <Sidebar />
            <div className="flex-1 ml-64">
                <Navbar />
                <main className="pt-16 p-6">{children}</main>
            </div>
        </div>
    );
}