import Link from "next/link";
import { Terminal } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background bg-grid-pattern flex flex-col font-sans text-foreground items-center justify-center p-6 text-center">
      <div className="w-full max-w-2xl bg-[#111111] border border-gray-800 rounded-2xl p-10 text-left relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-400" />
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-red-500/10 rounded-xl">
            <Terminal className="w-6 h-6 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold">404: Page Not Found</h2>
        </div>
        <p className="text-gray-400 font-mono text-sm leading-relaxed mb-6">
          &gt; Status: 404 Not Found
          <br />
          &gt; Route: Unknown
          <br />
          <br />
          The page you are looking for does not exist or has been moved. 
          Please check the URL or return to the main console.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#0066ff] font-mono hover:underline"
        >
          <span className="animate-pulse">_</span>
          <span>Return Home</span>
        </Link>
      </div>

      <footer className="w-full max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground fixed bottom-0">
        <div>
          &copy; {new Date().getFullYear()} LOSL-C. All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          <a href="mailto:community@loslc.tech" className="hover:text-primary transition-colors">
            community@loslc.tech
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            GitHub
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Twitter / X
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Discord
          </a>
        </div>
      </footer>
    </div>
  );
}