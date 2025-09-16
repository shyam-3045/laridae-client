import { Star, Quote } from 'lucide-react';
import AnimatedOnScroll from '@/components/common/AddScrollAnimations';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Verified Customer",
      rating: 5,
      comment: "Amazing quality products and super fast delivery! The customer service team was incredibly helpful when I had questions about my order.",
      avatar: "SJ"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Regular Customer",
      rating: 5,
      comment: "I've been shopping here for over a year now. The variety of products and competitive prices keep me coming back. Highly recommended!",
      avatar: "MC"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Happy Customer",
      rating: 5,
      comment: "The best online shopping experience I've had. Products arrived exactly as described and the packaging was excellent. Will definitely shop again!",
      avatar: "ER"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <AnimatedOnScroll>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our satisfied customers have to say about their shopping experience.
            </p>
          </div>
        </AnimatedOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <AnimatedOnScroll key={testimonial.id}>
              <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-6 relative">
                <Quote size={24} className="text-[#eac90b] mb-4" />
                
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  "{testimonial.comment}"
                </p>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#E40000] rounded-full flex items-center justify-center text-white font-semibold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="text-gray-900 font-semibold">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-500 text-sm">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;