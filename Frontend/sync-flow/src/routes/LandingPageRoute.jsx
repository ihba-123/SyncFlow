import React from "react";
import { Navbar } from "../components/Navbar.jsx";
import Hero from "../pages/HeroPage.jsx";
import { HowItWorks } from "../pages/HowItWorksPage.jsx";
import { Features } from "../pages/FeaturesPage.jsx";
import { Footer } from "../components/Footer.jsx";
import { CTA } from "../pages/CallToAction.jsx";
const LandingPageRoute = () => {
  return (
    <div className="bg-[var(--foreground)]">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
};

export default LandingPageRoute;
