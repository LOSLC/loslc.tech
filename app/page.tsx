import Link from "next/link";
import { Terminal } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-background bg-grid-pattern flex flex-col font-sans text-foreground">
      <header className="w-full max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3 w-1/4">
          <div>
            <Image
              src="/logo.png"
              alt="LOSL-C Logo"
              width={32}
              height={32}
              className="rounded"
            />
          </div>
          <span className="font-bold text-xl tracking-tight">LOSL-C</span>
        </div>

        <nav className="hidden md:flex items-center justify-center gap-8 text-sm text-muted-foreground w-2/4">
          <Link
            href="/projects"
            className="hover:text-secondary-foreground transition-colors"
          >
            Projects
          </Link>
          <Link
            href="/events"
            className="hover:text-secondary-foreground transition-colors"
          >
            Events
          </Link>
          <Link
            href="/blog"
            className="hover:text-secondary-foreground transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/about"
            className="hover:text-secondary-foreground transition-colors"
          >
            About
          </Link>
        </nav>

        <div className="w-1/4 flex justify-end">
          <a
            href="https://discord.gg/KZfTn3nQtz"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary hover:bg-primary/80 text-primary-foreground px-6 py-2 rounded-full text-sm font-medium transition-colors inline-flex items-center"
          >
            Join
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center max-w-4xl mx-auto w-full">
        {/* Hero Section */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-8">
          Linux & Open Source Lovers
          <br />
          Community.
        </h1>

        <p className="text-muted-foreground font-mono text-sm md:text-base max-w-2xl mx-auto mb-12 leading-relaxed">
          Empowering the next generation of builders through open
          <br className="hidden md:block" /> collaboration.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-32">
          <a
            href="https://discord.gg/KZfTn3nQtz"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary hover:bg-primary/80 text-primary-foreground px-8 py-3 rounded-full font-medium transition-colors w-full sm:w-auto inline-flex items-center justify-center"
          >
            Join the Community
          </a>
        </div>

        <div className="w-full max-w-2xl mx-auto bg-[#111111] rounded-2xl p-10 text-left relative overflow-hidden">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl">
              <Terminal className="w-6 h-6 text-[#0066ff]" />
            </div>
            <h2 className="text-2xl font-bold">System Maintenance</h2>
          </div>
          <p className="text-gray-400 font-mono text-sm leading-relaxed mb-6">
            &gt; Status: Offline for upgrades
            <br />
            &gt; Estimated completion: TBD
            <br />
            <br />
            We are currently performing scheduled maintenance on our community
            platform. Events, project directories, and member profiles will be
            back online shortly. Thank you for your patience.
          </p>
          <div className="flex items-center gap-2 text-sm text-[#0066ff] font-mono">
            <span className="animate-pulse">_</span>
            <span>System updating...</span>
          </div>
        </div>
      </main>

      <footer className="w-full max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground border-t border-gray-800/50 mt-auto">
        <div>
          &copy; {new Date().getFullYear()} LOSL-C. All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          <a
            href="mailto:community@loslc.tech"
            className="hover:text-primary transition-colors"
          >
            community@loslc.tech
          </a>
          <a
            href="https://github.com/LOSLC"
            className="hover:text-primary transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://x.com/loslcommunity"
            className="hover:text-primary transition-colors"
          >
            Twitter / X
          </a>
          <a
            href="https://discord.gg/KZfTn3nQtz"
            className="hover:text-primary transition-colors"
          >
            Discord
          </a>
        </div>
      </footer>
    </div>
  );
}
