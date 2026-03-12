import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import type { CartItem, Product } from "../backend.d.ts";
import { getProductImages } from "../utils/productImages";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  products: Product[];
  onRemove: (productId: bigint) => void;
  onUpdateQty: (productId: bigint, qty: bigint) => void;
}

export function CartDrawer({
  open,
  onClose,
  cartItems,
  products,
  onRemove,
  onUpdateQty,
}: CartDrawerProps) {
  const getProduct = (id: bigint) => products.find((p) => p.id === id);

  const total = cartItems.reduce((sum, item) => {
    const p = getProduct(item.productId);
    if (!p) return sum;
    return sum + (Number(p.price) / 100) * Number(item.quantity);
  }, 0);

  const formatPrice = (n: number) => `₹${n.toLocaleString("en-IN")}`;
  const totalItems = cartItems.reduce((s, i) => s + Number(i.quantity), 0);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        data-ocid="cart.sheet"
        side="right"
        className="w-full sm:w-96 flex flex-col p-0"
      >
        <SheetHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-display text-lg">
              Your Bag{" "}
              {totalItems > 0 && (
                <span className="text-muted-foreground font-body text-sm">
                  ({totalItems} items)
                </span>
              )}
            </SheetTitle>
          </div>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div
            data-ocid="cart.empty_state"
            className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6"
          >
            <ShoppingBag className="h-12 w-12 text-muted-foreground/40" />
            <div>
              <p className="font-medium">Your bag is empty</p>
              <p className="text-sm text-muted-foreground mt-1">
                Add some beautiful pieces to get started
              </p>
            </div>
            <Button variant="outline" onClick={onClose} className="mt-2">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6">
              <div className="py-4 flex flex-col gap-4">
                {cartItems.map((item, i) => {
                  const product = getProduct(item.productId);
                  if (!product) return null;
                  const images = getProductImages(Number(item.productId));
                  const itemPrice =
                    (Number(product.price) / 100) * Number(item.quantity);
                  return (
                    <div key={String(item.productId)} className="flex gap-3">
                      <img
                        src={images.img1}
                        alt={product.name}
                        className="w-16 h-20 object-cover rounded-sm flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Size: {item.selectedSize}
                        </p>
                        <p className="text-xs font-semibold mt-1">
                          {formatPrice(itemPrice)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            type="button"
                            className="h-6 w-6 border border-border rounded-sm flex items-center justify-center hover:bg-secondary transition-colors"
                            onClick={() => {
                              const newQty = Number(item.quantity) - 1;
                              if (newQty <= 0) onRemove(item.productId);
                              else onUpdateQty(item.productId, BigInt(newQty));
                            }}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm w-6 text-center">
                            {Number(item.quantity)}
                          </span>
                          <button
                            type="button"
                            className="h-6 w-6 border border-border rounded-sm flex items-center justify-center hover:bg-secondary transition-colors"
                            onClick={() =>
                              onUpdateQty(
                                item.productId,
                                BigInt(Number(item.quantity) + 1),
                              )
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            data-ocid={`cart.delete_button.${i + 1}`}
                            className="ml-auto text-muted-foreground hover:text-destructive transition-colors"
                            onClick={() => onRemove(item.productId)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            <div className="px-6 py-4 border-t">
              <Separator className="mb-4" />
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium">Total</span>
                <span className="font-bold text-lg">{formatPrice(total)}</span>
              </div>
              <Button
                data-ocid="cart.primary_button"
                className="w-full tracking-wide"
                size="lg"
              >
                Checkout
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
