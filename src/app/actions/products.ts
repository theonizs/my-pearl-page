"use server";

import { mockProducts, Product } from "@/data/products";

export interface ProductsResponse {
  products: Product[];
  nextCursor: number | null;
}

export interface ProductsFilter {
  search?: string;
  maxPrice?: number;
  collections?: string[];
  colors?: string[];
  sortBy?: "price-asc" | "price-desc";
}

export async function getProductsAction(
  cursor: number = 1,
  limit: number = 8,
  filters: ProductsFilter = {}
): Promise<ProductsResponse> {
  // Simulate network delay for realistic loading effect
  await new Promise((resolve) => setTimeout(resolve, 800));

  let filtered = [...mockProducts];

  // 1. Search
  if (filters.search) {
    const query = filters.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.metadata.pearlType.toLowerCase().includes(query)
    );
  }

  // 2. Max Price
  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter((p) => p.price <= filters.maxPrice!);
  }

  // 3. Collections
  if (filters.collections && filters.collections.length > 0) {
    filtered = filtered.filter((p) => filters.collections!.includes(p.category));
  }

  // 4. Colors
  if (filters.colors && filters.colors.length > 0) {
    filtered = filtered.filter((p) =>
      p.colors.some((c) => filters.colors!.includes(c))
    );
  }

  // 5. Sort (Default to Price Low-to-High if not specified)
  const sortOption = filters.sortBy || "price-asc";
  filtered.sort((a, b) => {
    if (sortOption === "price-asc") {
      return a.price - b.price;
    } else {
      return b.price - a.price;
    }
  });

  // Pagination Logic
  const startIndex = (cursor - 1) * limit;
  const endIndex = startIndex + limit;
  const slice = filtered.slice(startIndex, endIndex);
  
  // Determine next cursor (page)
  const nextCursor = endIndex < filtered.length ? cursor + 1 : null;

  return {
    products: slice,
    nextCursor,
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const product = mockProducts.find((p) => p.slug === slug);
  return product || null;
}
