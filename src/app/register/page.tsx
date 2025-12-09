/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@/lib/validators';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

type RegisterForm = {
  nombre: string;
  email: string;
  password: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerMutation } = useAuth();
  const [error, setError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerMutation.mutateAsync(data);
      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrarse');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Contenedor centrado y con ancho máximo correcto */}
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 space-y-8">
          {/* Logo grande con gradiente exacto al Figma */}
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-4xl font-bold">T★S</span>
            </div>
          </div>

          {/* Título y subtítulo */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Crear tu cuenta
            </h1>
            <p className="text-gray-600 text-base">
              Únete a Tennis Star Admin
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-sm font-medium text-gray-700">
                Nombre completo
              </Label>
              <Input
                id="nombre"
                type="text"
                placeholder="Juan Pérez"
                {...register('nombre')}
                className="h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
              {errors.nombre && (
                <p className="text-sm text-red-600">{errors.nombre.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="juan@ejemplo.com"
                {...register('email')}
                className="h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Contraseña */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                {...register('password')}
                className="h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm text-center font-medium">
                {error}
              </div>
            )}

            {/* Botón principal */}
            <Button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-xl shadow-lg transition-all hover:shadow-xl disabled:opacity-80"
                >
                {registerMutation.isPending ? 'Creando cuenta...' : 'Registrarse'}
            </Button>
          </form>

          {/* Link a login */}
          <p className="text-center text-sm text-gray-600 pt-4">
            ¿Ya tienes cuenta?{' '}
            <Link
              href="/login"
              className="font-semibold text-orange-600 hover:text-orange-500 transition-colors"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}