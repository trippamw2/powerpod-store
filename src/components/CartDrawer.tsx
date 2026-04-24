import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { formatMWK } from "@/data/products";
import { ShoppingBag, Minus, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";

export const CartDrawer = ({ children }: { children: React.ReactNode }) => {
  const { items, total, count, setQuantity, remove } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-accent" /> Your cart ({count})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 py-10">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Button asChild variant="hero" onClick={() => setOpen(false)}>
              <Link to="/shop">Start shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto -mx-6 px-6 py-4 space-y-4">
              {items.map((i) => (
                <div key={i.productKey} className="flex gap-3">
                  <div className="h-20 w-20 rounded-xl overflow-hidden bg-gradient-brand-soft shrink-0">
                    <img src={i.image} alt={i.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold leading-snug">{i.name}</p>
                      <button onClick={() => remove(i.productKey)} className="text-muted-foreground hover:text-destructive" aria-label="Remove">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">{formatMWK(i.price)}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-border bg-card">
                        <button onClick={() => setQuantity(i.productKey, i.quantity - 1)} className="p-1.5" aria-label="Decrease"><Minus className="h-3 w-3" /></button>
                        <span className="w-7 text-center text-sm font-semibold">{i.quantity}</span>
                        <button onClick={() => setQuantity(i.productKey, i.quantity + 1)} className="p-1.5" aria-label="Increase"><Plus className="h-3 w-3" /></button>
                      </div>
                      <p className="text-sm font-bold">{formatMWK(i.price * i.quantity)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border/60 pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total</span>
                <span className="font-display font-bold text-2xl text-gradient">{formatMWK(total)}</span>
              </div>
              <Button asChild variant="hero" size="lg" className="w-full" onClick={() => setOpen(false)}>
                <Link to="/checkout">Checkout</Link>
              </Button>
              <p className="text-xs text-center text-muted-foreground">You'll confirm and place the order via WhatsApp.</p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
