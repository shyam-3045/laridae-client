import { Store, HeadphonesIcon, BadgeCheck, Package } from 'lucide-react';
import AnimatedOnScroll from '@/components/common/AddScrollAnimations';

const WhyChooseUs = () => {
  const features = [
    {
      icon: Store,
      title: "Understanding Tea Shop & Bakery",
      description: "Deep expertise in tea and bakery products with personalized recommendations tailored to your preferences."
    },
    {
      icon: HeadphonesIcon,
      title: "Consistent Support & Assistance",
      description: "Dedicated customer service team ready to help you with any questions or concerns at every step."
    },
    {
      icon: BadgeCheck,
      title: "Best Product Quality & Best Pricing",
      description: "Premium quality products sourced from trusted suppliers at competitive prices you can trust."
    },
    {
      icon: Package,
      title: "Fast & Secure Delivery",
      description: "Reliable shipping with careful handling to ensure your items arrive fresh and in perfect condition."
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
              <div className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#eac90b] text-[#E40000] rounded-full mb-4 mx-auto">
                  <feature.icon size={32} strokeWidth={2} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed flex-grow">
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