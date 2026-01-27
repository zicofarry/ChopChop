import Hero from '@/components/home/Hero';
import FeaturedMenu from '@/components/home/FeaturedMenu';
import Testimonials from '@/components/home/Testimonials';
import CTASection from '@/components/home/CTASection';

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedMenu />
      <Testimonials />
      <CTASection />
    </>
  );
}
