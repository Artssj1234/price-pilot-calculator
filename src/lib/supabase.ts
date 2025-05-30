import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

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
  mano_obra: number;
  links: ProductLink[];
};

export async function fetchProducts() {
  const { data, error } = await supabase
    .from('productos')
    .select('*');

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return (data || []).map(item => ({
    ...item,
    links: Array.isArray(item.links)
      ? item.links.map((link: any) => ({
          nombre: link.nombre || '',
          url: link.url || ''
        }))
      : [],
    iva: item.iva || 0,
    envio: item.envio || 0,
    mano_obra: item.mano_obra || 0,
  })) as Product[];
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
