# Price Pilot - Calculadora de Precios

Price Pilot es una aplicación web profesional y sencilla que permite gestionar productos o servicios y calcular fácilmente su precio final.

## Funcionalidades

- Registro de productos/servicios con todos los campos necesarios
- Visualización en tabla con filtros por categoría y búsqueda por nombre
- Calculadora de precio final que se actualiza en tiempo real
- Edición y eliminación de productos existentes
- Persistencia completa en Supabase

## Configuración

Este proyecto utiliza Supabase como backend. Para configurarlo:

1. Crea una cuenta y un proyecto en [Supabase](https://supabase.com/)
2. Crea una tabla llamada `productos` con la siguiente estructura:

```sql
CREATE TABLE productos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  categoria TEXT NOT NULL,
  coste NUMERIC NOT NULL,
  envio NUMERIC,
  iva NUMERIC NOT NULL DEFAULT 21,
  beneficio NUMERIC NOT NULL DEFAULT 30,
  links JSONB DEFAULT '[]'::jsonb
);
```

3. Copia tu URL de Supabase y tu clave anon en un archivo `.env` basado en el archivo `.env.example`

## Tecnologías

- Vite
- TypeScript
- React
- Supabase
- shadcn-ui
- Tailwind CSS

## Ejecución Local

```bash
# Instalar dependencias
npm install

# Crear archivo .env con las credenciales de Supabase
cp .env.example .env
# Edita el archivo .env con tus credenciales

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build
```

## Fórmula de Cálculo

El precio final se calcula usando la siguiente fórmula:

```
Precio final = (coste + envío) * (1 + IVA%) * (1 + beneficio%)
```

## Cómo Usar

1. Añade productos usando el botón "Nuevo Producto"
2. Filtra productos por categoría o busca por nombre
3. Usa la calculadora para ver y ajustar el precio final
4. Edita o elimina productos según sea necesario
5. Accede a los enlaces de proveedores guardados
