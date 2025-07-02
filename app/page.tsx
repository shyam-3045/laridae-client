"use client";
import ImageSlider from "@/components/layouts/ImageSlider";
import FeaturedProducts from '@/components/layouts/FeaturedProducts';



export default function Home() {
  return (
    <>
      <div className="m-5">
        <ImageSlider></ImageSlider>
      </div>
      <div>
        <FeaturedProducts/>
      </div>
    </>
  );
}
