import { cn } from "@/lib/utils";
import { Poppins, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export default function HeroSection() {
  return (
    <div
      className={
        (cn(poppins.className),
        "w-full h-screen flex flex-col items-center justify-center")
      }
    >
      <div className="flex flex-col w-full items-center justify-center">
        <h1
          className={cn(
            "text-6xl font-semibold max-w-[1000px] text-center",
            jetBrainsMono.className,
          )}
        >
          Linux &amp; Open Source Lovers Community
        </h1>
        <h3
          className={cn(
            jetBrainsMono.className,
            "mt-6 text-xl max-w-[700px] text-center font-light text-secondary-foreground/50",
          )}
        >
          Building the next generation of african open source founders and
          cybersecurity experts.
        </h3>
      </div>
      <div className="mt-10 flex space-x-4">
        <Link
          className={cn(buttonVariants({ variant: "default", size: "lg" }))}
          href={"/join"}
        >
          Join the Community
        </Link>
        <Link
          className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}
          href={"#projects"}
        >
          Learn More
        </Link>
      </div>
    </div>
  );
}
