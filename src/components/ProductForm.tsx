import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createProduct, updateProduct, ProductLink, Product } from "@/lib/supabase";

// Esquema de validación para el formulario
const formSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  categoria: z.string().min(1, "La categoría es obligatoria"),
  coste: z.coerce.number().min(0, "El coste debe ser un número positivo"),
  envio: z.coerce.number().nullable().optional(),
  iva: z.coerce.number().min(0, "El IVA debe ser un número positivo"),
  mano_obra: z.coerce.number().min(0, "La mano de obra debe ser un número positivo"),
  links: z.array(
    z.object({
      nombre: z.string().min(1, "El nombre del enlace es obligatorio"),
      url: z.string().url("Ingrese una URL válida"),
    })
  ).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  product?: Product;
  categories: string[];
  onCreateCategory: (category: string) => void;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProductForm({
  product,
  categories,
  onCreateCategory,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const [links, setLinks] = useState<ProductLink[]>(product?.links || []);
  const [newLink, setNewLink] = useState({ nombre: "", url: "" });
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);

  const defaultValues: Partial<ProductFormValues> = {
    nombre: product?.nombre || "",
    categoria: product?.categoria || "",
    coste: product?.coste || 0,
    envio: product?.envio || null,
    iva: product?.iva || 21,
    mano_obra: (product as any)?.mano_obra || 0,
    links: product?.links || [],
  };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    if (product) {
      form.reset({
        nombre: product.nombre,
        categoria: product.categoria,
        coste: product.coste,
        envio: product.envio,
        iva: product.iva,
        mano_obra: (product as any).mano_obra,
        links: product.links,
      });
      setLinks(product.links || []);
    }
  }, [product, form]);

  const handleAddLink = () => {
    if (newLink.nombre && newLink.url) {
      setLinks([...links, newLink]);
      setNewLink({ nombre: "", url: "" });
    }
  };

  const handleRemoveLink = (index: number) => {
    const updatedLinks = [...links];
    updatedLinks.splice(index, 1);
    setLinks(updatedLinks);
  };

  const handleCreateCategory = () => {
    if (newCategory) {
      onCreateCategory(newCategory);
      form.setValue("categoria", newCategory);
      setNewCategory("");
      setShowNewCategory(false);
      toast("Categoría creada", {
        description: `Se ha creado la categoría "${newCategory}"`,
      });
    }
  };

  const onSubmit = async (values: ProductFormValues) => {
    try {
      const productData = {
        nombre: values.nombre,
        categoria: values.categoria,
        coste: values.coste,
        envio: values.envio ?? null,
        iva: values.iva,
        mano_obra: values.mano_obra,
        links: links,
      };

      if (product) {
        await updateProduct({
          id: product.id,
          ...productData,
        });
        toast("Producto actualizado", {
          description: `El producto "${values.nombre}" ha sido actualizado.`,
        });
      } else {
        await createProduct(productData as any);
        toast("Producto creado", {
          description: `El producto "${values.nombre}" ha sido creado.`,
        });
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving product:", error);
      toast("Error", {
        description: "Ha ocurrido un error al guardar el producto.",
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{product ? "Editar Producto" : "Nuevo Producto"}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del producto</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del producto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col space-y-2">
              <FormField
                control={form.control}
                name="categoria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    {!showNewCategory ? (
                      <div className="flex space-x-2">
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar categoría" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowNewCategory(true)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Nueva
                        </Button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Nueva categoría"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                        />
                        <Button
                          type="button"
                          onClick={handleCreateCategory}
                          disabled={!newCategory}
                        >
                          Añadir
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowNewCategory(false)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="coste"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio de coste (€)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="envio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coste de envío (€)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? null : Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="iva"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IVA (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mano_obra"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mano de obra (€)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormLabel>Enlaces</FormLabel>
              <div className="flex space-x-2">
                <Input
                  placeholder="Nombre del proveedor"
                  value={newLink.nombre}
                  onChange={(e) =>
                    setNewLink({ ...newLink, nombre: e.target.value })
                  }
                />
                <Input
                  placeholder="URL"
                  value={newLink.url}
                  onChange={(e) =>
                    setNewLink({ ...newLink, url: e.target.value })
                  }
                />
                <Button type="button" onClick={handleAddLink}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2 mt-2">
                {links.map((link, index) => (
                  <div key={index} className="flex space-x-2 items-center">
                    <div className="flex-grow border p-2 rounded-md flex justify-between items-center">
                      <div>
                        <span className="font-medium">{link.nombre}</span>
                        <span className="text-muted-foreground ml-2 text-sm overflow-hidden text-ellipsis">
                          {link.url}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveLink(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              {product ? "Actualizar Producto" : "Crear Producto"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
