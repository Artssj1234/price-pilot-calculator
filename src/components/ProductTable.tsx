
import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { ProductCalculator } from "@/components/ProductCalculator";
import { ProductLinks } from "@/components/ProductLinks";
import { Product, deleteProduct } from "@/lib/supabase";

interface ProductTableProps {
  products: Product[];
  categories: string[];
  onEdit: (product: Product) => void;
  onDelete: () => void;
}

export function ProductTable({
  products,
  categories,
  onEdit,
  onDelete,
}: ProductTableProps) {
  const [filter, setFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Filtrar productos por nombre y categoría
  const filteredProducts = products.filter((product) => {
    const matchesName = product.nombre
      .toLowerCase()
      .includes(filter.toLowerCase());
    const matchesCategory =
      categoryFilter === "" || product.categoria === categoryFilter;
    return matchesName && matchesCategory;
  });

  // Manejar eliminación de producto
  const handleDeleteProduct = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete.id);
        toast("Producto eliminado", {
          description: `El producto "${productToDelete.nombre}" ha sido eliminado.`,
        });
        onDelete();
      } catch (error) {
        console.error("Error deleting product:", error);
        toast("Error", {
          description: "Ha ocurrido un error al eliminar el producto.",
        });
      }
      setProductToDelete(null);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar por nombre..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
          <Select
            value={categoryFilter}
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas las categorías" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas las categorías</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Coste (€)</TableHead>
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  No se encontraron productos
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.nombre}</TableCell>
                  <TableCell>{product.categoria}</TableCell>
                  <TableCell>{product.coste.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <ProductCalculator product={product} buttonVariant="outline" />
                      <ProductLinks product={product} />
                      <Button
                        variant="outline"
                        onClick={() => onEdit(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            onClick={() => setProductToDelete(product)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Eliminar producto
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              ¿Estás seguro de que deseas eliminar el producto "
                              {productToDelete?.nombre}"? Esta acción no se puede
                              deshacer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              onClick={() => setProductToDelete(null)}
                            >
                              Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteProduct}>
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
