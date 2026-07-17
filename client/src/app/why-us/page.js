import {
  Crown, Sparkles, Paintbrush, Truck, Users,
  MessageSquare, Star, ArrowRight, Award, Gift
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
    title: "Loved by 50K+ Customers",
    description: "Trusted by thousands of style lovers across India and globally for weddings, festivals, and personal celebrations. Our reviews speak for themselves.",
  },
  {
    icon: MessageSquare,
    color: "#B08D57",
    title: "Attentive Client Support",
    description: "Need help with styling, custom sizing, or bulk event bookings? Connect with our dedicated support team on WhatsApp for immediate guidance.",
  },
];

const REVIEWS = [
  { name: "Meera Deshmukh", role: "Bride, Mumbai", rating: 5, text: "I ordered the custom hair accessories for my wedding. Pooja Khan did an outstanding job! The quality of materials and packaging was extremely premium." },
  { name: "Ananya Sen", role: "DIY Enthusiast, Kolkata", rating: 5, text: "The DIY kits are so fun and easy to use! Sourced premium beads and wires. I successfully created a matching necklace for my outfit." },
  { name: "Shruti Hegde", role: "Customer, Bangalore", rating: 5, text: "Absolutely loved the bracelets! Fast delivery and great customer care support. Will definitely be purchasing more for gifting." },
  { name: "Rohini Sharma", role: "Customer, Delhi", rating: 5, text: "Inaayika's hair accessories are the best in the market. True craftsmanship that you can feel in every single detail. Worth every rupee!" },
  { name: "Jasmin Kaur", role: "Caregiver, Punjab", rating: 5, text: "Got custom matching hair pins for my bridesmaids. They were all in love! Shipping was fast and the boxes were super cute." },
  { name: "Preeti Patel", role: "Customer, Ahmedabad", rating: 5, text: "Excellent customer service on WhatsApp. They assisted me with choosing colors and sizing. The delivery arrived perfectly on time." },
];

const STATS = [
  { value: "50K+", label: "Happy Customers" },
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
        className="relative py-16 md:py-24 overflow-hidden bg-hero-dark"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-5" style={{ background: "radial-gradient(circle, #B08D57, transparent 70%)" }} />
          <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full opacity-5" style={{ background: "radial-gradient(circle, #B08D57, transparent 70%)" }} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border" style={{ background: "rgba(176,141,87,0.06)", borderColor: "rgba(176,141,87,0.15)", color: "#E7C983" }}>
            <Award className="h-4 w-4" style={{ color: "#E7C983" }} />
            The Inaayika Promise
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight font-medium tracking-wide">
            Why Choose <br className="sm:hidden" />
            <span className="italic text-gold-shimmer">Inaayika?</span>
          </h1>
          <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed tracking-wide">
            Discover the art of handcrafted perfection, custom hair accessories, and DIY jewellery kits designed personally by Pooja Khan and crafted with pure love.
          </p>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-b" style={{ background: "#F7F3EB", borderColor: "#E9E2D5" }}>
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x" style={{ borderColor: "#E9E2D5" }}>
            {STATS.map((stat, i) => (
              <div key={i} className="first:border-none border-neutral-300/30">
                <p className="font-display text-3xl md:text-4xl font-medium mb-1 text-gold-shimmer">{stat.value}</p>
                <p className="text-xs uppercase tracking-widest text-neutral-500 font-medium mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reasons grid ── */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="luxe-eyebrow block mb-3">Our Core Values</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium tracking-wide text-neutral-900 mb-4">
              What Sets Us Apart
            </h2>
            <span className="luxe-rule" />
            <p className="text-neutral-500 font-light text-sm max-w-2xl mx-auto mt-4 tracking-wide leading-relaxed">
              We don&apos;t just sell accessories — we provide a journey of handcrafted elegance, creative self-expression, and exceptional service.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REASONS.map((reason, i) => (
              <div
                key={i}
                className="group bg-white p-8 border transition-all duration-300 hover:shadow-[0_24px_50px_-20px_rgba(0,34,22,0.15)] hover:-translate-y-1"
                style={{ borderColor: "#E9E2D5" }}
              >
                <div
                  className="w-12 h-12 border flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
                  style={{ background: "#F7F3EB", borderColor: "#E9E2D5" }}
                >
                  <reason.icon className="h-5 w-5 stroke-[1.5]" style={{ color: reason.color }} />
                </div>
                <h3 className="font-display text-xl font-medium text-neutral-900 mb-3">{reason.title}</h3>
                <p className="text-neutral-500 text-xs font-light leading-relaxed tracking-wide">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Specialties banner ── */}
      <section className="py-12 border-t border-b" style={{ background: "#F7F3EB", borderColor: "#E9E2D5" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="w-12 h-12 border flex items-center justify-center" style={{ background: "#FDFBF7", borderColor: "#E9E2D5", color: "#B08D57" }}>
                <Gift className="h-6 w-6 stroke-[1.5]" />
              </div>
              <div>
                <p className="font-display text-lg font-medium text-neutral-900">Bridal Hair Accessories & Kits</p>
                <p className="text-xs text-neutral-500 font-light tracking-wide mt-0.5">Artisan Hair Ornaments · Bespoke Bridal Sets · Designer Earrings · DIY Accessories</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-center lg:justify-end">
              {["Handcrafted", "Bridal Accessories", "Bespoke Bridal Sets", "Insured Shipping", "Keepsake Box"].map((tag) => (
                <span
                  key={tag}
                  className="px-3.5 py-1.5 text-[10px] tracking-wider uppercase border font-medium"
                  style={{ background: "#FDFBF7", borderColor: "#E9E2D5", color: "#B08D57" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="py-16 md:py-24" style={{ background: "#FDFBF7" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="luxe-eyebrow block mb-3">Happy Clients</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium tracking-wide text-neutral-900 mb-4">
              What Our Patrons Say
            </h2>
            <span className="luxe-rule" />
            <p className="text-neutral-500 font-light text-sm max-w-xl mx-auto mt-4 tracking-wide">Real experiences from style lovers and creators across the world.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REVIEWS.map((review, i) => (
              <div key={i} className="bg-white p-7 border transition-all duration-300 hover:shadow-lg" style={{ borderColor: "#E9E2D5" }}>
                <div className="flex items-center gap-0.5 mb-4">
                  {[...Array(review.rating)].map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-[#B08D57] text-[#B08D57]" />
                  ))}
                </div>
                <p className="text-neutral-600 text-xs font-light leading-relaxed tracking-wide mb-6 italic">&quot;{review.text}&quot;</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-medium text-white text-xs"
                    style={{ background: "linear-gradient(135deg, #003E29, #B08D57)" }}
                  >
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-display font-medium text-sm text-neutral-900">{review.name}</p>
                    <p className="text-[10px] text-neutral-400 tracking-wider uppercase mt-0.5">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 md:py-20 bg-hero-dark border-t" style={{ borderColor: "#E9E2D5" }}>
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
