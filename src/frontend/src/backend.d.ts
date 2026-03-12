import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CartItem {
    productId: bigint;
    quantity: bigint;
    selectedSize: string;
}
export interface UserProfile {
    name: string;
    email?: string;
    address?: string;
    phone?: string;
}
export interface Product {
    id: bigint;
    mrp: bigint;
    name: string;
    imageCount: bigint;
    discountPercent: bigint;
    sizes: Array<string>;
    shortDescription: string;
    category: string;
    badge?: string;
    rating: number;
    price: bigint;
    reviewCount: bigint;
    longDescription: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addToCart(productId: bigint, size: string, quantity: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearCart(): Promise<void>;
    getAllProducts(): Promise<Array<Product>>;
    getBestsellers(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Array<CartItem>>;
    getProductById(productId: bigint): Promise<Product>;
    getProductsByCategory(category: string): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWishlist(): Promise<Array<bigint>>;
    isCallerAdmin(): Promise<boolean>;
    isWishlisted(productId: bigint): Promise<boolean>;
    removeFromCart(productId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    seedProducts(): Promise<void>;
    toggleWishlist(productId: bigint): Promise<void>;
    updateCartQty(productId: bigint, newQuantity: bigint): Promise<void>;
}
