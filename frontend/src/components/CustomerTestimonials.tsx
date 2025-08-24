
import React from "react";

interface TestimonialProps {
  initial: string;
  name: string;
  rating: number;
  text: string;
}

const Testimonial = ({ initial, name, rating, text }: TestimonialProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gold-light/20 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center mb-4">
        <div className="h-10 w-10 rounded-full bg-gold-light/20 text-gold-dark flex items-center justify-center font-semibold text-lg">
          {initial}
        </div>
        <div className="ml-3">
          <h3 className="font-medium text-gray-900">{name}</h3>
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 13.164l-4.95 2.6 0.94-5.52-4-3.9 5.52-0.8L10 0.164l2.47 5.02 5.53 0.8-4 3.9 0.95 5.52z"
                  clipRule="evenodd"
                />
              </svg>
            ))}
          </div>
        </div>
      </div>
      <p className="text-gray-600 italic">{text}</p>
    </div>
  );
};

const CustomerTestimonials = () => {
  const testimonials = [
    {
      initial: "S",
      name: "Sarah Johnson",
      rating: 5,
      text: "I received so many compliments on my anniversary ring. The quality is exceptional and the customer service was outstanding."
    },
    {
      initial: "M",
      name: "Michael Chen",
      rating: 5,
      text: "The engagement ring I purchased exceeded my expectations. My fiancé was absolutely speechless when she saw it!"
    },
    {
      initial: "A",
      name: "Anita Patel",
      rating: 5,
      text: "The bracelet I ordered arrived beautifully packaged and was even more stunning in person than in the photos. Will definitely shop here again!"
    }
  ];

  return (
    <section className="py-12 bg-gradient-to-b from-white to-gold-light/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gold-light to-gold-dark">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from our happy customers who have found the perfect piece to celebrate their special moments.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              initial={testimonial.initial}
              name={testimonial.name}
              rating={testimonial.rating}
              text={testimonial.text}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerTestimonials;
