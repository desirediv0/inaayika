"use client";

const ITEMS = [
  "Handcrafted in India",
  "Complimentary Doorstep Delivery",
  "Designed by Pooja Khan",
  "Worldwide Shipping",
  "Bespoke Custom Designs",
  "Premium Materials Only",
];

function MarqueeContent() {
  return (
    <div className="flex items-center flex-shrink-0">
      {ITEMS.map((item, i) => (
        <span key={i} className="flex items-center">
          <span className="font-display italic text-lg md:text-xl font-medium text-white/85 whitespace-nowrap px-8 md:px-12 tracking-wide">
            {item}
          </span>
          <span className="text-[#E7C983] text-xs" aria-hidden="true">✦</span>
        </span>
      ))}
    </div>
  );
}

/**
 * Infinite scrolling luxury ribbon — pure CSS animation, pauses on hover.
 */
export default function LuxuryMarquee() {
  return (
    <section
      className="luxe-marquee py-5 border-y border-[#B08D57]/25 select-none"
      style={{ background: "#002216" }}
      aria-label="Inaayika highlights"
    >
      <div className="luxe-marquee-track">
        <MarqueeContent />
        <MarqueeContent />
      </div>
    </section>
  );
}
