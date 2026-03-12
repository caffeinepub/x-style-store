import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";

interface NavigationProps {
  cartCount: number;
  wishlistCount: number;
  onCartOpen: () => void;
  onWishlistOpen: () => void;
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
}

const NAV_LINKS = [
  { label: "All Products", value: "all" },
  { label: "New In", value: "New In" },
  { label: "Tops", value: "Tops" },
  { label: "Dresses", value: "Dresses" },
  { label: "Co-ord Sets", value: "Co-ord Sets" },
  { label: "Party Wear", value: "Party Wear" },
  { label: "Sale", value: "Sale" },
];

export function Navigation({
  cartCount,
  wishlistCount,
  onCartOpen,
  onWishlistOpen,
  activeCategory,
  onCategoryChange,
}: NavigationProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <a href="/" className="flex-shrink-0">
          <img
            src="/assets/generated/logo-transparent.dim_200x60.png"
            alt="X-Style Store"
            className="h-10 w-auto object-contain"
          />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          {NAV_LINKS.map((link, i) => (
            <button
              type="button"
              key={link.value}
              data-ocid={`nav.link.${i + 1}`}
              onClick={() => onCategoryChange(link.value)}
              className={`tracking-wide hover:text-foreground/70 transition-colors ${
                activeCategory === link.value
                  ? "border-b-2 border-foreground pb-0.5"
                  : "text-foreground/80"
              } ${
                link.label === "Sale" ? "text-destructive font-semibold" : ""
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right icons */}
        <div className="flex items-center gap-1">
          {searchOpen ? (
            <div className="flex items-center gap-2">
              <Input
                data-ocid="nav.search_input"
                placeholder="Search..."
                className="h-8 w-40 text-sm"
                autoFocus
                onBlur={() => setSearchOpen(false)}
              />
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
          )}

          <Button
            data-ocid="nav.wishlist_button"
            variant="ghost"
            size="icon"
            className="relative"
            onClick={onWishlistOpen}
          >
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-foreground text-background text-[10px] flex items-center justify-center font-medium">
                {wishlistCount}
              </span>
            )}
          </Button>

          <Button
            data-ocid="nav.cart_button"
            variant="ghost"
            size="icon"
            className="relative"
            onClick={onCartOpen}
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-foreground text-background text-[10px] flex items-center justify-center font-medium">
                {cartCount}
              </span>
            )}
          </Button>

          {/* Mobile hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                {mobileOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <div className="py-6 flex flex-col gap-4">
                <img
                  src="/assets/generated/logo-transparent.dim_200x60.png"
                  alt="X-Style Store"
                  className="h-8 w-auto object-contain mb-4"
                />
                {NAV_LINKS.map((link, i) => (
                  <button
                    type="button"
                    key={link.value}
                    data-ocid={`nav.link.${i + 1}`}
                    onClick={() => {
                      onCategoryChange(link.value);
                      setMobileOpen(false);
                    }}
                    className={`text-left text-base font-medium py-1.5 border-b border-border ${
                      activeCategory === link.value
                        ? "text-foreground"
                        : "text-foreground/70"
                    } ${link.label === "Sale" ? "text-destructive" : ""}`}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
