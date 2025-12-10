// components/layout/Sidebar.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    ShoppingCart,
    Tag,
    Package,
    Users,
    TrendingUp,
    Gift,
    Award,
    CreditCard,
    Bell,
    Settings,
    HelpCircle,
    X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// ... (menuItems se mantiene igual)

const menuItems = [
    { href: '/dashboard', icon: Home, label: 'Inicio' },
    { href: '/dashboard/ventas', icon: ShoppingCart, label: 'Ventas' },
    { href: '/dashboard/categorias', icon: Tag, label: 'Categorías' },
    { href: '/dashboard/productos', icon: Package, label: 'Productos' },
    { href: '/dashboard/clientes', icon: Users, label: 'Clientes', disabled: true },
    { href: '/dashboard/marcas', icon: TrendingUp, label: 'Marcas', disabled: true }, 
    { href: '/dashboard/estadisticas', icon: TrendingUp, label: 'Estadísticas', disabled: true },
    { href: '/dashboard/descuentos', icon: Gift, label: 'Descuentos', disabled: true },
    { href: '/dashboard/puntos', icon: Award, label: 'Puntos de Lealtad', disabled: true },
    { href: '/dashboard/membresias', icon: CreditCard, label: 'Membresías', disabled: true },
    { href: '/dashboard/notificaciones', icon: Bell, label: 'Notificaciones', disabled: true },
    { href: '/dashboard/configuracion', icon: Settings, label: 'Configuración', disabled: true },
    { href: '/dashboard/ayuda', icon: HelpCircle, label: 'Ayuda', disabled: true },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* Desktop Sidebar - Fixed */}
            {/* ✅ CORRECCIÓN: Se quita 'hidden lg:block' de aquí y se reemplaza por 'hidden' para que no duplique el sidebar de móvil,
               ya que el segundo 'aside' maneja el estado de `isOpen`.
               Pero si solo quieres que se vea en desktop: */}
            <aside className="hidden lg:block w-64 bg-card border-r border-border h-screen fixed left-0 top-0 z-30">
                <div className="flex items-center px-4 h-16 border-b border-border">
                    <h1 className="text-xl font-bold text-primary">Tennis Star</h1>
                </div>

                <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || (
                            pathname.startsWith(item.href) && item.href !== '/dashboard'
                        );

                        if (item.disabled) {
                            return (
                                <div
                                    key={item.href}
                                    className="flex items-center gap-3 px-3 py-2 text-muted-foreground/60 cursor-not-allowed"
                                >
                                    <Icon size={20} />
                                    <span className="text-sm">{item.label}</span>
                                </div>
                            );
                        }

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                                    isActive
                                        ? 'bg-secondary text-secondary-foreground font-semibold shadow-sm'
                                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                                )}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Mobile Sidebar - Drawer */}
            <aside 
                className={cn(
                    // ✅ Ajuste: Se usa 'block lg:hidden' para que solo aparezca en móvil
                    "block lg:hidden fixed left-0 top-0 z-50 w-64 h-screen bg-card border-r border-border transition-transform duration-300 ease-in-out",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Header con botón de cerrar */}
                <div className="flex items-center justify-between px-4 h-16 border-b border-border">
                    <h1 className="text-xl font-bold text-primary">Tennis Star</h1>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || (
                            pathname.startsWith(item.href) && item.href !== '/dashboard'
                        );

                        if (item.disabled) {
                            return (
                                <div
                                    key={item.href}
                                    className="flex items-center gap-3 px-3 py-2 text-muted-foreground/60 cursor-not-allowed"
                                >
                                    <Icon size={20} />
                                    <span className="text-sm">{item.label}</span>
                                </div>
                            );
                        }

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose} // Cerrar sidebar al hacer clic
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                                    isActive
                                        ? 'bg-secondary text-secondary-foreground font-semibold shadow-sm'
                                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                                )}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}