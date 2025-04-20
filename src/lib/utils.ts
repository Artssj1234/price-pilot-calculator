
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Función para calcular el precio final
export function calculateFinalPrice(
  cost: number, 
  shipping: number | null = 0, 
  vat: number = 21, 
  profit: number = 30
): number {
  const shippingCost = shipping || 0;
  return (cost + shippingCost) * (1 + vat / 100) * (1 + profit / 100);
}

// Función para formatear precio
export function formatPrice(price: number): string {
  return price.toFixed(2) + " €";
}
