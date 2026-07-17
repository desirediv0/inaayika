import {
  Sparkles, ShieldCheck, Heart, Award, ArrowRight,
  Gem, Check, Gift, PhoneCall
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

export const metadata = {
  title: "About Us | Inaayika — Handcrafted Premium Jewellery",
  description: "Inaayika by Pooja Khan is a curated platform offering premium handcrafted jewellery and artisan hair accessories, designed to celebrate elegance and individuality.",
};

const stats = [
  { value: "100%", label: "Artisan Handcrafted", icon: <Sparkles className="w-5 h-5" /> },
  { value: "Premium", label: "Quality Materials", icon: <Gem className="w-5 h-5" /> },
  { value: "Worldwide", label: "Secure Shipping", icon: <ShieldCheck className="w-5 h-5" /> },
  { value: "9am to 6pm", label: "Mon - Sat Support", icon: <Heart className="w-5 h-5" /> },
];

const values = [
  {
    icon: Award,
    title: "Artisan Sourcing",
    description: "Each hair accessory and piece of jewellery is meticulously designed and handmade, ensuring unique variations and unmatched custom detail.",
  },
  {
    icon: Gem,
    title: "Affordable Premium Styling",
    description: "Exquisite aesthetics and luxury styling options made accessible directly to your doorstep without high showroom markups.",
  },
  {
    icon: Heart,
    title: "Designed with Passion",
    description: "Curated and conceptualized by founder Pooja Khan, bringing a balance of tradition, modern versatility, and personality to every piece.",
  },
  {
    icon: Gift,
    title: "Signature Packaging",
    description: "Safely encased in custom protective boxes designed to prevent damage during transit, perfect for gifting yourself or loved ones.",
  },
];

const CATEGORIES = [
  "Bespoke Bridal Sets",
  "Handcrafted Necklaces",
  "Designer Earrings",
  "Artisan Hair Accessories",
  "Statement Rings",
  "Premium Bracelets",
  "Floral Jewellery Sets",
  "Customized Combs & Clips"
];

const features = [
  "100% Unique Handmade Jewellery",
  "Secure Tracked Worldwide Transit",
  "Eco-Friendly Protected Packaging",
  "Direct WhatsApp Sizing Support",
  "Trusted by 1000+ Happy Customers",
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-hero-dark text-white">
        {/* Fine background grid and ambient glows */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(212,175,55,0.1)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-80" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-80 h-80 rounded-full blur-3xl opacity-20" style={{ background: "radial-gradient(circle, #D4AF37, transparent)" }} />
          <div className="absolute bottom-10 left-20 w-80 h-80 rounded-full blur-3xl opacity-15" style={{ background: "radial-gradient(circle, #003E29, transparent)" }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-12 items-center">

            {/* Hero Left Content */}
            <div className="lg:col-span-7 max-w-3xl">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 border animate-fade-in uppercase tracking-wider"
                style={{ background: "rgba(212,175,55,0.1)", borderColor: "rgba(212,175,55,0.3)", color: "#D4AF37" }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Artisan Custom Design Studio
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display tracking-tight mb-6 leading-[1.1] text-white">
                Handcrafted Elegance, <br />
                <span className="bg-gradient-to-r from-[#D4AF37] to-emerald-400 bg-clip-text text-transparent">
                  Designed For You
                </span>
              </h1>
              <p className="text-base md:text-lg text-slate-300 mb-8 leading-relaxed">
                Inaayika by Pooja Khan is your destination for premium handcrafted jewellery and luxury styling accessories. We bridge the gap between traditional craftsmanship and modern designs, ensuring every package delivers outstanding craftsmanship directly to your doorstep.
              </p>

              {/* Bullet Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-950 flex items-center justify-center text-emerald-400 border border-emerald-800 flex-shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-sm font-medium text-slate-200">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href="/products">
                  <Button
                    size="lg"
                    className="text-white px-8 h-12 rounded-xl font-semibold gap-2 bg-[#003E29] hover:bg-[#002216] shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/40 transition-all border-0"
                  >
                    Explore Products <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <a
                  href="https://wa.me/918796449692"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 h-12 rounded-xl font-semibold border border-zinc-800 text-slate-200 bg-transparent hover:bg-zinc-900 transition-colors"
                  >
                    <FaWhatsapp className="mr-2 text-emerald-400" /> WhatsApp Styling Desk
                  </Button>
                </a>
              </div>
            </div>

            {/* Hero Right: Design Heritage & Authenticity */}
            <div className="lg:col-span-5 relative">
              <div className="relative bg-zinc-950/90 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-zinc-800 shadow-2xl hover:shadow-3xl transition-all duration-300">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
                  <span className="text-xs uppercase tracking-wider text-zinc-400">Artisan Integrity &amp; Quality</span>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-900">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Inaayika Verified
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-900 transition-all">
                    <div className="w-9 h-9 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <Gem className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">Direct-to-Consumer Value</p>
                      <p className="text-[11px] text-slate-400 leading-normal mt-0.5">By designing and sourcing our handcrafted hair accessories in-house, we eliminate retail markup and pass the savings to you.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-900 transition-all">
                    <div className="w-9 h-9 rounded-lg bg-yellow-950 text-[#D4AF37] flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">Exquisite Materials Only</p>
                      <p className="text-[11px] text-slate-400 leading-normal mt-0.5">Premium alloy bases, durable beads, and high-quality crafting wires designed to look radiant and last.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Floating Statistics Section */}
      <section className="relative -mt-10 z-20 px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-50 text-[#003E29] flex-shrink-0">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-display text-slate-900">{stat.value}</p>
                  <p className="text-slate-500 text-xs tracking-tight">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy & Jewelry Categories */}
      <section className="py-20 md:py-28 px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">

            {/* Core Mission Copy */}
            <div className="lg:col-span-5">
              <span
                className="inline-block px-3 py-1 text-xs uppercase tracking-wider rounded-full mb-4 bg-emerald-50 text-[#003E29]"
              >
                Our Legacy
              </span>
              <h2 className="text-3xl md:text-4xl font-display text-slate-950 mb-6 leading-tight">
                Designed to make you look stunning
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6 text-sm md:text-base font-sans">
                At Inaayika, we believe in the unique character of handmade creations. Under the creative direction of Pooja Khan, we design jewellery that combines artisan techniques with current global fashion trends.
              </p>
              <p className="text-slate-600 leading-relaxed mb-6 text-sm md:text-base font-sans">
                Whether you need a bespoke bridal necklace, a set of customised floral jewellery, or luxury hair accessories to match your outfits, we specialize in tailoring pieces exactly to your size, color theme, and requirements.
              </p>

              {/* Quality pillars list */}
              <div className="space-y-4 mt-8 pt-6 border-t border-slate-200 font-sans">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#003E29]">
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-slate-800">100% Customized Sizes &amp; Color Matching**</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#003E29]">
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-slate-800">Eco-Friendly Premium Packaging Box</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#003E29]">
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-slate-800">Artisan Sourcing &amp; Safe Direct Delivery</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 italic font-light">
                  **Conditions Apply: Custom orders cannot be returned or exchanged.
                </p>
              </div>
            </div>

            {/* Specialty Categories Grid */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm font-sans">
              <div className="mb-6">
                <h3 className="text-xl font-display text-slate-900">Custom Sourcing &amp; Range</h3>
                <p className="text-xs text-slate-500 mt-1">Our current designer portfolio items available for direct customization.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {CATEGORIES.map((cat, index) => {
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-[#003E29]/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm bg-emerald-50 text-[#003E29]"
                      >
                        <Gem className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-slate-800">{cat}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Pillars of Integrity (Values) */}
      <section className="py-20 md:py-24 bg-white border-y border-slate-200 px-6 sm:px-8 lg:px-12 font-sans">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span
              className="inline-block px-3 py-1 text-xs uppercase tracking-wider rounded-full mb-4 bg-emerald-50 text-[#003E29]"
            >
              Our Core Values
            </span>
            <h2 className="text-3xl md:text-4xl font-display text-slate-950 mb-4">
              Why Customers Love Inaayika
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
              We stand by our craftsmanship. Creativity, detailing, and client fulfillment are integrated into every design we send.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="group bg-slate-50/40 rounded-2xl p-6 border border-slate-200 transition-all duration-300 hover:bg-white hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-emerald-50 text-[#003E29] group-hover:bg-[#003E29] group-hover:text-white transition-all duration-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-display text-slate-900 mb-2">{value.title}</h3>
                  <p className="text-slate-600 text-xs md:text-sm leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action (CTA) Panel */}
      <section className="py-20 px-6 sm:px-8 lg:px-12 bg-slate-50 font-sans">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden py-16 px-8 md:px-16 text-center shadow-2xl bg-zinc-950 border border-zinc-800">
            {/* Ambient gold & emerald glowing spheres */}
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: "radial-gradient(circle, #D4AF37, transparent)" }} />
            <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: "radial-gradient(circle, #003E29, transparent)" }} />

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl text-white font-display mb-4">
                Want a custom design?
              </h2>
              <p className="text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed text-sm md:text-base">
                Get real-time answers for customized hair accessories, bridal sets, or coordinate color matching directly with founder Pooja Khan on WhatsApp.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/products" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto text-white px-8 h-12 rounded-xl font-semibold bg-[#003E29] hover:bg-[#002216] transition-colors shadow-lg shadow-emerald-900/20 border-0"
                  >
                    Browse Collections
                  </Button>
                </Link>
                <a
                  href="https://wa.me/918796449692"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto px-8 h-12 rounded-xl font-semibold border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition-all bg-transparent"
                  >
                    <FaWhatsapp className="mr-2 text-emerald-400" /> WhatsApp Pooja Khan
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
