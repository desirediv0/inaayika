"use client";

import React, { useState } from "react";

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
    <section className="bg-white py-12 md:py-16 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {BADGES.map((badge, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
              {/* Icon Container */}
              <div className="mb-4">
                <ImageOrSvg src={badge.src} fallback={badge.fallback} />
              </div>

              {/* Title */}
              <h3 className="font-sans   text-gray-900 text-sm md:text-base mb-1.5 uppercase tracking-wider">
                {badge.title}
              </h3>

              {/* Description */}
              <p className="font-sans text-xs text-gray-400 font-medium max-w-[240px]">
                {badge.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
