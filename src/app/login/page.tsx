/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/lib/validators';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';

type LoginForm = { email: string; password: string };

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [error, setError] = useState('');

    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginForm) => {
        try {
        await login.mutateAsync(data);
        router.push('/dashboard');
        } catch (err: any) {
        setError(err.response?.data?.message || 'Error al iniciar sesión');
        }
    };

    return (
        <AuthLayout>
        <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 space-y-8">
            {/* Logo */}
            <div className="flex justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-4xl font-bold">T★S</span>
            </div>
            </div>

            {/* Título */}
            <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Bienvenido de nuevo</h1>
            <p className="text-gray-600">Ingresa tus credenciales para continuar</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Correo electrónico
                </Label>
                <Input
                id="email"
                type="email"
                placeholder="admin@tennisstar.com"
                {...register('email')}
                className="h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Contraseña
                </Label>
                <Input
                id="password"
                type="password"
                {...register('password')}
                className="h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
            </div>

            {error && (
                <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm text-center">
                {error}
                </div>
            )}

                <Button
                    type="submit"
                    disabled={login.isPending}
                    className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-xl shadow-lg transition-all hover:shadow-xl"
                    >
                    {login.isPending ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>
            </form>

            {/* Footer */}
            <p className="text-center text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="font-semibold text-orange-600 hover:text-orange-500 transition-colors">
                Regístrate aquí
            </Link>
            </p>
        </div>
        </AuthLayout>
    );
}