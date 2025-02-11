"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3",
    title: "iPhone 14 Pro",
    description: "Experience the power of innovation",
  },
  {
    image:
      "https://images.unsplash.com/photo-1678911820864-e2c567c655d7?ixlib=rb-4.0.3",
    title: "iPhone 13 Pro",
    description: "Incredible camera system",
  },
  {
    image:
      "https://images.unsplash.com/photo-1697214803195-716e025fcaf5?ixlib=rb-4.0.3",
    title: "iPhone SE",
    description: "Powerful and affordable",
  },
];

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[500px] w-full overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            currentSlide === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-lg">
                <h1 className="text-4xl font-bold text-white mb-4">
                  {slide.title}
                </h1>
                <p className="text-xl text-white/90 mb-6">
                  {slide.description}
                </p>
                <Link
                  href="/products"
                  className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors duration-200"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors duration-200 ${
              currentSlide === index ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
