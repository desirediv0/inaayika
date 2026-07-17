import {
  Gem, Sparkles, Truck, ShieldCheck,
  HeartHandshake, Crown, Star, ArrowRight,
  Gift, Globe
} from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";

export const metadata = {
  title: "Why Choose Us | Inaayika — Handcrafted Premium Jewellery",
  description:
    "Discover why style lovers across India and beyond choose Inaayika for handcrafted jewellery — artisan craftsmanship, premium materials, bespoke designs, and personal service.",
};

const REASONS = [
  {
    icon: Gem,
    title: "Handcrafted by Artisans",
    description:
      "Every piece is lovingly made by hand under the personal supervision of Pooja Khan — no mass production, only meticulous craftsmanship and soul in every detail.",
  },
  {
    icon: ShieldCheck,
    title: "Premium, Lasting Materials",
    description:
      "We use carefully selected, skin-friendly materials and finishes designed to hold their shine — jewellery meant to be treasured, not replaced.",
  },
  {
    icon: Crown,
    title: "Bespoke & Custom Designs",
    description:
      "Dreaming of something one-of-a-kind? We craft custom hair accessories and jewellery tailored to your occasion, outfit, and personal style.",
  },
  {
    icon: Truck,
    title: "Pan-India & Worldwide Delivery",
    description:
      "Beautifully packed and insured, your order ships across India and around the globe with trackable, reliable delivery partners.",
  },
  {
    icon: Gift,
    title: "Elegant, Gift-Ready Packaging",
    description:
      "Each order arrives in signature Inaayika packaging — ready to gift, or to make unboxing your own treasure feel truly special.",
  },
  {
    icon: HeartHandshake,
    title: "Personal WhatsApp Concierge",
    description:
      "Styling advice, custom enquiries, order updates, and bulk orders — all handled personally over WhatsApp for warm, attentive service.",
  },
];

const REVIEWS = [
  { name: "Ananya Rao", role: "Bride, Bengaluru", rating: 5, text: "My bridal hair accessories were beyond stunning — handcrafted to match my lehenga perfectly. I felt like royalty on my day." },
  { name: "Sneha Kapoor", role: "Customer, Delhi", rating: 5, text: "The detailing is exquisite. You can tell each piece is made with love. Packaging was gorgeous too — felt like a luxury gift." },
  { name: "Meera Iyer", role: "Customer, Mumbai", rating: 5, text: "Ordered a custom set for my sister's wedding. Pooja personally helped me design it over WhatsApp. Absolutely magical." },
  { name: "Ritika Shah", role: "Customer, Ahmedabad", rating: 5, text: "Elegant, unique, and beautifully finished. I've received so many compliments. Will definitely order again." },
  { name: "Fatima Sheikh", role: "Customer, Hyderabad", rating: 5, text: "Fast delivery and the quality is premium. These aren't your ordinary accessories — they're little works of art." },
  { name: "Divya Menon", role: "Customer, Kochi", rating: 5, text: "The DIY kit was such a delight to work with. Beautiful materials and clear guidance. Loved creating my own piece." },
];

const STATS = [
  { value: "50K+", label: "Happy Customers" },
  { value: "Worldwide", label: "Trusted Delivery" },
  { value: "100%", label: "Handcrafted" },
  { value: "Bespoke", label: "Custom Designs" },
];

const COLLECTIONS = ["Necklaces", "Earrings", "Hair Accessories", "Bracelets", "Rings", "DIY Kits"];

