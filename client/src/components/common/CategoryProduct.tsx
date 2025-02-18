import React, { useEffect } from "react";

const CategoryProduct = () => {
  const categories = [
    { name: "Smartphones", icon: "📱" },
    { name: "Feature Phones", icon: "☎️" },
    { name: "Accessories", icon: "🎧" },
    { name: "Tablets", icon: "📱" },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-card p-6 rounded-lg text-center hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="text-4xl mb-4">{category.icon}</div>
              <h3 className="font-semibold">{category.name}</h3>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default CategoryProduct;
