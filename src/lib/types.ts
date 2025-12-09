// lib/types.ts

export enum Genero {
    HOMBRE = 'HOMBRE',
    MUJER = 'MUJER',
    NINO = 'NINO',
}

export enum EstadoProducto {
    ACTIVO = 'ACTIVO',
    INACTIVO = 'INACTIVO',
}

export interface User {
    id: string;
    email: string;
    nombre: string;
    tel?: string;
    direccion?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Category {
    id: string;
    nombre: string;
    createdAt: string;
    updatedAt: string;
    _count?: {
        products: number;
    };
    products?: Product[];
}

export interface Product {
    id: string;
    nombre: string;
    descripcion?: string;
    genero: Genero;
    marca: string;
    precio: number;
    imagenes: string[];
    stock: number;
    estado: EstadoProducto;
    categoryId: string;
    category?: Category;
    createdAt: string;
    updatedAt: string;
}

export interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    price: number;
    quantity: number;
    product: Product;
}

export interface Order {
    id: string;
    userId: string;
    total: number;
    createdAt: string;
    updatedAt: string;
    user: User;
    items: OrderItem[];
}

export interface CreateCategoryDto {
    nombre: string;
}

export interface UpdateCategoryDto {
    nombre?: string;
}

export interface CreateProductDto {
    nombre: string;
    descripcion?: string;
    genero: Genero;
    marca: string;
    precio: number;
    imagenes?: string[];
    stock?: number;
    estado?: EstadoProducto;
    categoryId: string;
}

export interface UpdateProductDto {
    nombre?: string;
    descripcion?: string;
    genero?: Genero;
    marca?: string;
    precio?: number;
    imagenes?: string[];
    stock?: number;
    estado?: EstadoProducto;
    categoryId?: string;
}

export interface SaleItemDto {
    productId: string;
    quantity: number;
    price: number;
}

export interface CreateSaleDto {
    userId: string;
    items: SaleItemDto[];
}