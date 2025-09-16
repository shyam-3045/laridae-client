import { Users, ShoppingBag, Award, Globe } from 'lucide-react';
import AnimatedOnScroll from '@/components/common/AddScrollAnimations';

const StatsSection = () => {
  const stats = [
    {
      icon: Users,
      number: "50+",
      label: "Happy Customers",
      description: "Satisfied customers worldwide"
    },
    {
      icon: ShoppingBag,
      number: "100+",
      label: "Orders Delivered",
      description: "Successfully completed orders"
    },
    {
      icon: Award,
      number: "4.9/5",
      label: "Customer Rating",
      description: "Based on customer reviews"
    },
    {
      icon: Globe,
      number: "25+",
      label: "Cities Covered",
      description: "Delivery locations available"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <AnimatedOnScroll>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Growing Community
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust us for their shopping needs.
            </p>
          </div>
        </AnimatedOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <AnimatedOnScroll key={index}>
              <div className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#eac90b] text-[#E40000] rounded-full mb-4">
                  <stat.icon size={32} />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </h3>
                <h4 className="text-xl font-semibold text-gray-700 mb-2">
                  {stat.label}
                </h4>
                <p className="text-gray-600">
                  {stat.description}
                </p>
              </div>
            </AnimatedOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;