import Link from "next/link";
import AnimatedOnScroll from "@/components/common/AddScrollAnimations";

const CategoryShowcase = () => {
  const categories = [
    {
      id: 1,
      image: "/images/categories/tea.jpg",
      href: "/shop",
    },
    {
      id: 2,
      image: "/images/categories/gramflour.jpg",
      href: "/shop",
    },
    {
      id: 3,
      image: "/images/categories/hing.jpg",
      href: "/shop",
    },
    {
      id: 4,
      image: "/images/categories/tea.jpg",
      href: "/shop",
    },
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
              Discover our authentic collection — from rich teas to fresh flour
              and aromatic spices. Quality you can taste in every pack.
            </p>
          </div>
        </AnimatedOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <AnimatedOnScroll key={category.id}>
              <Link href={category.href} className="group block">
                <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                  <div className="aspect-square bg-gray-200">
                    <img
                      src={category.image}
                      alt="Category image"
                      className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
                </div>
              </Link>
            </AnimatedOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;
