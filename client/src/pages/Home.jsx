import Seo from "../components/ui/Seo";
import Hero from "../components/home/Hero";
import { ToolsStrip, ServicesOverview, FeaturedProjects, Process, WhyTeam, TeamPreview, Testimonials, LatestPosts, CtaBanner } from "../components/home/Sections";

export default function Home() {
  return (
    <>
      <Seo description="A freelance team of designers and developers building websites, mobile apps and brand identities." />
      <Hero />
      <ToolsStrip />
      <ServicesOverview />
      <FeaturedProjects />
      <Process />
      <WhyTeam />
      <TeamPreview />
      <Testimonials />
      <LatestPosts />
      <CtaBanner />
    </>
  );
}
