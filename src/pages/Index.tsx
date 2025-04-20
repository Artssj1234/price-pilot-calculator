
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/ProductForm";
import { ProductTable } from "@/components/ProductTable";
import { toast } from "@/components/ui/sonner";
import { fetchProducts, fetchCategories, Product } from "@/lib/supabase";

export default function Index() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Cargar productos y categorías
  const loadData = async () => {
    setLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast("Error", {
        description: "Ha ocurrido un error al cargar los datos.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadData();
  }, []);

  // Manejar creación de categoría
  const handleCreateCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories([...categories, category]);
    }
  };

  // Manejar edición de producto
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  // Manejar éxito en el formulario
  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProduct(null);
    loadData();
  };

  // Manejar cancelación del formulario
  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Price Pilot</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      {showForm ? (
        <ProductForm
          product={editingProduct || undefined}
          categories={categories}
          onCreateCategory={handleCreateCategory}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      ) : (
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-pulse text-xl">Cargando...</div>
            </div>
          ) : (
            <ProductTable
              products={products}
              categories={categories}
              onEdit={handleEditProduct}
              onDelete={loadData}
            />
          )}
        </div>
      )}
    </div>
  );
}
