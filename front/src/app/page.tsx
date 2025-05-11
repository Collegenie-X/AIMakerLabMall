import { Suspense } from 'react';
import { getSlides } from "@/services/slidesService";
import HomeContent from "@/components/layout/HomeContent";

export default async function Home() {
  const slides = await getSlides();
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent slides={slides} />
    </Suspense>
  );
}
