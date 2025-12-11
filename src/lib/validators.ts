// lib/validators.ts
import { z } from 'zod';
import { Genero, EstadoProducto } from './types';

// Auth
export const loginSchema = z.object({
    email: z.string().email('Correo electrónico inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

// Categories
export const categorySchema = z.object({
    nombre: z.string().min(1, 'El nombre es requerido'),
});

// Products
export const productSchema = z.object({
    nombre: z.string().min(1, 'El nombre es requerido'),
    descripcion: z.string().optional(),
    genero: z.nativeEnum(Genero, { message: 'Género inválido' }),
    marca: z.string().min(1, 'La marca es requerida'),
    precio: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
    imagenes: z.array(z.string()).optional(),
    stock: z.number().min(0, 'El stock debe ser mayor o igual a 0').optional(),
    estado: z.nativeEnum(EstadoProducto).optional(),
    categoryId: z.string().uuid('Categoría inválida'),
});

// Sales
export const saleItemSchema = z.object({
    productId: z.string().uuid('Producto inválido'),
    quantity: z.number().min(1, 'La cantidad debe ser al menos 1'),
    price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
});

export const saleSchema = z.object({
    userId: z.string().uuid('Usuario inválido'),
    items: z.array(saleItemSchema).min(1, 'Debe incluir al menos un producto'),
});

export const registerSchema = z.object({
    email: z.string().email('Correo inválido'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
    nombre: z.string().min(1, 'Nombre requerido'),
});