"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/utils";
import { Sparkles, Users, Award, Truck, Globe, Crown } from "lucide-react";
import { getPharmaIcon } from "@/lib/pharma-icons";

const WHATSAPP_NUMBER = "918796449692";

// Fallback static categories if API empty
const FALLBACK_CATEGORIES = [
  { name: "Hair Accessories", slug: "hair-accessories" },
  { name: "DIY Custom Kits", slug: "diy-kits" },
  { name: "Necklaces", slug: "necklaces" },
  { name: "Earrings", slug: "earrings" },
  { name: "Rings", slug: "rings" },
  { name: "Bracelets", slug: "bracelets" },
];

/* ─────────────────────────────────────────────
   FEATURED CATEGORIES SECTION
───────────────────────────────────────────── */
export function FeaturedCategoriesSection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi("/public/categories")
      .then((res) => setCategories((res.data?.categories || []).slice(0, 12)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const displayCats = categories.length > 0 ? categories : FALLBACK_CATEGORIES;

  return (
    <section className="py-14 md:py-16" style={{ background: "#F7FAFC" }}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4 border"
            style={{ background: "rgba(212,175,55,0.06)", borderColor: "rgba(212,175,55,0.15)", color: "#003E29" }}
          >
            <Sparkles className="h-4 w-4" style={{ color: "#D4AF37" }} />
            Jewellery Collections
          </div>
          <h2 className="text-3xl md:text-4xl mb-3" style={{ color: "#002216" }}>
            Explore Our Collections
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm font-sans">
            Explore our exquisite range of handcrafted jewellery, customised hair accessories, and DIY kits.
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-white animate-pulse border" style={{ borderColor: "#E5E7EB" }} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {displayCats.map((cat) => {
              const { Icon, color } = getPharmaIcon(cat.name, cat.slug || "");
              return (
                <Link
                  key={cat.id || cat.slug}
                  href={cat.slug ? `/category/${cat.slug}` : "/products"}
                  className="group flex flex-col items-center gap-3 p-4 rounded-2xl bg-white border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl text-center"
                  style={{ borderColor: "#E5E7EB" }}
                >
                  {/* Image or icon */}
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-110 flex-shrink-0"
                    style={{ background: `${color}12`, border: `1.5px solid ${color}25` }}
                  >
                    {cat.image ? (
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        width={56}
                        height={56}
                        className="w-10 h-10 object-contain"
                      />
                    ) : (
                      <Icon size={26} style={{ color }} />
                    )}
                  </div>
                  <span
                    className="text-[12px] font-semibold leading-tight line-clamp-2 transition-colors group-hover:text-[#D4AF37]"
                    style={{ color: "#002216" }}
                  >
                    {cat.name}
                  </span>
                </Link>
              );
            })}
          </div>
        )}

        <div className="text-center mt-8">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold border-2 transition-all hover:-translate-y-0.5 hover:shadow-md text-sm"
            style={{ borderColor: "#003E29", color: "#003E29" }}
          >
            View All Collections
          </Link>
        </div>
      </div>
    </section>
  );
}

export function ColdChainBanner() {
  const TRUST_ITEMS = [
    { value: "Delhi Craft", label: "Customised Hair Accessories", icon: Crown, desc: "Bespoke hair pieces crafted with premium material in Delhi." },
    { value: "50K+ Happy Customers", label: "Loved Across India", icon: Users, desc: "Trusted by thousands for their special occasions and celebrations." },
    { value: "5-10 Days Shipping", label: "Fast & Insured Delivery", icon: Truck, desc: "We pack with love and ship quickly using premium delivery partners." },
    { value: "Worldwide Delivery", label: "No COD, Ships Globally", icon: Globe, desc: "Secure shipping channels offering trackable global delivery options." },
    { value: "DIY Accessories", label: "Craft Your Own Style", icon: Sparkles, desc: "Explore DIY kits to customize and design your own matching ornaments." },
  ];

  return (
    <section className="py-16 bg-white font-sans">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-[#003E29]/10 text-[#003E29] tracking-wider text-[10px] px-3.5 py-1.5 rounded-full uppercase mb-4 border border-[#003E29]/25">
            Why Choose Inaayika
          </span>
          <h2 className="text-3xl md:text-4xl text-zinc-950 tracking-tight">
            Why Style Lovers Choose <span className="underline decoration-2 decoration-[#D4AF37] underline-offset-4">Inaayika</span>
          </h2>
          <p className="text-sm text-zinc-500 max-w-xl mx-auto mt-3">
            Discover the art of handcrafted perfection, lovingly designed by Pooja Khan and delivered globally.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* Left Column: Founder Highlight Card (5 cols) */}
          <div className="lg:col-span-5 bg-zinc-50 border border-zinc-100 rounded-3xl overflow-hidden flex flex-col justify-between shadow-sm group">
            <div className="relative h-[240px] w-full overflow-hidden">
              <Image
                src="/founder-craft.png"
                alt="Founder Pooja Khan Handcrafting Jewelry"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-[#D4AF37] text-white text-[10px] px-3 py-1 rounded uppercase tracking-wider">
                Founder Design
              </div>
            </div>
            <div className="p-8">
              <span className="text-[10px] tracking-widest text-zinc-400 uppercase">Designed by Founder</span>
              <h3 className="text-xl font-black text-zinc-950 mt-1 mb-2">@meandshiningstars</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Pooja Khan personally designs and supervises the creation of every singular hair accessory, ensuring unmatched quality and attention to detail.
              </p>
            </div>
          </div>

          {/* Right Column: Grid Features (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TRUST_ITEMS.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-zinc-100 bg-white shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-[#003E29] mb-4 group-hover:scale-105 transition-transform duration-300">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm text-zinc-950 mb-1">{item.value}</h4>
                  <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] mb-2 block">{item.label}</span>
                  <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FLOATING WHATSAPP
───────────────────────────────────────────── */
export function WhatsAppSticky() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hello%2C%20I%20want%20to%20know%20more%20about%20your%20handcrafted%20jewellery.`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-green-500/40"
      style={{ background: "#25D366" }}
      aria-label="Chat with us on WhatsApp"
    >
      <img
        src="/whatsapp.png"
        alt="WhatsApp"
        className="w-8 h-8 object-contain"
      />
    </a>
  );
}
