import Link from "next/link";
import { Terminal } from "lucide-react";

export default function ComingSoon({ title }: { title?: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center max-w-4xl mx-auto w-full">
      <div className="w-full max-w-2xl mx-auto bg-[#111111] rounded-2xl p-10 text-left relative overflow-hidden">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-xl">
            <Terminal className="w-6 h-6 text-yellow-500" />
          </div>
          <h2 className="text-2xl font-bold">
            {title ? `${title} - ` : ""}Coming Soon
          </h2>
        </div>
        <p className="text-gray-400 font-mono text-sm leading-relaxed mb-6">
          &gt; Status: In Development
          <br />
          &gt; Estimated release: TBD
          <br />
          <br />
          This module is currently being built by our community developers.
          Check back later to see our progress or join the repository to
          contribute!
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#0066ff] font-mono hover:underline"
        >
          <span className="animate-pulse">_</span>
          <span>Return to Console</span>
        </Link>
      </div>
    </div>
  );
}

