import { Button } from "@/components/ui/button";
import { Heart, Star } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend.d.ts";
import { getProductImages } from "../utils/productImages";

const STAR_KEYS = ["s1", "s2", "s3", "s4", "s5"];

interface ProductCardProps {
  product: Product;
  index: number;
  isWishlisted: boolean;
  onToggleWishlist: (id: bigint) => void;
  onAddToCart: (productId: bigint, size: string) => void;
}

export function ProductCard({
  product,
  index,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
}: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState("");
  const [shaking, setShaking] = useState(false);
  const sizeRef = useRef<HTMLDivElement>(null);
  const images = getProductImages(Number(product.id));

  const priceRs = Number(product.price) / 100;
  const mrpRs = Number(product.mrp) / 100;
  const discount = Number(product.discountPercent);

  const formatPrice = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  const handleAddToBag = () => {
    if (!selectedSize) {
      setShaking(true);
      setTimeout(() => setShaking(false), 400);
      toast.error("Please select a size first");
      sizeRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      return;
    }
    onAddToCart(product.id, selectedSize);
    toast.success(`${product.name} added to bag`);
  };

  const stars = Math.round(product.rating);

  return (
    <div data-ocid={`product.item.${index}`} className="group flex flex-col">
      {/* Image container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary product-image-hover mb-3">
        <img
          src={images.img1}
          alt={product.name}
          className="img-primary absolute inset-0 w-full h-full object-cover"
        />
        <img
          src={images.img2}
          alt={product.name}
          className="img-secondary w-full h-full object-cover"
        />

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-2 left-2 bg-foreground text-background text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-sm">
            {product.badge}
          </span>
        )}

        {/* Wishlist */}
        <button
          type="button"
          data-ocid={`product.wishlist_button.${index}`}
          onClick={() => onToggleWishlist(product.id)}
          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isWishlisted ? "fill-red-500 text-red-500" : "text-foreground/60"
            }`}
          />
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1.5 flex-1">
        {/* Stars */}
        <div className="flex items-center gap-1">
          {STAR_KEYS.map((key, j) => (
            <Star
              key={key}
              className={`h-3 w-3 ${
                j < stars
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground"
              }`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-0.5">
            {Number(product.reviewCount)}
          </span>
        </div>

        <div>
          <h3 className="font-semibold text-sm leading-tight">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {product.shortDescription}
          </p>
        </div>

        {/* Prices */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-sm">{formatPrice(priceRs)}</span>
          {mrpRs > priceRs && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(mrpRs)}
            </span>
          )}
          {discount > 0 && (
            <span className="text-[10px] font-semibold bg-destructive/10 text-destructive px-1.5 py-0.5 rounded-sm">
              -{discount}%
            </span>
          )}
        </div>

        {/* Sizes */}
        <div
          ref={sizeRef}
          className={`flex flex-wrap gap-1 ${shaking ? "shake" : ""}`}
        >
          {product.sizes.map((size) => (
            <button
              type="button"
              key={size}
              onClick={() => setSelectedSize(size === selectedSize ? "" : size)}
              className={`text-[10px] px-2 py-0.5 border rounded-sm transition-colors ${
                selectedSize === size
                  ? "bg-foreground text-background border-foreground"
                  : "border-border text-foreground/70 hover:border-foreground/50"
              }`}
            >
              {size}
            </button>
          ))}
        </div>

        {/* Add to bag */}
        <Button
          data-ocid={`product.button.${index}`}
          variant="outline"
          size="sm"
          className="w-full text-xs mt-auto tracking-wide"
          onClick={handleAddToBag}
        >
          Add To Bag
        </Button>
      </div>
    </div>
  );
}
