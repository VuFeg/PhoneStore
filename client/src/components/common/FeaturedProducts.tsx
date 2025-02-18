"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchProducts } from "@/services/productsService";
import { Product } from "@/types/products.type";

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    loadProducts();
  }, []);

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-foreground mb-8">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products
            .filter((product) => product.public)
            .map((product) => (
              <div
                key={product.id}
                className="bg-card rounded-lg shadow-sm overflow-hidden"
              >
                <Image
                  src={product.image_urls[0]}
                  alt={product.name}
                  width={500}
                  height={300}
                  className="object-cover"
                />
                <div className="p-4"></div>
                <h3 className="text-lg font-semibold text-foreground">
                  {product.name}
                </h3>
                <p className="text-accent mt-1">
                  Starting from ${product.variants[0]?.price || "N/A"}
                </p>
                <Link
                  href={`/products/${product.id}`}
                  className="mt-4 block bg-primary text-white py-2 text-center rounded-md hover:bg-primary/90 transition-colors duration-200"
                >
                  Add to Cart
                </Link>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
