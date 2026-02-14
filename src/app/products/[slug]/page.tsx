import { notFound } from "next/navigation";
import { getProductBySlug } from "@/app/actions/products";
import ProductView from "@/components/luxury/ProductView";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | NJ PEARL",
    };
  }

  return {
    title: `${product.name} | NJ PEARL`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductView product={product} />;
}
