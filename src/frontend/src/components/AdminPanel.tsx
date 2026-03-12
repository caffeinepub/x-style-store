import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import {
  Instagram,
  Loader2,
  LogOut,
  Mail,
  MessageCircle,
  Package,
  Pencil,
  Plus,
  Settings,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend";
import { useActor } from "../hooks/useActor";
import { useAllProducts, useSocialLinks } from "../hooks/useQueries";

interface SocialLinks {
  email?: string;
  whatsapp?: string;
  instagram?: string;
}

const ADMIN_AUTH_KEY = "xstyle_admin_auth";
const ADMIN_PASSWORD = "admin123";

function LoginGate({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [shaking, setShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      localStorage.setItem(ADMIN_AUTH_KEY, "1");
      onLogin();
    } else {
      setError("Incorrect password");
      setShaking(true);
      setTimeout(() => setShaking(false), 400);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img
            src="/assets/generated/logo-transparent.dim_200x60.png"
            alt="X-Style Store"
            className="h-10 w-auto object-contain mx-auto mb-4"
          />
          <h1 className="font-display text-2xl font-light">Admin Panel</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Enter your password to continue
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-pw">Password</Label>
            <Input
              id="admin-pw"
              data-ocid="admin.input"
              type="password"
              placeholder="••••••••"
              value={pw}
              onChange={(e) => {
                setPw(e.target.value);
                setError("");
              }}
              className={shaking ? "shake" : ""}
              autoFocus
            />
            {error && (
              <p
                data-ocid="admin.error_state"
                className="text-destructive text-xs"
              >
                {error}
              </p>
            )}
          </div>
          <Button
            data-ocid="admin.submit_button"
            type="submit"
            className="w-full"
          >
            Login
          </Button>
        </form>
        <p className="text-center text-xs text-muted-foreground mt-6">
          <a href="#/" className="hover:text-foreground transition-colors">
            ← Back to Store
          </a>
        </p>
      </div>
    </div>
  );
}

const emptyProduct = (): Omit<Product, "id"> => ({
  name: "",
  shortDescription: "",
  longDescription: "",
  category: "",
  sizes: [],
  price: BigInt(0),
  mrp: BigInt(0),
  discountPercent: BigInt(0),
  rating: 4.5,
  reviewCount: BigInt(0),
  badge: "",
  imageCount: BigInt(2),
});

function ProductForm({
  initial,
  onSave,
  onCancel,
  isSaving,
}: {
  initial?: Product;
  onSave: (p: Product) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState<Product>(
    initial ?? { id: BigInt(0), ...emptyProduct() },
  );
  const [sizesStr, setSizesStr] = useState(initial?.sizes.join(", ") ?? "");

  const set = (k: keyof Product, v: string | number | bigint | string[]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sizes = sizesStr
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    onSave({ ...form, sizes });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 space-y-1">
          <Label>Product Name *</Label>
          <Input
            data-ocid="product.name.input"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            required
          />
        </div>
        <div className="col-span-2 space-y-1">
          <Label>Short Description *</Label>
          <Input
            data-ocid="product.short_desc.input"
            value={form.shortDescription}
            onChange={(e) => set("shortDescription", e.target.value)}
            required
          />
        </div>
        <div className="col-span-2 space-y-1">
          <Label>Long Description</Label>
          <Textarea
            data-ocid="product.long_desc.textarea"
            value={form.longDescription}
            onChange={(e) => set("longDescription", e.target.value)}
            rows={3}
          />
        </div>
        <div className="space-y-1">
          <Label>Category *</Label>
          <Input
            data-ocid="product.category.input"
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            required
          />
        </div>
        <div className="space-y-1">
          <Label>Badge (optional)</Label>
          <Input
            data-ocid="product.badge.input"
            value={form.badge ?? ""}
            onChange={(e) => set("badge", e.target.value)}
            placeholder="e.g. New, Hot"
          />
        </div>
        <div className="space-y-1">
          <Label>Price (paise) *</Label>
          <Input
            data-ocid="product.price.input"
            type="number"
            value={String(form.price)}
            onChange={(e) => set("price", BigInt(e.target.value || 0))}
            required
          />
        </div>
        <div className="space-y-1">
          <Label>MRP (paise) *</Label>
          <Input
            data-ocid="product.mrp.input"
            type="number"
            value={String(form.mrp)}
            onChange={(e) => set("mrp", BigInt(e.target.value || 0))}
            required
          />
        </div>
        <div className="space-y-1">
          <Label>Discount %</Label>
          <Input
            data-ocid="product.discount.input"
            type="number"
            value={String(form.discountPercent)}
            onChange={(e) =>
              set("discountPercent", BigInt(e.target.value || 0))
            }
          />
        </div>
        <div className="space-y-1">
          <Label>Rating (0-5)</Label>
          <Input
            data-ocid="product.rating.input"
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={form.rating}
            onChange={(e) => set("rating", Number(e.target.value))}
          />
        </div>
        <div className="space-y-1">
          <Label>Review Count</Label>
          <Input
            data-ocid="product.review_count.input"
            type="number"
            value={String(form.reviewCount)}
            onChange={(e) => set("reviewCount", BigInt(e.target.value || 0))}
          />
        </div>
        <div className="space-y-1">
          <Label>Image Count</Label>
          <Input
            data-ocid="product.image_count.input"
            type="number"
            value={String(form.imageCount)}
            onChange={(e) => set("imageCount", BigInt(e.target.value || 1))}
          />
        </div>
        <div className="col-span-2 space-y-1">
          <Label>Sizes (comma separated)</Label>
          <Input
            data-ocid="product.sizes.input"
            value={sizesStr}
            onChange={(e) => setSizesStr(e.target.value)}
            placeholder="XS, S, M, L, XL"
          />
        </div>
      </div>
      <div className="flex gap-2 justify-end pt-2">
        <Button
          data-ocid="product.cancel_button"
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          data-ocid="product.save_button"
          type="submit"
          disabled={isSaving}
        >
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initial ? "Update Product" : "Add Product"}
        </Button>
      </div>
    </form>
  );
}

function ProductsTab() {
  const { data: products = [], isLoading } = useAllProducts();
  const { actor } = useActor();
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | undefined>();
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<bigint | null>(null);

  const handleSave = async (product: Product) => {
    if (!actor) return;
    setIsSaving(true);
    try {
      const a = actor as any;
      if (editProduct === undefined) {
        await a.addProduct({ ...product, id: BigInt(0) });
        toast.success("Product added!");
      } else {
        await a.updateProduct(product);
        toast.success("Product updated!");
      }
      qc.invalidateQueries({ queryKey: ["allProducts"] });
      qc.invalidateQueries({ queryKey: ["bestsellers"] });
      setDialogOpen(false);
    } catch {
      toast.error("Backend admin role required. Please contact support.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: bigint) => {
    if (!actor) return;
    try {
      await (actor as any).deleteProduct(id);
      toast.success("Product deleted.");
      qc.invalidateQueries({ queryKey: ["allProducts"] });
      qc.invalidateQueries({ queryKey: ["bestsellers"] });
    } catch {
      toast.error("Backend admin role required. Please contact support.");
    } finally {
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {products.length} products
        </p>
        <Button
          data-ocid="product.open_modal_button"
          size="sm"
          onClick={() => {
            setEditProduct(undefined);
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-1" /> Add Product
        </Button>
      </div>

      {isLoading ? (
        <div
          data-ocid="product.loading_state"
          className="py-8 text-center text-muted-foreground text-sm"
        >
          Loading products...
        </div>
      ) : products.length === 0 ? (
        <div
          data-ocid="product.empty_state"
          className="py-8 text-center text-muted-foreground text-sm"
        >
          No products yet. Add your first product!
        </div>
      ) : (
        <div className="space-y-2">
          {products.map((p, i) => (
            <div
              key={String(p.id)}
              data-ocid={`product.item.${i + 1}`}
              className="flex items-center gap-3 p-3 rounded border border-border bg-card"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm truncate">{p.name}</p>
                  {p.badge && (
                    <Badge variant="secondary" className="text-xs shrink-0">
                      {p.badge}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {p.category} · ₹{(Number(p.price) / 100).toFixed(0)}
                </p>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button
                  data-ocid={`product.edit_button.${i + 1}`}
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => {
                    setEditProduct(p);
                    setDialogOpen(true);
                  }}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  data-ocid={`product.delete_button.${i + 1}`}
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => setDeleteConfirmId(p.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          data-ocid="product.dialog"
          className="max-w-lg max-h-[90vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle>
              {editProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            initial={editProduct}
            onSave={handleSave}
            onCancel={() => setDialogOpen(false)}
            isSaving={isSaving}
          />
        </DialogContent>
      </Dialog>

      {/* Delete confirm Dialog */}
      <Dialog
        open={deleteConfirmId !== null}
        onOpenChange={(o) => !o && setDeleteConfirmId(null)}
      >
        <DialogContent data-ocid="product.delete.dialog" className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Product?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This action cannot be undone.
          </p>
          <DialogFooter className="gap-2">
            <Button
              data-ocid="product.delete.cancel_button"
              variant="outline"
              onClick={() => setDeleteConfirmId(null)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="product.delete.confirm_button"
              variant="destructive"
              onClick={() =>
                deleteConfirmId !== null && handleDelete(deleteConfirmId)
              }
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SocialLinksTab() {
  const { data: existing } = useSocialLinks();
  const { actor } = useActor();
  const qc = useQueryClient();
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (existing) {
      setEmail(existing.email ?? "");
      setWhatsapp(existing.whatsapp ?? "");
      setInstagram(existing.instagram ?? "");
    }
  }, [existing]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) return;
    setIsSaving(true);
    try {
      const links: SocialLinks = {
        email: email.trim() || undefined,
        whatsapp: whatsapp.trim() || undefined,
        instagram: instagram.trim() || undefined,
      };
      await (actor as any).saveSocialLinks(links);
      qc.invalidateQueries({ queryKey: ["socialLinks"] });
      toast.success("Social links saved!");
    } catch {
      toast.error("Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-5 max-w-md">
      <div className="space-y-1">
        <Label htmlFor="social-email" className="flex items-center gap-2">
          <Mail className="h-4 w-4" /> Email Address
        </Label>
        <Input
          id="social-email"
          data-ocid="social.email.input"
          type="email"
          placeholder="yourstore@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="social-wa" className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4" /> WhatsApp Number
        </Label>
        <Input
          id="social-wa"
          data-ocid="social.whatsapp.input"
          type="tel"
          placeholder="+91 98765 43210"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Include country code (e.g. +91)
        </p>
      </div>
      <div className="space-y-1">
        <Label htmlFor="social-ig" className="flex items-center gap-2">
          <Instagram className="h-4 w-4" /> Instagram Handle
        </Label>
        <Input
          id="social-ig"
          data-ocid="social.instagram.input"
          placeholder="@xstylestore"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Without the @ is fine too
        </p>
      </div>
      <Button data-ocid="social.save_button" type="submit" disabled={isSaving}>
        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Social Links
      </Button>
    </form>
  );
}

export function AdminPanel() {
  const [authed, setAuthed] = useState(
    () => localStorage.getItem(ADMIN_AUTH_KEY) === "1",
  );

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_AUTH_KEY);
    setAuthed(false);
  };

  if (!authed) {
    return <LoginGate onLogin={() => setAuthed(true)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 bg-background z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <span className="font-display text-lg">Admin Panel</span>
            <span className="text-muted-foreground text-sm">
              · X-Style Store
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              data-ocid="admin.store_link"
              href="#/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to Store
            </a>
            <Button
              data-ocid="admin.logout_button"
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-1.5"
            >
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Tabs defaultValue="products">
          <TabsList data-ocid="admin.tab" className="mb-6">
            <TabsTrigger
              data-ocid="admin.products.tab"
              value="products"
              className="gap-1.5"
            >
              <Package className="h-4 w-4" /> Products
            </TabsTrigger>
            <TabsTrigger
              data-ocid="admin.social.tab"
              value="social"
              className="gap-1.5"
            >
              <Instagram className="h-4 w-4" /> Social Links
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <div className="mb-4">
              <h2 className="font-display text-xl">Manage Products</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Add, edit, or remove products from your store.
              </p>
            </div>
            <ProductsTab />
          </TabsContent>

          <TabsContent value="social">
            <div className="mb-6">
              <h2 className="font-display text-xl">Social Links</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Set your contact details — they'll appear in the store footer.
              </p>
            </div>
            <SocialLinksTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
