import { Star, Quote } from 'lucide-react';
import AnimatedOnScroll from '@/components/common/AddScrollAnimations';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Dhanarajan ",
      role: "Tea Shop Owner",
      rating: 5,
      comment: "Tea shop-la main-ey tea strong-ah irukanum. Inga vaanguna tea powder perfect color and taste tharudhu. Customers ellam 'tea nalla iruku' nu solrangah. Delivery-um correct time-ku vandhurudhu. Super service!",
      avatar: "SJ"
    },
    {
      id: 2,
      name: "Preedeep Kumar",
      role: "Bakery Owner",
      rating: 5,
      comment: "I tried many brands for my bakery, but indha brand tea leaf nalla extract tharudhu. Milk kammiya use pannalum tea nalla thikk-ah iruku. Margin-um business-ku romba set aagudhu. Highly recommended for bulk orders!",
      avatar: "MC"
    },
    {
      id: 3,
      name: "Muhammad  ",
      role: "Reseller/Distributor",
      rating: 5,
      comment: "As a reseller in the Tamil Nadu circuit, I look for brand reliability. The packaging is premium and the shelf life is great. My retailers are specifically asking for this brand because of the 'Hotel-style' taste it provides. Very happy with the partnership.",
      avatar: "ER"
    },
    {
      id: 4,
      name: "Kalaivanan ",
      role: "College Canteen",
      rating: 5,
      comment: "We cater to hundreds of students daily, and consistency is our biggest challenge. This tea brand has been a lifesaver. The aroma is fantastic and the price point is very competitive for institutional buyers. Excellent support from the team.",
      avatar: "ER"
    },
    {
      id: 5,
      name: "Jebakumar",
      role: "Hospital Canteen",
      rating: 5,
      comment: "எங்கள் மருத்துவமனை கேண்டீனுக்கு கடந்த ஆறு மாதங்களாக இவர்களிடம் தான் டீ தூள் வாங்குகிறோம். தரம் எப்போதும் ஒரே சீராக இருக்கிறது. குறிப்பாக, டீ போட்ட பிறகு நீண்ட நேரம் அந்த சுவையும் மணமும் மாறாமல் இருப்பது பெரிய பிளஸ். சரியான விலையில் தரமான தயாரிப்பு!",
      avatar: "ER"
    },
     {
      id: 6,
      name: "RamKumar ",
      role: "Catering Service",
      rating: 5,
      comment: "அந்த நிறமும்  மணமும் பிரமாதமாக இருக்கிறது. மொத்தமாக வாங்கும் போது விலை மிகவும் கட்டுப்படியாகிறது.",
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