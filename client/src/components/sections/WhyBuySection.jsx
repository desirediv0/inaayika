"use client";

import Link from "next/link";
import Image from "next/image";
import { PhoneCall, ShieldCheck, Bell, ChevronRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

export const WhyBuySection = () => {
  return (
    <section className="py-16 md:py-20 font-sans" style={{ background: "#FDFBF7" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* ── Left Column: Banner & Features (4 cols) ── */}
          <Reveal className="lg:col-span-4 flex flex-col gap-6">
            {/* Top Sub-banner: BRACELETS */}
            <div className="relative overflow-hidden h-[180px] flex items-center border group" style={{ background: "#F7F3EB", borderColor: "#E9E2D5" }}>
              <div className="p-6 relative z-10 w-1/2">
                <span className="text-[9px] tracking-[0.35em] uppercase" style={{ color: "#B08D57" }}>Bracelets</span>
                <h3 className="font-display text-2xl font-medium text-neutral-900 mt-1.5 mb-3 leading-tight">New Collection</h3>
                <Link
                  href="/products"
                  className="text-[10px] uppercase tracking-[0.25em] text-neutral-800 hover:text-[#B08D57] flex items-center gap-1 transition-colors border-b border-neutral-800 hover:border-[#B08D57] pb-0.5 w-max"
                >
                  Shop Now
                </Link>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-1/2 h-full overflow-hidden">
                <Image
                  src="/deals-sub.png"
                  alt="Bracelets Collection"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

            {/* Feature Cards */}
            <div className="flex flex-col gap-4">
              {/* Card 1 */}
              <div className="p-5 border bg-white flex items-start gap-4 transition-shadow hover:shadow-[0_20px_40px_-24px_rgba(0,34,22,0.2)]" style={{ borderColor: "#E9E2D5" }}>
                <div className="p-2.5 border" style={{ background: "#F7F3EB", borderColor: "#E9E2D5", color: "#B08D57" }}>
                  <PhoneCall className="w-5 h-5 stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="font-display text-base font-medium text-neutral-900 mb-0.5">Attentive Client Care</h4>
                  <p className="text-xs text-neutral-500 font-light leading-relaxed tracking-wide">Personal assistance around the clock, so you never wait.</p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-5 border bg-white flex items-start gap-4 transition-shadow hover:shadow-[0_20px_40px_-24px_rgba(0,34,22,0.2)]" style={{ borderColor: "#E9E2D5" }}>
                <div className="p-2.5 border" style={{ background: "#F7F3EB", borderColor: "#E9E2D5", color: "#B08D57" }}>
                  <ShieldCheck className="w-5 h-5 stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="font-display text-base font-medium text-neutral-900 mb-0.5">Honest Value, Always</h4>
                  <p className="text-xs text-neutral-500 font-light leading-relaxed tracking-wide">Transparent pricing on every handcrafted piece — no surprises.</p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-5 border bg-white flex items-start gap-4 transition-shadow hover:shadow-[0_20px_40px_-24px_rgba(0,34,22,0.2)]" style={{ borderColor: "#E9E2D5" }}>
                <div className="p-2.5 border" style={{ background: "#F7F3EB", borderColor: "#E9E2D5", color: "#B08D57" }}>
                  <Bell className="w-5 h-5 stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="font-display text-base font-medium text-neutral-900 mb-0.5">Private Sale Alerts</h4>
                  <p className="text-xs text-neutral-500 font-light leading-relaxed tracking-wide">Be the first to know when your favourites are on offer.</p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* ── Right Column: Large Deal Banner (8 cols) ── */}
          <Reveal delay={0.15} className="lg:col-span-8 overflow-hidden border flex flex-col md:flex-row items-stretch" style={{ background: "#F7F3EB", borderColor: "#E9E2D5" }}>
            {/* Left side content of deal box */}
            <div className="p-8 md:p-14 flex flex-col justify-center flex-1">
              <div>
                <span className="luxe-eyebrow inline-block mb-6">
                  Deals of the Week
                </span>
              </div>

              <h2 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] font-medium text-neutral-900 leading-[1.15] mb-5">
                Reflect the bonds of the past into your{" "}
                <span className="italic" style={{ color: "#B08D57" }}>modern life</span>.
              </h2>

              <p className="text-sm text-neutral-500 font-light leading-relaxed tracking-wide mb-9 max-w-md">
                Fashion is about dressing according to what&apos;s fashionable. Style is more about being yourself. Design is a constant challenge to balance comfort with luxe.
              </p>

              {/* Action Button */}
              <div>
                <Link href="/products" className="btn-luxe">
                  Shop the Edit <ChevronRight className="w-3.5 h-3.5" style={{ color: "#E7C983" }} />
                </Link>
              </div>
            </div>

            {/* Right side Image banner */}
            <div className="relative w-full md:w-[40%] min-h-[300px] md:min-h-full">
              <Image
                src="/deals-hero.png"
                alt="Jewelry Showcase"
                fill
                className="object-cover"
                sizes="(max-w-768px) 100vw, 40vw"
                priority
              />
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
};

export default WhyBuySection;
