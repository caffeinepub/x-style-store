export interface ProductImages {
  img1: string;
  img2: string;
}

export function getProductImages(id: number): ProductImages {
  const map: Record<number, ProductImages> = {
    1: {
      img1: "/assets/generated/product-coord-set-pink-1.dim_600x800.jpg",
      img2: "/assets/generated/product-coord-set-pink-2.dim_600x800.jpg",
    },
    2: {
      img1: "/assets/generated/product-kurti-blue-1.dim_600x800.jpg",
      img2: "/assets/generated/product-kurti-blue-2.dim_600x800.jpg",
    },
    3: {
      img1: "/assets/generated/product-top-white-satin-1.dim_600x800.jpg",
      img2: "/assets/generated/product-top-white-satin-2.dim_600x800.jpg",
    },
    4: {
      img1: "/assets/generated/product-shirt-fuchsia-1.dim_600x800.jpg",
      img2: "/assets/generated/product-shirt-fuchsia-2.dim_600x800.jpg",
    },
    5: {
      img1: "/assets/generated/product-dress-purple-sequin-1.dim_600x800.jpg",
      img2: "/assets/generated/product-dress-purple-sequin-2.dim_600x800.jpg",
    },
    6: {
      img1: "/assets/generated/product-top-coral-1.dim_600x800.jpg",
      img2: "/assets/generated/product-top-coral-1.dim_600x800.jpg",
    },
    7: {
      img1: "/assets/generated/product-coord-set-navy-1.dim_600x800.jpg",
      img2: "/assets/generated/product-coord-set-navy-2.dim_600x800.jpg",
    },
    8: {
      img1: "/assets/generated/product-top-purple-print-1.dim_600x800.jpg",
      img2: "/assets/generated/product-top-purple-print-1.dim_600x800.jpg",
    },
    9: {
      img1: "/assets/generated/product-shirt-peacock-1.dim_600x800.jpg",
      img2: "/assets/generated/product-shirt-peacock-1.dim_600x800.jpg",
    },
    10: {
      img1: "/assets/generated/product-shirt-red-floral-1.dim_600x800.jpg",
      img2: "/assets/generated/product-shirt-red-floral-1.dim_600x800.jpg",
    },
    11: {
      img1: "/assets/generated/product-top-black-1.dim_600x800.jpg",
      img2: "/assets/generated/product-top-black-1.dim_600x800.jpg",
    },
  };
  return (
    map[id] ?? {
      img1: "/assets/generated/product-coord-set-pink-1.dim_600x800.jpg",
      img2: "/assets/generated/product-coord-set-pink-1.dim_600x800.jpg",
    }
  );
}
