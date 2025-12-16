"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { JetBrains_Mono } from "next/font/google";
import Image from "next/image";
import { FastAverageColor } from "fast-average-color";

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

export default function AboutSection() {
  const pillars = [
    {
      title: "Open Source",
      description:
        "Fostering a culture of transparency, collaboration, and shared knowledge through open-source projects and initiatives.",
      imageSrc: "/illustrations/pillars/oss.png",
      imageDesc:
        "Builds together. Shares freely. Creates structure from small contributions.",
    },
    {
      title: "Collaborative Learning",
      description:
        "Encouraging continuous learning and skill development through workshops, tutorials, and community-driven projects.",
      imageSrc: "/illustrations/pillars/collab.png",
      imageDesc:
        "A place to gather. Deep roots of shared wisdom. Strength through community.",
    },
    {
      title: "Cybersecurity",
      description:
        "Promoting best practices in cybersecurity to ensure safe and secure development and usage of open-source software.",
      imageSrc: "/illustrations/pillars/sec.png",
      imageDesc:
        "Fearless protector. Hard to breach. Smart, resilient, always alert.",
    },
  ];

  const [activePillar, setActivePillar] = useState(pillars[0]);
  const [dominantColor, setDominantColor] = useState<string | null>(null);

  useEffect(() => {
    const fac = new FastAverageColor();
    fac
      .getColorAsync(activePillar.imageSrc)
      .then((color) => {
        setDominantColor(color.hex);
      })
      .catch((e) => {
        console.error(e);
        setDominantColor(null);
      });
  }, [activePillar]);

  return (
    <div className="flex flex-col w-full items-center">
      <div className="max-w-6xl w-full px-4 py-16">
        <h2 className={cn("text-3xl font-bold mb-4", jetBrainsMono.className)}>
          What is LOSL-C?
        </h2>
        <span
          className={cn(
            "block text-sm leading-7 font-light mb-12 max-w-4xl",
            jetBrainsMono.className,
          )}
        >
          LOSL-C for Linux & Open Source Lovers Community is a collaborative
          space dedicated to empowering developers, creators, and enthusiasts
          through open knowledge, practical projects, and a culture of
          continuous learning.
        </span>

        <div className="flex flex-col gap-8">
          {/* Pillar Titles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className={cn(
                  "p-4 border rounded-lg cursor-pointer transition-all duration-300",
                  activePillar.title === pillar.title
                    ? "shadow-md"
                    : "hover:bg-muted/50 border-border",
                )}
                style={
                  activePillar.title === pillar.title && dominantColor
                    ? {
                        borderColor: dominantColor,
                        background: `linear-gradient(135deg, ${dominantColor}20 0%, transparent 100%)`,
                      }
                    : activePillar.title === pillar.title
                      ? {
                          borderColor: "var(--primary)",
                          backgroundColor: "rgba(var(--primary), 0.1)",
                        }
                      : {}
                }
                onClick={() => setActivePillar(pillar)}
                onMouseEnter={() => setActivePillar(pillar)}
              >
                <h3
                  className={cn(
                    "text-lg font-semibold text-center",
                    jetBrainsMono.className,
                  )}
                >
                  {pillar.title}
                </h3>
              </div>
            ))}
          </div>

          {/* Detail View */}
          <div
            className="relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow p-6 min-h-[250px] transition-colors duration-500"
            style={dominantColor ? { borderColor: dominantColor } : {}}
          >
            {dominantColor && (
              <div
                className="absolute inset-0 opacity-5 pointer-events-none transition-colors duration-500"
                style={{
                  background: `linear-gradient(to right, ${dominantColor}, transparent)`,
                }}
              />
            )}
            <div
              key={activePillar.title}
              className="flex flex-col md:flex-row items-center gap-8 h-full animate__animated animate__fadeIn relative z-10"
            >
              <div className="flex-1 space-y-4">
                <h3
                  className={cn("text-2xl font-bold", jetBrainsMono.className)}
                >
                  {activePillar.title}
                </h3>
                <p
                  className={cn(
                    "text-muted-foreground leading-relaxed",
                    jetBrainsMono.className,
                  )}
                >
                  {activePillar.description}
                </p>
                {activePillar.imageDesc && (
                  <p
                    className={cn(
                      "text-xs text-muted-foreground/70 italic pt-2 border-t border-border/50",
                      jetBrainsMono.className,
                    )}
                  >
                    {activePillar.imageDesc}
                  </p>
                )}
              </div>
              <div className="flex-1 relative w-full h-48 md:h-auto aspect-video md:aspect-video rounded-lg overflow-hidden">
                <Image
                  src={activePillar.imageSrc}
                  alt={activePillar.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
