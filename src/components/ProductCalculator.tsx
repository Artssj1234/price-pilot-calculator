
import { useState, useEffect } from "react";
import { Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Product } from "@/lib/supabase";

interface ProductCalculatorProps {
  product: Product;
  buttonVariant?: "default" | "outline" | "ghost";
}

export function ProductCalculator({ product, buttonVariant = "default" }: ProductCalculatorProps) {
  const [open, setOpen] = useState(false);
  const [coste, setCoste] = useState(product.coste);
  const [envio, setEnvio] = useState(product.envio || 0);
  const [iva, setIva] = useState(product.iva);
  const [beneficio, setBeneficio] = useState(product.beneficio);
  const [precioFinal, setPrecioFinal] = useState(0);

  // Calcular precio final
  const calcularPrecioFinal = () => {
    return (coste + envio) * (1 + iva / 100) * (1 + beneficio / 100);
  };

  // Actualizar precio final cuando cambian los valores
  useEffect(() => {
    setPrecioFinal(calcularPrecioFinal());
  }, [coste, envio, iva, beneficio]);

  // Actualizar valores cuando cambia el producto
  useEffect(() => {
    if (product) {
      setCoste(product.coste);
      setEnvio(product.envio || 0);
      setIva(product.iva);
      setBeneficio(product.beneficio);
    }
  }, [product]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant}>
          <Calculator className="h-4 w-4 mr-2" />
          Calculadora
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Calculadora de Precio Final</DialogTitle>
        </DialogHeader>
        <Card className="border-0 shadow-none">
          <CardHeader>
            <CardTitle className="text-lg">{product.nombre}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Precio de coste (€)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={coste}
                  onChange={(e) => setCoste(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Coste de envío (€)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={envio}
                  onChange={(e) => setEnvio(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">IVA (%)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={iva}
                  onChange={(e) => setIva(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Beneficio (%)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={beneficio}
                  onChange={(e) => setBeneficio(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Precio de coste + envío:</span>
                <span>{(coste + envio).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="font-medium">Con IVA ({iva}%):</span>
                <span>{((coste + envio) * (1 + iva / 100)).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between items-center mt-2 text-lg">
                <span className="font-bold">Precio final (con {beneficio}% beneficio):</span>
                <span className="font-bold">{precioFinal.toFixed(2)} €</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={() => setOpen(false)}>Cerrar</Button>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
