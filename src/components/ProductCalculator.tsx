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
  const [manoObra, setManoObra] = useState(product.mano_obra || 0);
  const [iva, setIva] = useState(product.iva);
  const [precioFinal, setPrecioFinal] = useState(0);

  const calcularPrecioFinal = () => {
    const base = coste + envio + manoObra;
    return base * (1 + iva / 100);
  };

  useEffect(() => {
    setPrecioFinal(calcularPrecioFinal());
  }, [coste, envio, manoObra, iva]);

  useEffect(() => {
    if (product) {
      setCoste(product.coste);
      setEnvio(product.envio || 0);
      setManoObra(product.mano_obra || 0);
      setIva(product.iva);
    }
  }, [product]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant}>
          <Calculator className="h-4 w-4 mr-2" />
          Ver Precio
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
                <label className="text-sm font-medium">Mano de obra (€)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={manoObra}
                  onChange={(e) => setManoObra(Number(e.target.value))}
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
            </div>

            <div className="border-t pt-4 mt-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Subtotal (coste + envío + mano de obra):</span>
                <span>{(coste + envio + manoObra).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Precio con IVA:</span>
                <span>{precioFinal.toFixed(2)} €</span>
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
