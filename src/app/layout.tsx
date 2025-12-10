// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import { Toaster } from '@/components/ui/sonner';  // ← NUEVA IMPORTACIÓN

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tennis Star - Dashboard',
  description: 'Sistema de gestión de inventario',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>{children}</Providers>
        {/* ← TOASTER GLOBAL (siempre visible) */}
        <Toaster
          position="bottom-right"
          richColors          
          closeButton         // Botón X para cerrar
          expand              // Expande al hover mostrando descripción completa
          toastOptions={{
            classNames: {
              toast: 'text-base',               
              title: 'text-lg font-semibold',   
              description: 'text-base',         
              actionButton: 'text-base px-4 py-2', 
              cancelButton: 'text-base px-4 py-2',
            },
            style: {
              padding: '1rem 1.5rem',           
              borderRadius: '12px',             
              gap: '0.75rem',                   
            },
            duration: 3000,                     
          }}
        />
      </body>
    </html>
  );
}