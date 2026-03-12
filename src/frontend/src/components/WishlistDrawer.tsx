import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Heart } from "lucide-react";
import type { Product } from "../backend.d.ts";
import { getProductImages } from "../utils/productImages";

interface WishlistDrawerProps {
  open: boolean;
  onClose: () => void;
  wishlistIds: bigint[];
  products: Product[];
  onToggleWishlist: (id: bigint) => void;
  onAddToCart: (productId: bigint, size: string) => void;
}

export function WishlistDrawer({
  open,
  onClose,
  wishlistIds,
  products,
  onToggleWishlist,
  onAddToCart,
}: WishlistDrawerProps) {
  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-96 flex flex-col p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="font-display text-lg">
            Wishlist ({wishlistProducts.length})
          </SheetTitle>
        </SheetHeader>

        {wishlistProducts.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6">
            <Heart className="h-12 w-12 text-muted-foreground/40" />
            <div>
              <p className="font-medium">Your wishlist is empty</p>
              <p className="text-sm text-muted-foreground mt-1">
                Save pieces you love to find them easily later
              </p>
            </div>
          </div>
        ) : (
          <ScrollArea className="flex-1 px-6">
            <div className="py-4 flex flex-col gap-4">
              {wishlistProducts.map((product) => {
                const images = getProductImages(Number(product.id));
                const priceRs = Number(product.price) / 100;
                return (
                  <div key={String(product.id)} className="flex gap-3">
                    <img
                      src={images.img1}
                      alt={product.name}
                      className="w-16 h-20 object-cover rounded-sm flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {product.shortDescription}
                      </p>
                      <p className="text-sm font-bold mt-1">
                        ₹{priceRs.toLocaleString("en-IN")}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-7 flex-1"
                          onClick={() => {
                            onAddToCart(product.id, product.sizes[0] ?? "M");
                          }}
                        >
                          Add to Bag
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs h-7 px-2 text-muted-foreground hover:text-destructive"
                          onClick={() => onToggleWishlist(product.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </SheetContent>
    </Sheet>
  );
}
