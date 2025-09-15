import { Shield, Truck, Headphones, Award } from 'lucide-react';
import AnimatedOnScroll from '@/components/common/AddScrollAnimations';

const WhyChooseUs = () => {
  const features = [
    {
      icon: Shield,
      title: "Premium Quality",
      description: "Carefully curated products with guaranteed authenticity and superior quality standards."
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Quick and reliable shipping with real-time tracking across all major cities."
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Round-the-clock customer service to assist you with any queries or concerns."
    },
    {
      icon: Award,
      title: "Best Prices",
      description: "Competitive pricing with regular offers and exclusive deals for our customers."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <AnimatedOnScroll>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to providing you with the best shopping experience through our dedication to quality, service, and customer satisfaction.
            </p>
          </div>
        </AnimatedOnScroll>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <AnimatedOnScroll key={index}>
              <div className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#eac90b] text-[#E40000] rounded-full mb-4">
                  <feature.icon size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description} 
                </p>
              </div>
            </AnimatedOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;