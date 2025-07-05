"use client";
import ImageSlider from "@/components/layouts/ImageSlider";
import FeaturedProducts from '@/components/layouts/FeaturedProducts';
import HeroSection from "@/components/layouts/HeroSection";
import AnnouncementBar from "@/components/common/AnnouncementBar";
import AnimatedOnScroll from "@/components/common/AddScrollAnimations";





export default function Home() {
  

  return (
    <>
      <div >
        <HeroSection/>
        <AnnouncementBar/>
        <AnimatedOnScroll>
            <div className="mt-9">
          <FeaturedProducts/>
        </div>
        </AnimatedOnScroll>
        
      </div>
      
    </>
  );
}
