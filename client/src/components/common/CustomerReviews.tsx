import Image from "next/image";
import { FaStar } from "react-icons/fa";

const testimonials = [
  {
    name: "John Doe",
    review: "Excellent service and product quality!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
  },
  {
    name: "Jane Smith",
    review: "Fast delivery and great customer support",
    rating: 4,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
  },
];

export default function CustomerReviews() {
  return (
    <>
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-card p-6 rounded-lg shadow-sm">
              <div className="flex items-center space-x-4 mb-4">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <div className="flex text-yellow-500">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-accent">{testimonial.review}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
