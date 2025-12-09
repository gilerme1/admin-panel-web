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
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
    { href: '/dashboard', icon: Home, label: 'Inicio' },
    { href: '/dashboard/ventas', icon: ShoppingCart, label: 'Ventas' },
    { href: '/dashboard/categorias', icon: Tag, label: 'Categorías' },
    { href: '/dashboard/productos', icon: Package, label: 'Productos' },
    { href: '/dashboard/clientes', icon: Users, label: 'Clientes', disabled: true },
    // Nota: Se usó TrendingUp dos veces, pero mantengo la estructura original
    { href: '/dashboard/marcas', icon: TrendingUp, label: 'Marcas', disabled: true }, 
    { href: '/dashboard/estadisticas', icon: TrendingUp, label: 'Estadísticas', disabled: true },
    { href: '/dashboard/descuentos', icon: Gift, label: 'Descuentos', disabled: true },
    { href: '/dashboard/puntos', icon: Award, label: 'Puntos de Lealtad', disabled: true },
    { href: '/dashboard/membresias', icon: CreditCard, label: 'Membresías', disabled: true },
    { href: '/dashboard/notificaciones', icon: Bell, label: 'Notificaciones', disabled: true },
    { href: '/dashboard/configuracion', icon: Settings, label: 'Configuración', disabled: true },
    { href: '/dashboard/ayuda', icon: HelpCircle, label: 'Ayuda', disabled: true },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        // ✅ CORRECCIÓN 1: Fondo y borde adaptables
        <aside className="w-64 bg-card border-r border-border h-screen fixed left-0 top-0">
            {/* Encabezado del Sidebar (Título de la App) */}
            {/* ✅ CORRECCIÓN 2: Fondo, borde y texto adaptables */}
            <div className="flex items-center px-4 h-16 border-b border-border"> 
                <h1 className="text-xl font-bold text-primary">Tennis Star</h1>
            </div>

            {/* Navegación principal */}
            <nav className="p-4 space-y-1">
                {menuItems.map((item) => {
                const Icon = item.icon;
                // Ajuste para rutas anidadas: la ruta activa también se considera activa si la ruta actual empieza con ella, excepto la raíz exacta '/dashboard'
                const isActive = pathname === item.href || (
                    pathname.startsWith(item.href) && item.href !== '/dashboard'
                );

                if (item.disabled) {
                    return (
                        <div
                            key={item.href}
                            // ✅ CORRECCIÓN 3: Texto inactivo adaptable
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
                                // ✅ CORRECCIÓN 4: Estilos activos adaptables (bg-secondary/text-secondary-foreground)
                                ? 'bg-secondary text-secondary-foreground font-semibold shadow-sm'
                                // ✅ CORRECCIÓN 5: Estilos inactivos adaptables (text-muted-foreground/hover:bg-accent)
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
    );
}