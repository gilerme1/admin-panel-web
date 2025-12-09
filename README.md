# 🎾 Tennis Star - Admin Panel Frontend

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

Panel administrativo moderno para gestión de inventario de e-commerce, construido con Next.js 14, React, TypeScript y Tailwind CSS.

---

## 📋 Tabla de Contenidos

- [Características](#características)
- [Demo](#demo)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Hooks Personalizados](#hooks-personalizados)
- [Componentes Reutilizables](#componentes-reutilizables)
- [Decisiones de Diseño](#decisiones-de-diseño)

---

## ✨ Características

- ✅ **Autenticación JWT** con refresh automático
- ✅ **CRUDs completos** con formularios validados (React Hook Form + Zod)
- ✅ **Gestión de estado** con TanStack Query (React Query)
- ✅ **Sistema de carrito** para generación de ventas
- ✅ **Búsqueda y filtros** en tiempo real
- ✅ **Ordenamiento dinámico** de tablas
- ✅ **Validación de stock** antes de confirmar ventas
- ✅ **UI moderna** con Shadcn UI + Tailwind CSS
- ✅ **Breadcrumbs dinámicos** en navegación
- ✅ **Responsive design** optimizado para escritorio

---

## 🎥 Demo

[Incluir capturas de pantalla o link a deploy]

---

## 🛠️ Tecnologías

| Tecnología | Propósito |
|------------|-----------|
| **Next.js 14** | Framework React con App Router |
| **TypeScript** | Type safety en todo el proyecto |
| **Tailwind CSS** | Estilos utility-first |
| **Shadcn UI** | Componentes accesibles con Radix UI |
| **TanStack Query** | State management y cache de API |
| **React Hook Form** | Formularios performantes |
| **Zod** | Validación de schemas |
| **Axios** | Cliente HTTP con interceptores |
| **Lucide React** | Iconos SVG optimizados |

---

## 🚀 Instalación

```bash
# Clonar repositorio
git clone <repo-url>
cd prueba-front

# Instalar dependencias
npm install

# Instalar dependencias adicionales de Radix UI
npm install @radix-ui/react-label @radix-ui/react-select @radix-ui/react-avatar @radix-ui/react-checkbox
npm install tailwind-merge date-fns
```

---

## ⚙️ Configuración

### **1. Variables de Entorno**

Crear archivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### **2. Verificar Backend**

Asegurarse de que el backend esté corriendo en `http://localhost:3000`

---

## 🏃 Ejecución

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build
npm start

# Lint
npm run lint
```

La aplicación estará disponible en `http://localhost:3001`

---

## 📂 Estructura del Proyecto

```
app/
├── login/
│   └── page.tsx              # Pantalla de login
├── dashboard/
│   ├── layout.tsx            # Layout con Sidebar + Navbar
│   ├── page.tsx              # Dashboard principal (inicio)
│   ├── categorias/
│   │   └── page.tsx          # CRUD Categorías
│   ├── productos/
│   │   └── page.tsx          # CRUD Productos
│   └── ventas/
│       └── page.tsx          # Gestión de Ventas
├── providers.tsx             # QueryClient Provider
├── layout.tsx                # Root Layout
└── globals.css               # Estilos globales

components/
├── layout/
│   ├── Sidebar.tsx           # Navegación lateral
│   └── Navbar.tsx            # Barra superior con breadcrumbs
└── ui/                       # Componentes Shadcn
    ├── button.tsx
    ├── input.tsx
    ├── dialog.tsx
    ├── table.tsx
    ├── select.tsx
    └── ...

hooks/
├── useAuth.ts                # Autenticación + JWT
├── useCategories.ts          # CRUD Categorías
├── useProducts.ts            # CRUD Productos con filtros
└── useSales.ts               # Generación de ventas

lib/
├── api.ts                    # Axios instance con interceptores
├── types.ts                  # TypeScript interfaces
├── validators.ts             # Zod schemas
└── utils.ts                  # Utilidades (cn, etc.)
```

---

## 🪝 Hooks Personalizados

### **useAuth**
Maneja autenticación JWT con refresh automático:

```tsx
const { user, login, logout, isAuthenticated } = useAuth();

// Login
await login.mutateAsync({ email, password });

// Logout
logout();
```

### **useCategories**
CRUD completo de categorías:

```tsx
const { 
  categories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} = useCategories();

// Crear
await createCategory.mutateAsync({ nombre: 'Zapatillas' });

// Editar
await updateCategory.mutateAsync({ 
  id: 'uuid', 
  dto: { nombre: 'Zapatillas Deportivas' } 
});
```

### **useProducts**
CRUD de productos con filtros opcionales:

```tsx
const { products, createProduct } = useProducts({
  genero: 'HOMBRE',
  marca: 'Nike',
  minPrecio: 100,
  maxPrecio: 500
});
```

### **useSales**
Gestión de ventas con carrito:

```tsx
const { orders, users, createSale } = useSales();

await createSale.mutateAsync({
  userId: 'uuid-usuario',
  items: [
    { productId: 'uuid-producto', quantity: 2, price: 1499.99 }
  ]
});
```

---

## 🧩 Componentes Reutilizables

### **Principios de Diseño**

1. **Composición sobre configuración**: Componentes pequeños y combinables
2. **Accesibilidad first**: Radix UI maneja ARIA, keyboard navigation
3. **Type-safe**: Props completamente tipadas con TypeScript
4. **Estilización flexible**: `className` prop para personalización

### **Ejemplo: Dialog Modal Reutilizable**

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Nueva Categoría</DialogTitle>
    </DialogHeader>
    
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('nombre')} />
      <Button type="submit">Crear</Button>
    </form>
  </DialogContent>
</Dialog>
```

### **Tabla con Paginación y Ordenamiento**

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead 
        className="cursor-pointer" 
        onClick={() => toggleSort('nombre')}
      >
        Cliente {sortBy === 'nombre' && '↕'}
      </TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {filteredData.map(item => (
      <TableRow key={item.id}>
        <TableCell>{item.nombre}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

## 💡 Decisiones de Diseño

### **¿Por qué TanStack Query?**
- **Cache automático**: Reduce llamadas API innecesarias
- **Refetch inteligente**: Invalida queries después de mutaciones
- **Estados de loading/error**: Manejo centralizado de estados async
- **Optimistic updates**: UI responsive sin esperar servidor

```tsx
const createCategory = useMutation({
  mutationFn: async (dto) => api.post('/categories', dto),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['categories'] });
  }
});
```

### **¿Por qué React Hook Form + Zod?**
- **Performance**: Solo re-renderiza campos modificados
- **Validación type-safe**: Zod infiere tipos automáticamente
- **Menos boilerplate**: Código más limpio que `useState` manual

```tsx
const schema = z.object({
  nombre: z.string().min(1, 'Nombre requerido'),
  precio: z.number().min(0, 'Precio inválido'),
});

