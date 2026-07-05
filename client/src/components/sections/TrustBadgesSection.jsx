"use client";

import React, { useState } from "react";
import Reveal from "@/components/ui/Reveal";

const ImageOrSvg = ({ src, fallback: Fallback }) => {
  const [error, setError] = useState(false);
  if (error || !src) return <Fallback />;
  return (
    <img
      src={src}
      alt="icon"
      className="w-12 h-12 object-contain"
      onError={() => setError(true)}
    />
  );
};

const BADGES = [
  {
    src: "/amazing-value.svg",
    title: "Amazing Value Every Day",
    desc: "Items prices that fit your budget",
    fallback: () => (
      <svg className="w-12 h-12 text-[#003E29]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" strokeWidth="2" />
        <circle cx="11" cy="14" r="2" />
      </svg>
    ),
  },
  {
    src: "/customer-service.svg",
    title: "Successful Customer Service",
    desc: "We work with a focus on 100% customer satisfaction.",
    fallback: () => (
      <svg className="w-12 h-12 text-[#003E29]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="7" />
        <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
        <path d="M10 8h4" />
      </svg>
    ),
  },
  {
    src: "/payment-methods.svg",
    title: "All Payment Methods",
    desc: "Don't bother with payment details.",
    fallback: () => (
      <svg className="w-12 h-12 text-[#003E29]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" strokeWidth="1.5" />
        <line x1="6" y1="15" x2="10" y2="15" />
      </svg>
    ),
  },
  {
    src: "/free-shipping.svg",
    title: "Completely free shipping",
    desc: "We'll handle the shipping.",
    fallback: () => (
      <svg className="w-12 h-12 text-[#003E29]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
];

export default function TrustBadgesSection() {
  return (
    <section className="py-14 md:py-16 border-b" style={{ background: "#F7F3EB", borderColor: "#E9E2D5" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-0 sm:divide-x" style={{ "--tw-divide-opacity": 1 }}>
          {BADGES.map((badge, idx) => (
            <Reveal key={idx} delay={idx * 0.1} className="flex flex-col items-center text-center sm:px-8" style={{ borderColor: "#E9E2D5" }}>
              {/* Icon Container */}
              <div className="mb-5 text-[#B08D57] [&_svg]:text-[#B08D57] [&_svg]:w-10 [&_svg]:h-10 [&_img]:w-10 [&_img]:h-10">
                <ImageOrSvg src={badge.src} fallback={badge.fallback} />
              </div>

              {/* Title */}
              <h3 className="font-display text-lg font-medium text-neutral-900 mb-2 tracking-wide">
                {badge.title}
              </h3>

              {/* Gold rule */}
              <span className="luxe-rule mb-3" />

              {/* Description */}
              <p className="font-sans text-xs text-neutral-500 font-light tracking-wide leading-relaxed max-w-[220px]">
                {badge.desc}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
