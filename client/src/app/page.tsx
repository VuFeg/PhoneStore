"use client";

import CategoryProduct from "@/components/common/CategoryProduct";
import CustomerReviews from "@/components/common/CustomerReviews";
import FeaturedProducts from "@/components/common/FeaturedProducts";
import Footer from "@/components/common/Footer";
import Slider from "@/components/common/Slider";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Slider />
      <CategoryProduct />
      <FeaturedProducts />
      <CustomerReviews />
      <Footer />
    </div>
  );
};

export default HomePage;
