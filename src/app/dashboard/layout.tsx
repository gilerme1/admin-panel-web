// app/dashboard/layout.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (!localStorage.getItem('token')) {
        router.push('/login');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
        return <div className="flex items-center justify-center h-screen">Cargando...</div>;
    }

    return (
        <div className="flex bg-background min-h-screen"> {/* ✅ CORREGIDO */}
            <Sidebar />
            <div className="flex-1 ml-64">
                <Navbar />
                <main className="pt-16 p-6">{children}</main>
            </div>
        </div>
    );
}