import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { Product } from "./backend.d.ts";
import { CartDrawer } from "./components/CartDrawer";
import { CategoryCircles } from "./components/CategoryCircles";
import { Navigation } from "./components/Navigation";
import { ProductCard } from "./components/ProductCard";
import { ProductSkeleton } from "./components/ProductSkeleton";
import { WishlistDrawer } from "./components/WishlistDrawer";
import {
  useAddToCart,
  useAllProducts,
  useCart,
  useRemoveFromCart,
  useSeedAndBestsellers,
  useToggleWishlist,
  useUpdateCartQty,
  useWishlist,
} from "./hooks/useQueries";

const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6", "sk7", "sk8"];

const queryClient = new QueryClient();

function XStyleStoreApp() {
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Bestsellers");
  const [sortOrder, setSortOrder] = useState("featured");

  const { data: bestsellers = [], isLoading: bsLoading } =
    useSeedAndBestsellers();
  const { data: allProducts = [], isLoading: apLoading } = useAllProducts();
  const { data: cartItems = [] } = useCart();
  const { data: wishlistIds = [] } = useWishlist();

  const addToCartMutation = useAddToCart();
  const removeFromCartMutation = useRemoveFromCart();
  const updateQtyMutation = useUpdateCartQty();
  const toggleWishlistMutation = useToggleWishlist();

  const isLoading = bsLoading || apLoading;

  const displayProducts: Product[] = useMemo(() => {
    let base: Product[];
    if (activeCategory === "Bestsellers") {
      base = bestsellers;
    } else if (activeCategory === "all") {
      base = allProducts;
    } else {
      base = allProducts.filter((p) => p.category === activeCategory);
    }

    const sorted = [...base];
    if (sortOrder === "price-asc")
      sorted.sort((a, b) => Number(a.price) - Number(b.price));
    else if (sortOrder === "price-desc")
      sorted.sort((a, b) => Number(b.price) - Number(a.price));
    else if (sortOrder === "newest")
      sorted.sort((a, b) => Number(b.id) - Number(a.id));

    return sorted;
  }, [activeCategory, bestsellers, allProducts, sortOrder]);

  const cartCount = cartItems.reduce((s, i) => s + Number(i.quantity), 0);

  const handleAddToCart = (productId: bigint, size: string) => {
    const existingItem = cartItems.find((i) => i.productId === productId);
    if (existingItem) {
      updateQtyMutation.mutate({
        productId,
        newQuantity: BigInt(Number(existingItem.quantity) + 1),
      });
    } else {
      addToCartMutation.mutate({ productId, size, quantity: BigInt(1) });
    }
  };

  const handleToggleWishlist = (id: bigint) => {
    const isWishlisted = wishlistIds.includes(id);
    toggleWishlistMutation.mutate(id);
    toast(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  const pageTitle =
    activeCategory === "all"
      ? "All Products"
      : activeCategory === "Bestsellers"
        ? "Bestsellers"
        : activeCategory;

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        cartCount={cartCount}
        wishlistCount={wishlistIds.length}
        onCartOpen={() => setCartOpen(true)}
        onWishlistOpen={() => setWishlistOpen(true)}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <CategoryCircles
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-muted-foreground mb-6">
          <button
            type="button"
            onClick={() => setActiveCategory("Bestsellers")}
            className="hover:text-foreground transition-colors"
          >
            Home
          </button>
          <span className="mx-2">/</span>
          <span className="text-foreground">{pageTitle}</span>
        </nav>

        {/* Hero */}
        <div className="mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-light tracking-tight mb-2">
            {pageTitle}
          </h1>
          {activeCategory === "Bestsellers" && (
            <p className="text-muted-foreground text-sm md:text-base max-w-xl">
              Our most wanted pieces, loved for their forever fashionable looks
              and timeless shapes.
            </p>
          )}
        </div>

        {/* Sort bar */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
          <span className="text-sm text-muted-foreground">
            {isLoading ? "Loading..." : `${displayProducts.length} products`}
          </span>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger data-ocid="sort.select" className="w-44 h-8 text-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="newest">New Arrivals</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          {isLoading ? (
            SKELETON_KEYS.map((key) => <ProductSkeleton key={key} />)
          ) : displayProducts.length === 0 ? (
            <div className="col-span-full py-16 text-center">
              <p className="text-muted-foreground">
                No products found in this category.
              </p>
            </div>
          ) : (
            displayProducts.map((product, i) => (
              <ProductCard
                key={String(product.id)}
                product={product}
                index={i + 1}
                isWishlisted={wishlistIds.includes(product.id)}
                onToggleWishlist={handleToggleWishlist}
                onAddToCart={handleAddToCart}
              />
            ))
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <img
              src="/assets/generated/logo-transparent.dim_200x60.png"
              alt="X-Style Store"
              className="h-8 w-auto object-contain"
            />
            <p>Premium women's fashion — curated with care.</p>
          </div>
          <p>
            © {new Date().getFullYear()}. Built with ♥ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              className="underline hover:text-foreground transition-colors"
              target="_blank"
              rel="noreferrer"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        products={[...bestsellers, ...allProducts]}
        onRemove={(id) => removeFromCartMutation.mutate(id)}
        onUpdateQty={(id, qty) =>
          updateQtyMutation.mutate({ productId: id, newQuantity: qty })
        }
      />

      <WishlistDrawer
        open={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        wishlistIds={wishlistIds}
        products={[...bestsellers, ...allProducts]}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
      />

      <Toaster position="bottom-right" />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <XStyleStoreApp />
    </QueryClientProvider>
  );
}
