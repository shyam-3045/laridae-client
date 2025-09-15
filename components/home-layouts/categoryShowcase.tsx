import Link from 'next/link';
import AnimatedOnScroll from '@/components/common/AddScrollAnimations';

const CategoryShowcase = () => {
  const categories = [
    {
      id: 1,
      name: "Premium Tea",
      image: "/images/categories/tea.jpg", 
      href: "/shop",
      itemCount: "20+ Varieties"
    },
    {
      id: 2,
      name: "Gram Flour",
      image: "/images/categories/gramflour.jpg", 
      href: "/shop",
      itemCount: "Freshly Milled"
    },
    {
      id: 3,
      name: "Asafoetida",
      image: "/images/categories/hing.jpg", 
      href: "/shop",
      itemCount: "Pure & Authentic"
    },
    {
      id: 4,
      name: "Combo Packs",
      image: "", // no image since it's "Coming Soon"
      href: "#", // disable link for now
      itemCount: "Coming Soon"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <AnimatedOnScroll>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our authentic collection — from rich teas to fresh flour and aromatic spices. 
              Quality you can taste in every pack.
            </p>
          </div>
        </AnimatedOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <AnimatedOnScroll key={category.id}>
              <div
                className={`group block ${
                  category.itemCount === "Coming Soon" ? "cursor-not-allowed" : ""
                }`}
              >
                <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                  <div className="aspect-square relative bg-gray-200">
                    {category.itemCount === "Coming Soon" ? (
                      // Blurry background for Coming Soon
                      <div className="w-full h-full bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 blur-sm flex items-center justify-center">
                        <span className="text-white font-bold text-xl bg-black bg-opacity-50 px-3 py-1 rounded">
                          Coming Soon
                        </span>
                      </div>
                    ) : (
                      // Normal placeholder gradient for other categories
                      <div className="w-full h-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center">
                        <span className="text-white font-bold text-2xl">
                          {category.name[0]}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300 flex flex-col justify-end p-6">
                    <h3 className="text-white text-xl font-semibold mb-1">
                      {category.name}
                    </h3>
                    <p className="text-gray-200 text-sm">
                      {category.itemCount}
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

export default CategoryShowcase;
