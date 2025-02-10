"use client";

import FeaturedProducts from "@/components/FeaturedProducts";
import Footer from "@/components/Footer";
import Slider from "@/components/Slider";

const HomePage = () => {
  return (
    <div>
      <Slider />
      <FeaturedProducts />
      <Footer />
    </div>
  );
};

export default HomePage;
