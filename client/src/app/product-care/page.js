import { Sparkles, Droplets, Box, RefreshCw, Scissors, ShieldCheck, Heart, Info } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Product Care Guide | INAAYIKA",
  description: "Learn how to care for your handcrafted INAAYIKA imitation jewelry, embellished hair accessories, scrunchies, claw clips, and flexible hair wire pieces.",
};

const JEWELRY_RULES = [
  {
    icon: Sparkles,
    title: '1. The "Last On, First Off" Rule',
    desc: "Always put your jewelry on AFTER applying makeup, perfume, body lotions, or hairspray. Cosmetics chemicals can dull gemstone shine and break down protective metal plating. When unready, take jewelry off first!",
  },
  {
    icon: Droplets,
    title: "2. Keep Away from Water & Moisture",
    desc: "Take off rings, bracelets, and necklaces before washing hands, taking a shower, or swimming. Avoid wearing jewelry during workouts or high-humidity activities as natural sweat causes plating to tarnish quickly.",
  },
  {
    icon: Box,
    title: "3. Store Separately in Air-Tight Zip Pockets",
    desc: "Never store imitation jewelry loose in damp environments like bathrooms or open trays. Store each piece individually in dry, air-tight zip-lock pouches or soft cotton bags to prevent scratches and tarnish.",
  },
  {
    icon: RefreshCw,
    title: "4. Wipe Gently After Use",
    desc: "Before storing your jewelry away, give it a light wipe with a soft, dry cotton or microfiber cloth to remove residual oils, skin moisture, or dust. Avoid using chemical jewelry cleaners or silver polishing cloths.",
  },
];

const HAIR_CARE_RULES = [
  {
    title: "Spot Cleaning Only",
    items: [
      "Fabric Scrunchies & Bows: Do not machine wash or submerge embellished hair accessories in water. Spot clean small stains using a soft cloth dampened with mild soapy water, then air dry flat in the shade.",
      "Embellished & Pearl Hair Accessories: Never submerge in water—this can weaken the adhesive holding pearls, crystals, or fabric wraps together. Gently dust with a soft, dry brush or cloth.",
    ],
  },
  {
    title: "Maintain Shape & Elasticity",
    items: [
      "Scrunchies: Avoid stretching scrunchies excessively when tying thick hair. Use a plain elastic band first to secure your ponytail, then wrap your decorative scrunchie over it for style!",
      "Claw Clips & Headbands: Keep clips away from heavy weight or pressure inside packed bags to prevent delicate claws or prongs from snapping.",
    ],
  },
  {
    title: "Proper Storage",
    items: [
      "Store headbands on a headband stand or upright in a dedicated drawer away from direct sunlight (which can fade fabric colors over time).",
      "Keep pearl and crystal claw clips stored flat in a soft pouch to protect delicate teeth and stone settings.",
    ],
  },
];

export default function ProductCarePage() {
  return (
    <div className="min-h-screen" style={{ background: "#F7F3EB" }}>

      {/* ── Hero ── */}
      <section
        className="relative py-14 md:py-20 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #002216 0%, #003E29 60%, #005a3c 100%)" }}
      >
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute -top-20 right-0 w-96 h-96 rounded-full" style={{ background: "radial-gradient(circle, #D4AF37, transparent 70%)" }} />
          <div className="absolute bottom-0 left-10 w-64 h-64 rounded-full" style={{ background: "radial-gradient(circle, #D4AF37, transparent 70%)" }} />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-2 text-xs text-white/50 mb-4 tracking-widest uppercase">
            <Link href="/" className="hover:text-white/90 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#D4AF37]">Product Care Guide</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display text-white mb-4">
            Product Care Guide
          </h1>
          <p className="text-white/70 max-w-2xl text-base font-sans leading-relaxed">
            At INAAYIKA, every piece of jewelry and hair accessory is lovingly handcrafted. Follow these care tips to keep your favorite pieces vibrant and gorgeous for years!
          </p>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="py-12 px-6 font-sans">
        <div className="max-w-5xl mx-auto space-y-12">

          {/* Part 1: Imitation & Handcrafted Jewelry Care */}
          <div className="rounded-3xl p-8 md:p-12 border space-y-8" style={{ background: "#FDFBF7", borderColor: "#E9E2D5" }}>
            <div>
              <span className="text-xs uppercase font-semibold tracking-widest text-[#D4AF37] block mb-1">Part 1</span>
              <h2 className="text-2xl md:text-3xl font-display font-semibold text-[#002216]">
                Imitation &amp; Handcrafted Jewelry Care
              </h2>
              <p className="text-gray-600 text-sm mt-2">
                Fashion and plated jewelry naturally react to moisture, perfumes, and air over time. Protect your pieces with these four golden rules:
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {JEWELRY_RULES.map((rule, idx) => (
                <div key={idx} className="p-6 rounded-2xl border border-gray-200 bg-white hover:border-[#D4AF37] transition-all">
                  <div className="w-10 h-10 rounded-xl bg-[#003E29]/10 text-[#003E29] flex items-center justify-center mb-3">
                    <rule.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display font-semibold text-[#002216] text-base mb-2">{rule.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{rule.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Part 2: Handcrafted Hair Accessories Care */}
          <div className="rounded-3xl p-8 md:p-12 border space-y-8" style={{ background: "#FDFBF7", borderColor: "#E9E2D5" }}>
            <div>
              <span className="text-xs uppercase font-semibold tracking-widest text-[#D4AF37] block mb-1">Part 2</span>
              <h2 className="text-2xl md:text-3xl font-display font-semibold text-[#002216]">
                Handcrafted Hair Accessories Care
              </h2>
              <p className="text-gray-600 text-sm mt-2">
                Whether it&apos;s embellished bow clips, embroidered headbands, or pearl claw clips, handcrafted hair pieces need gentle handling to stay intact and fresh:
              </p>
            </div>

            <div className="space-y-6">
              {HAIR_CARE_RULES.map((section, idx) => (
                <div key={idx} className="p-6 rounded-2xl border border-gray-200 bg-white">
                  <h3 className="font-display font-semibold text-[#002216] text-base mb-3 flex items-center gap-2">
                    <span className="w-2 h-5 rounded-full bg-[#003E29]" />
                    {section.title}
                  </h3>
                  <ul className="space-y-2.5 list-disc pl-5 text-sm text-gray-700 leading-relaxed">
                    {section.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Part 3: Flexible Wiring Feature Notice */}
          <div className="rounded-3xl p-8 md:p-10 bg-emerald-900 text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-[#D4AF37] text-emerald-950 flex items-center justify-center flex-shrink-0 font-bold">
                <Sparkles className="h-7 w-7" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-xl font-bold text-[#D4AF37]">
                  Bendable &amp; Adjustable Hair Wiring Flexibility
                </h3>
                <p className="text-emerald-100 text-sm leading-relaxed">
                  At INAAYIKA, many of our handcrafted hair pieces (like floral hair vines, tiaras, embellished hair pins, and flexible hairbands) are artfully crafted using premium, high-quality jewelry wire. Because these pieces are made with flexible wiring, they are intentionally designed to be soft, bendable, and adjustable so you can easily mold them to fit your unique hairstyle, bun, or braid perfectly!
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