const { register, handleSubmit } = useForm({
  resolver: zodResolver(schema)
});
```

### **Estructura de CRUDs Reutilizable**

Todos los CRUDs siguen el mismo patrón:

1. **Lista** con búsqueda y filtros
2. **Modal** para crear/editar (mismo formulario)
3. **Confirmación** para eliminar
4. **Refetch automático** después de mutaciones

Esto permite escalar fácilmente agregando nuevos recursos (marcas, clientes, etc.) copiando la estructura existente.

---

## 🔒 Seguridad

- **JWT en localStorage**: Token manejado en interceptor Axios
- **Redirección automática**: Si 401, redirect a `/login`
- **Validación client-side**: Zod previene envío de datos inválidos
- **CORS configurado**: Backend acepta requests del frontend

---

## 📱 Responsive Design

- **Desktop-first**: Optimizado para administradores en escritorio
- **Sidebar fijo**: Navegación siempre visible
- **Tablas scrollables**: Horizontal scroll en pantallas pequeñas
- **Formularios adaptativos**: Grid cols ajustables con Tailwind

---

## 🚀 Deploy

### **Vercel (Recomendado)**

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Variables de entorno en Vercel:
- `NEXT_PUBLIC_API_URL`: URL del backend en producción

### **Otras Opciones**
- Netlify
- Railway
- Render

---

## 🧪 Testing (Opcional)

```bash
# Unit tests
npm run test

# E2E con Playwright
npm run test:e2e
```

---

## 📝 Scripts Útiles

```bash
# Formatear código
npm run format

# Type-check sin build
npx tsc --noEmit

# Analizar bundle
npm run build && npx @next/bundle-analyzer
```

