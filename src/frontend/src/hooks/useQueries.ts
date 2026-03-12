import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CartItem, Product } from "../backend.d.ts";
import { useActor } from "./useActor";

export function useSeedAndBestsellers() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["bestsellers"],
    queryFn: async () => {
      if (!actor) return [];
      await actor.seedProducts();
      return actor.getBestsellers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["allProducts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useProductsByCategory(category: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["productsByCategory", category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProductsByCategory(category);
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

export function useCart() {
  const { actor, isFetching } = useActor();
  return useQuery<CartItem[]>({
    queryKey: ["cart"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCart();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useWishlist() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint[]>({
    queryKey: ["wishlist"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWishlist();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddToCart() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      productId,
      size,
      quantity,
    }: { productId: bigint; size: string; quantity: bigint }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addToCart(productId, size, quantity);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });
}

export function useRemoveFromCart() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (productId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.removeFromCart(productId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });
}

export function useUpdateCartQty() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      productId,
      newQuantity,
    }: { productId: bigint; newQuantity: bigint }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateCartQty(productId, newQuantity);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });
}

export function useToggleWishlist() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (productId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.toggleWishlist(productId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wishlist"] }),
  });
}
