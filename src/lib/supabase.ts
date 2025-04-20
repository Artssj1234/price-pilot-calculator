
import { supabase } from '@/integrations/supabase/client';

// Tipos para nuestra tabla de productos
export type ProductLink = {
  nombre: string;
  url: string;
};

export type Product = {
  id: string;
  nombre: string;
  categoria: string;
  coste: number;
  envio: number | null;
  iva: number;
  beneficio: number;
  links: ProductLink[];
};

// Funciones para interactuar con la tabla de productos
export async function fetchProducts() {
  const { data, error } = await supabase
    .from('productos')
    .select('*');
  
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  
  return data || [];
}

export async function fetchCategories() {
  const { data, error } = await supabase
    .from('productos')
    .select('categoria')
    .order('categoria');
  
  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  
  // Eliminar duplicados
  const categories = data.map(item => item.categoria);
  return [...new Set(categories)];
}

export async function createProduct(product: Omit<Product, 'id'>) {
  const { data, error } = await supabase
    .from('productos')
    .insert([product])
    .select();
  
  if (error) {
    console.error('Error creating product:', error);
    throw error;
  }
  
  return data?.[0];
}

export async function updateProduct(product: Product) {
  const { data, error } = await supabase
    .from('productos')
    .update(product)
    .match({ id: product.id })
    .select();
  
  if (error) {
    console.error('Error updating product:', error);
    throw error;
  }
  
  return data?.[0];
}

export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from('productos')
    .delete()
    .match({ id });
  
  if (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
  
  return true;
}
