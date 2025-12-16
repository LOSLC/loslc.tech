import AboutSection from "@/components/sections/about";
import HeroSection from "@/components/sections/hero";
import Navbar from "@/components/sections/navbar";

export default function Home() {
  return (
    <div>
      <div className="min-h-screen w-full relative">
        <div
          className="absolute inset-0 z-0 border-b border-b-border"
          style={{
            background: "var(--background)",
            backgroundImage: `
     linear-gradient(to right, rgba(71,85,105,0.15) 1px, transparent 1px),
     linear-gradient(to bottom, rgba(71,85,105,0.15) 1px, transparent 1px),
     radial-gradient(circle at 50% 60%, rgba(27, 137, 242, 0.15) 0%, rgba(168,85,247,0.05) 40%, transparent 70%)
   `,
            backgroundSize: "40px 40px, 40px 40px, 100% 100%",
          }}
        />
        <div className="relative z-10 flex flex-col">
          <HeroSection />
        </div>
      </div>
      <AboutSection />
    </div>
  );
}
