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
    <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="container mx-auto px-4">
        <AnimatedOnScroll>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're committed to providing you with the best shopping experience through our dedication to quality, service, and customer satisfaction.
            </p>
          </div>
        </AnimatedOnScroll>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <AnimatedOnScroll key={index}>
              <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-amber-100 p-3 md:p-4 rounded-full mb-3 md:mb-4">
                    <feature.icon className="w-6 h-6 md:w-8 md:h-8 text-amber-600" />
                  </div>
                  <h3 className="text-base md:text-xl font-semibold text-gray-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            </AnimatedOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;