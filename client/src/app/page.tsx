"use client";

import FeaturedProducts from "@/components/common/FeaturedProducts";
import Footer from "@/components/common/Footer";
import Slider from "@/components/common/Slider";

const HomePage = () => {
  return (
    <>
      <Slider />
      <FeaturedProducts />
      <Footer />
    </>
  );
};

export default HomePage;
