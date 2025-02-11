"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-foreground mb-8">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <div
              key={product.id}
              className="bg-card rounded-lg shadow-sm overflow-hidden"
            >
              <Image
                src={product.image_url}
                alt={product.name}
                width={500}
                height={300}
                className="object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-foreground">
                  {product.name}
                </h3>
                <p className="text-accent mt-1">
                  Starting from ${product.price || "N/A"}
                </p>
                <Link
                  href={`/products/${product.id}`}
                  className="mt-4 block bg-primary text-white py-2 text-center rounded-md hover:bg-primary/90 transition-colors duration-200"
                >
                  Add to Cart
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
