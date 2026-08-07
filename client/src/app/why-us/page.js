import {
  Crown, Sparkles, Paintbrush, Truck, Users,
  MessageSquare, ArrowRight, Award, Gift
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "Why Choose Us | Inaayika — Handcrafted Premium Jewellery",
  description: "Learn why style lovers trust Inaayika for customized hair accessories, DIY jewellery kits, and bespoke handcrafted ornaments designed by Pooja Khan.",
};

const REASONS = [
  {
    icon: Crown,
    color: "#B08D57",
    title: "Designed by Pooja Khan",
    description: "Our founder personally designs and curates every single piece. From initial sketch to final polish, each accessory reflects an unmatched attention to detail.",
  },
  {
    icon: Sparkles,
    color: "#B08D57",
    title: "Delhi Craft Artistry",
    description: "Individually handmade by skilled artisans in our Delhi workshops. We combine traditional techniques with modern styling to create timeless ornaments.",
  },
  {
    icon: Paintbrush,
    color: "#B08D57",
    title: "Bridal Hair Accessories",
    description: "Specializing in exquisite bridal hair accessories, crowns, tiaras, and custom ornaments handcrafted to make you shine on your most special day.",
  },
  {
    icon: Truck,
    color: "#B08D57",
    title: "Worldwide Trackable Shipping",
    description: "Every shipment is fully insured and packed with utmost love in premium keepsake boxes. We ship globally with reliable premium delivery partners.",
  },
  {
    icon: Users,
    color: "#B08D57",
    title: "Loved by 50,000+ Customers",
    description: "Trusted by thousands of style lovers across India and globally for weddings, festivals, and personal celebrations. Our reviews speak for themselves.",
  },
  {
    icon: MessageSquare,
    color: "#B08D57",
    title: "Attentive Client Support",
    description: "Need help with styling, custom sizing, or bulk event bookings? Connect with our dedicated support team on WhatsApp for immediate guidance.",
  },
];

const STATS = [
  { value: "50,000+", label: "Happy Customers" },
  { value: "Delhi Craft", label: "Artisan Workshop" },
  { value: "100%", label: "Handcrafted Promise" },
  { value: "Worldwide", label: "Tracked Shipping" },
];

const WHATSAPP_NUMBER = "918796449692";

export default function WhyUsPage() {
  return (
    <div className="min-h-screen font-sans" style={{ background: "#FDFBF7" }}>

      {/* ── Hero ── */}
      <section
        className="relative pt-20 pb-16 md:py-24 overflow-hidden bg-hero-dark max-w-full"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-5" style={{ background: "radial-gradient(circle, #B08D57, transparent 70%)" }} />
          <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full opacity-5" style={{ background: "radial-gradient(circle, #B08D57, transparent 70%)" }} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-6 border max-w-full" style={{ background: "rgba(176,141,87,0.06)", borderColor: "rgba(176,141,87,0.15)", color: "#E7C983" }}>
            <Award className="h-4 w-4 flex-shrink-0" style={{ color: "#E7C983" }} />
            <span className="truncate">The Inaayika Promise</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight font-medium tracking-wide break-words">
            Why Choose <br className="sm:hidden" />
            <span className="italic text-gold-shimmer">Inaayika?</span>
          </h1>
          <p className="text-white/70 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed tracking-wide break-words">
            Discover the art of handcrafted perfection, custom hair accessories, and DIY jewellery kits designed personally by Pooja Khan and crafted with pure love.
          </p>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-b overflow-hidden" style={{ background: "#F7F3EB", borderColor: "#E9E2D5" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 text-center" style={{ borderColor: "#E9E2D5" }}>
            {STATS.map((stat, i) => (
              <div key={i} className="px-2 py-2 min-w-0 border-r border-neutral-300/40 last:border-r-0 md:border-r md:last:border-r-0">
                <p className="font-display text-lg sm:text-2xl md:text-4xl font-medium mb-1 text-gold-shimmer break-words leading-tight">{stat.value}</p>
                <p className="text-[10px] sm:text-xs uppercase tracking-wider text-neutral-500 font-medium mt-1 leading-snug break-words">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reasons grid ── */}
      <section className="py-12 md:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 md:mb-16">
            <span className="luxe-eyebrow block mb-3">Our Core Values</span>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-medium tracking-wide text-neutral-900 mb-4 break-words">
              What Sets Us Apart
            </h2>
            <span className="luxe-rule" />
            <p className="text-neutral-500 font-light text-xs sm:text-sm max-w-2xl mx-auto mt-4 tracking-wide leading-relaxed break-words">
              We don&apos;t just sell accessories — we provide a journey of handcrafted elegance, creative self-expression, and exceptional service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {REASONS.map((reason, i) => (
              <div
                key={i}
                className="group bg-white p-6 sm:p-8 border transition-all duration-300 hover:shadow-[0_24px_50px_-20px_rgba(0,34,22,0.15)] hover:-translate-y-1 min-w-0"
                style={{ borderColor: "#E9E2D5" }}
              >
                <div
                  className="w-12 h-12 border flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
                  style={{ background: "#F7F3EB", borderColor: "#E9E2D5" }}
                >
                  <reason.icon className="h-5 w-5 stroke-[1.5]" style={{ color: reason.color }} />
                </div>
                <h3 className="font-display text-lg sm:text-xl font-medium text-neutral-900 mb-3 break-words">{reason.title}</h3>
                <p className="text-neutral-500 text-xs font-light leading-relaxed tracking-wide break-words">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Specialties banner ── */}
      <section className="py-10 md:py-12 border-t border-b overflow-hidden" style={{ background: "#F7F3EB", borderColor: "#E9E2D5" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 border flex items-center justify-center flex-shrink-0" style={{ background: "#FDFBF7", borderColor: "#E9E2D5", color: "#B08D57" }}>
                <Gift className="h-6 w-6 stroke-[1.5]" />
              </div>
              <div className="min-w-0">
                <p className="font-display text-base sm:text-lg font-medium text-neutral-900 truncate">Bridal Hair Accessories & Kits</p>
                <p className="text-xs text-neutral-500 font-light tracking-wide mt-0.5 break-words">Artisan Hair Ornaments · Bespoke Bridal Hair Sets · Designer Earrings · DIY Accessories</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-center lg:justify-end max-w-full">
              {["Handcrafted", "Bridal Hair Accessories", "Bespoke Bridal Hair Sets", "Insured Shipping", "Keepsake Box"].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-[10px] tracking-wider uppercase border font-medium break-words text-center"
                  style={{ background: "#FDFBF7", borderColor: "#E9E2D5", color: "#B08D57" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-12 md:py-16 bg-hero-dark border-t" style={{ borderColor: "#E9E2D5" }}>
        <div className="max-w-7xl mx-auto px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 50%, rgba(176,141,87,0.06), transparent 70%)" }} />
          <div className="relative z-10">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium tracking-wide text-white mb-6">
              Bring Your Custom Style to Life
            </h2>
            <p className="text-white/70 text-sm md:text-base font-light tracking-wide max-w-2xl mx-auto mb-10 leading-relaxed">
              Explore our premium range of hair ornaments, design kits, and personalized consultation. Start your journey with Inaayika today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/products">
                <Button
                  className="btn-luxe-white h-12 px-8 min-w-[200px]"
                >
                  Shop the Collection <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hello%2C%20I%20want%20to%20know%20more%20about%20your%20handcrafted%20jewellery.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-luxe-gold h-12 px-8 min-w-[200px] flex items-center justify-center gap-2 text-white transition-all"
              >
                Message on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
