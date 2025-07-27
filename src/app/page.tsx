import { Navbar } from "~/components/navbar";
import { Hero } from "~/components/hero";
import { ProblemSolution } from "~/components/problem-solution";
import { Features } from "~/components/features";
import { SocialProof } from "~/components/social-proof";
import { Pricing } from "~/components/pricing";
import { FAQ } from "~/components/faq";
import { FinalCta } from "~/components/final-cta";
import { Footer } from "~/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen">
        <Hero />

        <ProblemSolution />

        <Features />

        <SocialProof />

        <Pricing />

        <FAQ />

        <FinalCta />
      </main>
      
      <Footer />
    </>
  );
}