
import { useState } from "react";
import { Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Product } from "@/lib/supabase";

interface ProductLinksProps {
  product: Product;
  buttonVariant?: "default" | "outline" | "ghost";
}

export function ProductLinks({ product, buttonVariant = "outline" }: ProductLinksProps) {
  const [open, setOpen] = useState(false);

  // No mostrar el botón si no hay enlaces
  if (!product.links || product.links.length === 0) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant}>
          <Link className="h-4 w-4 mr-2" />
          Enlaces
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enlaces de {product.nombre}</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 mt-4">
          {product.links.map((link, index) => (
            <div key={index} className="flex justify-between items-center p-2 border rounded-md">
              <span className="font-medium">{link.nombre}</span>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Abrir enlace
              </a>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