export default function WhyUsPage() {
  return (
    <div className="min-h-screen" style={{ background: "#FDFBF7" }}>

      {/* ── Hero ── */}
      <section
        className="relative py-20 md:py-28 overflow-hidden border-b border-[#B08D57]/20"
        style={{ background: "radial-gradient(ellipse 80% 70% at 50% -10%, #0A4430 0%, #003E29 45%, #002216 100%)" }}
      >
        {/* Serif watermark */}
        <div aria-hidden="true" className="absolute inset-x-0 top-6 text-center pointer-events-none select-none overflow-hidden">
          <span className="font-display italic text-[16vw] leading-none text-white/[0.04] whitespace-nowrap">Inaayika</span>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <span className="luxe-eyebrow block mb-5">The Inaayika Promise</span>
          <h1 className="font-display text-5xl md:text-6xl font-medium tracking-wide text-white leading-[1.1] mb-6">
            Why Choose <span className="italic text-gold-shimmer">Inaayika</span>
          </h1>
          <span className="luxe-rule mb-6" />
          <p className="text-white/65 text-base md:text-lg font-light tracking-wide max-w-2xl mx-auto leading-relaxed">
            Handcrafted jewellery designed to make you stand out — created with artistry,
            premium materials, and a personal touch by Pooja Khan.
          </p>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-b" style={{ background: "#F7F3EB", borderColor: "#E9E2D5" }}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:divide-x" style={{ borderColor: "#E9E2D5" }}>
            {STATS.map((stat, i) => (
              <Reveal key={i} delay={i * 0.08} className="md:px-6">
                <p className="font-display text-4xl md:text-5xl font-medium mb-1 text-[#003E29]">{stat.value}</p>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#B08D57]">{stat.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reasons grid ── */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal className="text-center mb-16">
            <span className="luxe-eyebrow block mb-4">What Sets Us Apart</span>
            <h2 className="font-display text-4xl md:text-5xl font-medium tracking-wide text-neutral-900">
              Crafted with Intention
            </h2>
            <span className="luxe-rule mt-5" />
            <p className="text-neutral-500 font-light tracking-wide max-w-2xl mx-auto mt-5 leading-relaxed">
              Not just another jewellery label — here&apos;s why style lovers return to Inaayika,
              piece after piece.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REASONS.map((reason, i) => (
              <Reveal
                key={i}
                delay={(i % 3) * 0.08}
                className="group bg-white p-8 border transition-shadow duration-300 hover:shadow-[0_28px_55px_-30px_rgba(0,34,22,0.28)]"
                style={{ borderColor: "#E9E2D5" }}
              >
                <div
                  className="w-14 h-14 flex items-center justify-center mb-6 border transition-transform duration-300 group-hover:scale-105"
                  style={{ background: "#F7F3EB", borderColor: "#E9E2D5", color: "#B08D57" }}
                >
                  <reason.icon className="h-6 w-6 stroke-[1.5]" />
                </div>
                <h3 className="font-display text-xl font-medium text-neutral-900 mb-2">{reason.title}</h3>
                <p className="text-neutral-500 text-sm font-light leading-relaxed tracking-wide">{reason.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Collections banner ── */}
      <section className="py-14" style={{ background: "#F7F3EB", borderTop: "1px solid #E9E2D5", borderBottom: "1px solid #E9E2D5" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="w-12 h-12 flex items-center justify-center border" style={{ background: "#FDFBF7", borderColor: "#E9E2D5", color: "#B08D57" }}>
                <Sparkles className="h-6 w-6 stroke-[1.5]" />
              </div>
              <div>
                <p className="font-display text-xl font-medium text-neutral-900">Explore Our Collections</p>
                <p className="text-xs text-neutral-500 font-light tracking-wide">Handcrafted jewellery & accessories for every occasion</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {COLLECTIONS.map((tag) => (
                <Link
                  key={tag}
                  href="/products"
                  className="px-4 py-1.5 text-[11px] tracking-[0.15em] uppercase border transition-all"
                  style={{ background: "#FDFBF7", borderColor: "#E9E2D5", color: "#003E29" }}
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="py-16 md:py-24" style={{ background: "#FDFBF7" }}>
        <div className="max-w-7xl mx-auto px-6">
          <Reveal className="text-center mb-16">
            <span className="luxe-eyebrow block mb-4">Loved Across India</span>
            <h2 className="font-display text-4xl md:text-5xl font-medium tracking-wide text-neutral-900">
              What Our Clients Say
            </h2>
            <span className="luxe-rule mt-5" />
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {REVIEWS.map((review, i) => (
              <Reveal key={i} delay={(i % 3) * 0.08} className="bg-white p-7 border transition-shadow duration-300 hover:shadow-[0_28px_55px_-30px_rgba(0,34,22,0.28)]" style={{ borderColor: "#E9E2D5" }}>
                <div className="flex items-center gap-0.5 mb-4">
                  {[...Array(review.rating)].map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-[#B08D57] text-[#B08D57]" />
                  ))}
                </div>
                <p className="text-neutral-600 text-sm font-light leading-relaxed tracking-wide mb-6">&ldquo;{review.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-display text-white text-sm border border-[#B08D57]/40"
                    style={{ background: "#003E29" }}
                  >
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-neutral-900">{review.name}</p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#B08D57]">{review.role}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 md:py-24 relative overflow-hidden border-t border-[#B08D57]/20" style={{ background: "radial-gradient(ellipse 80% 80% at 50% 120%, #0A4430 0%, #003E29 45%, #002216 100%)" }}>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <span className="luxe-eyebrow block mb-5">Begin Your Story</span>
          <h2 className="font-display text-4xl md:text-5xl font-medium tracking-wide text-white mb-5">
            Ready to Find Your Signature Piece?
          </h2>
          <p className="text-white/60 text-base font-light tracking-wide max-w-2xl mx-auto mb-10 leading-relaxed">
            Explore our handcrafted collections, or reach out for a bespoke creation made just for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/products" className="btn-luxe-white">
              Explore the Collection <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
            <a
              href="https://wa.me/918796449692"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-[11px] uppercase font-medium tracking-[0.3em] border transition-all text-[#E7C983] hover:bg-[#E7C983] hover:text-[#002216]"
              style={{ borderColor: "#B08D57" }}
            >
              <Globe className="h-4 w-4" /> Message on WhatsApp
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
