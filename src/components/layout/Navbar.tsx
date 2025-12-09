// components/layout/Navbar.tsx
'use client';

import { Bell, Sun, Moon, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
// Importación correcta del hook de tema
import { useTheme } from '@/app/providers'; 


export default function Navbar() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme(); 
    const pathname = usePathname();

    // Generar breadcrumb dinámico (MANTENIDO SIN CAMBIOS)
    const generateBreadcrumb = () => {
        const segments = pathname.split('/').filter(Boolean);

        // Si estamos en dashboard raíz
        if (segments.length === 1 && segments[0] === 'dashboard') {
        return [{ label: 'Inicio', href: '/dashboard' }];
        }

        const breadcrumbs = [{ label: 'Inicio', href: '/dashboard' }];

        let currentPath = '/dashboard';

        for (let i = 1; i < segments.length; i++) {
        const segment = segments[i];

        currentPath += `/${segment}`;

        let label = segment.charAt(0).toUpperCase() + segment.slice(1);

        // Traducciones y casos especiales
        const translations: Record<string, string> = {
            productos: 'Productos',
            ventas: 'Ventas',
            categorias: 'Categorías',
            new: 'Nuevo Producto',
            marcas: 'Marcas',
            clientes: 'Clientes',
            estadisticas: 'Estadísticas',
        };

        label = translations[segment] || label;

        breadcrumbs.push({
            label,
            href: currentPath,
        });
        }

        return breadcrumbs;
    };

    const breadcrumbs = generateBreadcrumb();

    return (
        // ✅ CORRECCIÓN 1: Fondo y borde adaptables
        <header className="h-16 bg-background border-b border-border fixed top-0 right-0 left-64 z-50">
        <div className="h-full px-6 flex items-center justify-between">

            {/* Breadcrumb */}
            <nav className="flex items-center">
            <ol className="flex items-center gap-2">
                {breadcrumbs.map((crumb, index) => (
                <li key={crumb.href} className="flex items-center gap-2">
                    {/* ✅ CORRECCIÓN 2: Separador adaptable */}
                    {index > 0 && <span className="text-muted-foreground">/</span>} 
                    {index === breadcrumbs.length - 1 ? (
                    <span 
                        // ✅ CORRECCIÓN 3: Texto activo (página actual)
                        className="text-lg font-bold text-foreground"
                    >
                        {crumb.label}
                    </span>
                    ) : (
                    <Link
                        href={crumb.href}
                        // ✅ CORRECCIÓN 4: Texto inactivo (link)
                        className="text-lg font-semibold text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {crumb.label}
                    </Link>
                    )}
                </li>
                ))}
            </ol>
            </nav>

            {/* Acciones derecha */}
            <div className="flex items-center gap-4">
            
            {/* Implementación del Toggle de Tema (Mantenido) */}
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                {/* ✅ CORRECCIÓN 5: Color de fondo adaptable para Avatar */}
                <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                    {user?.nombre?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
                </Avatar>

                <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="h-5 w-5" />
                </Button>
            </div>
            </div>
        </div>
        </header>
    );
}