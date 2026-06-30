"use client";

import Link from "next/link";
import Image from "next/image";
import { PhoneCall, ShieldCheck, Bell, ChevronRight } from "lucide-react";

export const WhyBuySection = () => {
  return (
    <section className="py-16 bg-white font-sans">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* ── Left Column: Banner & Features (4 cols) ── */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Top Sub-banner: BRACELETS */}
            <div className="relative rounded-2xl overflow-hidden h-[180px] bg-zinc-100 flex items-center border border-zinc-100 shadow-sm group">
              <div className="p-6 relative z-10 w-1/2">
                <span className="text-[10px]   tracking-widest text-[#003E29] uppercase">BRACELETS</span>
                <h3 className="text-lg   text-zinc-950 mt-1 mb-3 leading-tight">New Collection</h3>
                <Link
                  href="/products"
                  className="text-xs font-semibold text-zinc-800 hover:text-black flex items-center gap-1 transition-colors"
                >
                  Shop Now <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-1/2 h-full overflow-hidden">
                <Image
                  src="/deals-sub.png"
                  alt="Bracelets Collection"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Feature Cards */}
            <div className="flex flex-col gap-4">
              {/* Card 1 */}
              <div className="p-5 rounded-2xl border border-zinc-100 bg-white shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 text-[#003E29]">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm   text-zinc-950 mb-0.5">24 hour fast customer service</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed">Get support without waiting, shop faster.</p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-5 rounded-2xl border border-zinc-100 bg-white shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 text-[#003E29]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm   text-zinc-950 mb-0.5">Best Market Price Guarantee</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed">We do not mislead the customer, transparent trade.</p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-5 rounded-2xl border border-zinc-100 bg-white shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 text-[#003E29]">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm   text-zinc-950 mb-0.5">Try Price Change Alerts</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed">Meet maximum discounts.</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Column: Large Deal Banner (8 cols) ── */}
          <div className="lg:col-span-8 bg-[#f9f9f9] rounded-3xl overflow-hidden border border-zinc-100 shadow-sm flex flex-col md:flex-row items-stretch">
            {/* Left side content of deal box */}
            <div className="p-8 md:p-12 flex flex-col justify-center flex-1">
              <div>
                <span className="inline-block bg-[#FACC15] text-black   tracking-wider text-[10px] px-3 py-1 rounded mb-6 uppercase">
                  Deals of the Week
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl lg:text-4xl   text-zinc-950 leading-[1.15] mb-4">
                Reflect the bonds of the past into your{" "}
                <span className="underline decoration-2 decoration-[#FACC15] underline-offset-4">modern life</span>.
              </h2>

              <p className="text-sm text-zinc-600 leading-relaxed mb-8 max-w-md">
                Fashion is about dressing according to what&apos;s fashionable. Style is more about being yourself. Design is a constant challenge to balance comfort with luxe.
              </p>

              {/* Action Button */}
              <div>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-white hover:bg-[#002216] transition-all px-7 py-3.5 rounded-xl text-sm font-semibold border border-[#D4AF37]/30 shadow-lg shadow-emerald-900/10"
                  style={{ background: "#003E29" }}
                >
                  Buy products <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
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
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhyBuySection;
