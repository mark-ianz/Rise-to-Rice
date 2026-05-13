import CompanyLogo from "@/components/logo/CompanyLogo";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export type FeatureItem = {
  title: string;
  description: string;
};

type Props = {
  badge?: string;
  title: ReactNode;
  description: ReactNode;
  features?: FeatureItem[];
  footerText?: string;
  className?: string;
  imageAlt?: string; // Kept for interface compatibility
  imageSrc?: string; // Kept for interface compatibility
  imageClassName?: string;
};

export default function AuthHeroPanel({
  title,
  description,
  features,
  footerText = "© 2026 Rise to Rice. All rights reserved.",
  className,
}: Props) {
  return (
    <aside
      className={cn(
        "relative flex h-full flex-col bg-[linear-gradient(135deg,#2D5A27_0%,#1A3D18_100%)] p-12 lg:p-16 overflow-hidden shadow-[20px_0_50px_-15px_rgba(0,0,0,0.3)] z-10",
        className
      )}
    >
      {/* Geometric SVG Background Pattern */}
      <svg
        className="absolute inset-0 h-full w-full opacity-10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="lines"
            x="0"
            y="0"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 100 Q 50 50 100 0"
              stroke="white"
              strokeWidth="0.5"
              fill="none"
            />
            <path
              d="M-50 100 Q 50 50 150 0"
              stroke="white"
              strokeWidth="0.5"
              fill="none"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#lines)" />
        <circle cx="20%" cy="80%" r="40%" stroke="white" strokeWidth="0.5" fill="none" />
        <circle cx="80%" cy="20%" r="60%" stroke="white" strokeWidth="0.5" fill="none" />
      </svg>

      <div className="relative z-10 flex w-full flex-col h-full justify-between">
        <div className="space-y-12">
          <div className="h-16" /> {/* Spacer for logo removal */}

          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-white max-w-lg">
              {title}
            </h1>
            <div className="text-base leading-relaxed text-white/80 max-w-md font-light">
              {description}
            </div>
          </div>

          {features && features.length > 0 && (
            <div className="space-y-6 pt-4">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-4 max-w-md">
                  <div className="mt-1 flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm mb-1">{feature.title}</h3>
                    <p className="text-white/70 text-xs leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-sm text-white/50 font-light tracking-wide mt-12">
          {footerText}
        </div>
      </div>
    </aside>
  );
}
