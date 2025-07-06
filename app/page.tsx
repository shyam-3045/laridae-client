import HeroSection from "@/components/layouts/HeroSection";
import AnnouncementBar from "@/components/common/AnnouncementBar";
import AnimatedOnScroll from "@/components/common/AddScrollAnimations";
import FeaturedProducts from "../components/layouts/FeaturedProducts";
import getQueryClient from "./utils/queryClient";
import { getAllProducts } from "@/hooks/services/getAllProducts";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

export const revalidate=300;

export default async function Home() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["Products"],
    queryFn: getAllProducts,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <div>
      <HeroSection />
      <AnnouncementBar />
      <AnimatedOnScroll>
        <div className="mt-9">
          <HydrationBoundary state={dehydratedState}>
            <FeaturedProducts />
          </HydrationBoundary>
        </div>
      </AnimatedOnScroll>
    </div>
  );
}
