import Hero from '@/components/home/Hero';
import FeaturedMenu from '@/components/home/FeaturedMenu';
import Testimonials from '@/components/home/Testimonials';
import CTASection from '@/components/home/CTASection';
import ScrollReveal from '@/components/ui/ScrollReveal';

function Divider() {
  return (
    <hr className="border-t border-[var(--border)] mx-4 sm:mx-8" />
  );
}

export default function Home() {
  return (
    <>
      <ScrollReveal><Hero /></ScrollReveal>
      <Divider />
      <ScrollReveal><FeaturedMenu /></ScrollReveal>
      <Divider />
      <ScrollReveal><Testimonials /></ScrollReveal>
      <Divider />
      <ScrollReveal><CTASection /></ScrollReveal>
    </>
  );
}
