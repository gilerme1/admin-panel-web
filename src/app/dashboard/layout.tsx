// src/app/dashboard/layout.tsx
'use client'; // ⬅️ NECESARIO para usar useState y los hooks de Sidebar

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    // 1. Añadir estado para controlar la visibilidad del Sidebar móvil
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleOpenSidebar = () => setIsSidebarOpen(true);
    const handleCloseSidebar = () => setIsSidebarOpen(false);

    return (
        // **********************************************
        // 2. CORRECCIÓN EN EL HTML: 
        // Se añade `lg:ml-64` al contenedor principal del contenido.
        // Se añade clase oculta `hidden lg:block` al Sidebar fijo.
        // El Sidebar ahora usa las props `isOpen` y `onClose`.
        // **********************************************
        <div className="flex bg-background min-h-screen">
            {/* Sidebar Desktop y Móvil (Drawer) */}
            <Sidebar 
                isOpen={isSidebarOpen} 
                onClose={handleCloseSidebar} 
            />

            {/* Contenedor Principal (Navbar + Contenido) */}
            {/* lg:ml-64 asegura el margen para el sidebar de escritorio (>1024px) */}
            {/* En móvil (<1024px), no hay margen fijo y la navbar está fijada. */}
            <div className="flex-1 lg:ml-64"> 
                {/* La Navbar ahora debería recibir la función de apertura, pero 
                    la pasaremos implícitamente a través del Navbar original 
                    o la manejaremos en el siguiente paso. */}
                <Navbar onOpenSidebar={handleOpenSidebar} /> 
                
                {/* El Navbar fijo tiene 4rem (h-16), así que el contenido comienza después */}
                <main className="pt-16 p-6">{children}</main>
            </div>
            
            {/* Overlay para móvil (cuando el sidebar está abierto) */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
                    onClick={handleCloseSidebar} 
                />
            )}
        </div>
    );
}