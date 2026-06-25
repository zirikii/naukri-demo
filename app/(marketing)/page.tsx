import { Hero } from "@/components/marketing/Hero";
import { CompanyLogoBar } from "@/components/marketing/CompanyLogoBar";
import { CategoryGrid } from "@/components/marketing/CategoryGrid";
import { Naukri360Band } from "@/components/marketing/Naukri360Band";
import { Testimonials } from "@/components/marketing/Testimonials";
import { ValueProps } from "@/components/marketing/ValueProps";
import { getCompanies } from "@/lib/data/queries";
import { loadContent } from "@/lib/data/content";

interface HeroContent {
  title: string;
  subtitle: string;
}
interface Naukri360Content {
  title: string;
  cta: string;
}
interface ValuePropsContent {
  items: { title: string; body: string }[];
}
interface TestimonialsContent {
  items: { name: string; role: string; quote: string }[];
}

export default async function HomePage() {
  const [companies, hero, naukri360, valueProps, testimonials] = await Promise.all([
    getCompanies(),
    loadContent<HeroContent>("landing/hero.md"),
    loadContent<Naukri360Content>("landing/naukri360.md"),
    loadContent<ValuePropsContent>("landing/value-props.md"),
    loadContent<TestimonialsContent>("landing/testimonials.md"),
  ]);

  return (
    <>
      <Hero title={hero.data.title} subtitle={hero.data.subtitle} />
      <CompanyLogoBar companies={companies} />
      <ValueProps items={valueProps.data.items} />
      <CategoryGrid />
      <Naukri360Band title={naukri360.data.title} body={naukri360.body} cta={naukri360.data.cta} />
      <Testimonials items={testimonials.data.items} />
    </>
  );
}
