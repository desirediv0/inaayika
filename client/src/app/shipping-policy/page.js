import { Truck, Package, Clock, ShieldCheck, MapPin, RefreshCw, AlertTriangle, PhoneCall, Mail } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Shipping & Delivery Policy | INAAYIKA",
  description: "Learn about INAAYIKA's shipping timelines, delivery attempts, RTO charges, order tracking, and transit damage protocols.",
};

const HIGHLIGHT_CARDS = [
  {
    icon: Clock,
    color: "#003E29",
    title: "Processing & Dispatch",
    description: "Ready-to-ship stock dispatches in 24–48 hours. Handmade & custom orders take 3–5 business days to craft before shipping.",
  },
  {
    icon: Truck,
    color: "#D4AF37",
    title: "Domestic Delivery",
    description: "Estimated domestic transit time is 3–7 working days across India, depending on metro vs. non-metro pin codes.",
  },
  {
    icon: Package,
    color: "#003E29",
    title: "Automated Tracking",
    description: "Once dispatched, you will receive an automated tracking link via SMS, Email, and WhatsApp to track your parcel live.",
  },
  {
    icon: ShieldCheck,
    color: "#D4AF37",
    title: "Safe Courier Partners",
    description: "Delivered securely via top express partners (Shiprocket, Delhivery, Blue Dart) with up to 2 delivery attempts.",
  },
];

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen" style={{ background: "#F7F3EB" }}>

      {/* ── Hero Header ── */}
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
            <span className="text-[#D4AF37]">Shipping & Delivery Policy</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display text-white mb-4">
            Shipping &amp; Delivery Policy
          </h1>
          <p className="text-white/70 max-w-2xl text-base font-sans leading-relaxed">
            Everything you need to know about processing timelines, courier delivery attempts, order tracking, and transit protection at INAAYIKA.
          </p>
        </div>
      </section>

      {/* ── Highlight Cards Grid ── */}
      <section className="py-12 px-6 font-sans">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {HIGHLIGHT_CARDS.map((card, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 border transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                style={{ background: "#FDFBF7", borderColor: "#E9E2D5" }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${card.color}15` }}
                >
                  <card.icon className="h-6 w-6" style={{ color: card.color }} />
                </div>
                <h3 className="font-display text-base font-semibold mb-2" style={{ color: "#002216" }}>{card.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>

          {/* ── Main Policy Content Sections ── */}
          <div className="rounded-3xl p-8 md:p-12 border space-y-10" style={{ background: "#FDFBF7", borderColor: "#E9E2D5" }}>

            {/* Section 1: Processing & Delivery Timelines */}
            <div>
              <h2 className="text-xl md:text-2xl mb-4 pb-3 border-b flex items-center gap-3 font-display font-semibold" style={{ color: "#002216", borderColor: "#E9E2D5" }}>
                <span className="w-2 h-7 rounded-full" style={{ background: "#003E29" }} />
                Processing Time & Delivery Timelines
              </h2>
              <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
                <div className="bg-emerald-50/60 border border-emerald-200/60 p-4 rounded-xl">
                  <p className="font-semibold text-[#003E29] mb-1">⚡ Processing Time:</p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li><strong>Ready-to-Ship Stock:</strong> Dispatched within <strong>24–48 hours</strong> of placing your order.</li>
                    <li><strong>Handmade / Custom Orders:</strong> Require <strong>3–5 business days</strong> to carefully craft before dispatch.</li>
                  </ul>
                </div>

                <div className="bg-amber-50/60 border border-amber-200/60 p-4 rounded-xl">
                  <p className="font-semibold text-amber-900 mb-1">🚚 Delivery Timelines &amp; Free Shipping:</p>
                  <p className="mb-1">Estimated domestic transit time is <strong>3–7 working days</strong>, depending on metro vs. non-metro pin codes across India.</p>
                  <p className="text-xs font-semibold text-[#003E29]">🎉 Free Delivery is available on all orders above ₹5000 across India!</p>
                </div>

                <div className="p-4 rounded-xl border border-gray-200 bg-white">
                  <p className="font-semibold text-gray-900 mb-1">📦 For Bulk Orders:</p>
                  <p>Delivery timelines for bulk or corporate orders can be custom discussed via INAAYIKA official email (<a href="mailto:info@inaayika.com" className="text-[#003E29] underline font-medium">info@inaayika.com</a>) or WhatsApp (<a href="https://wa.me/918796449692" target="_blank" rel="noopener noreferrer" className="text-[#003E29] underline font-medium">+91-8796449692</a>).</p>
                </div>

                <div className="p-4 rounded-xl border border-gray-200 bg-white">
                  <p className="font-semibold text-gray-900 mb-1">📱 Order Tracking:</p>
                  <p>Once your order is handed over to our courier delivery partner, you will receive an automated tracking link via <strong>SMS, Email, and WhatsApp</strong> to follow your parcel in real-time.</p>
                </div>
              </div>
            </div>

            {/* Section 2: Delivery Attempts & Failed Deliveries */}
            <div>
              <h2 className="text-xl md:text-2xl mb-4 pb-3 border-b flex items-center gap-3 font-display font-semibold" style={{ color: "#002216", borderColor: "#E9E2D5" }}>
                <span className="w-2 h-7 rounded-full" style={{ background: "#D4AF37" }} />
                Delivery Attempts & Failed Deliveries
              </h2>
              <div className="grid md:grid-cols-2 gap-5 text-sm">

                <div className="p-5 rounded-2xl border border-gray-200 bg-white">
                  <h4 className="font-semibold text-[#002216] mb-2 flex items-center gap-2">
                    <Truck className="h-4 w-4 text-[#003E29]" /> Multiple Delivery Attempts
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Our courier partner will attempt delivery <strong>up to 2 times</strong>. They will also try contacting you via the mobile number provided at checkout.
                  </p>
                </div>

                <div className="p-5 rounded-2xl border border-gray-200 bg-white">
                  <h4 className="font-semibold text-[#002216] mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#D4AF37]" /> Address & Phone Precision
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Please ensure your shipping address, landmark, and phone number are complete and correct. Incorrect contact information leads to parcel holds or delivery failure.
                  </p>
                </div>

              </div>
            </div>

            {/* Section 3: RTO & Reshipping Policy */}
            <div>
              <h2 className="text-xl md:text-2xl mb-4 pb-3 border-b flex items-center gap-3 font-display font-semibold" style={{ color: "#002216", borderColor: "#E9E2D5" }}>
                <span className="w-2 h-7 rounded-full" style={{ background: "#003E29" }} />
                Return to Origin (RTO) & Reshipping Fee
              </h2>
              <div className="p-5 rounded-2xl bg-red-50/50 border border-red-200 text-sm text-gray-800 leading-relaxed">
                <p className="font-semibold text-red-900 mb-1 flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-red-700" /> Return to Origin (RTO) Charges:
                </p>
                <p>
                  If a parcel is returned to us due to an incorrect address, unreachability, or customer refusal at doorstep, a <strong>re-shipping fee of ₹100</strong> will apply to dispatch the package again.
                </p>
              </div>
            </div>

            {/* Section 4: Transit Delays & Damaged Shipments */}
            <div>
              <h2 className="text-xl md:text-2xl mb-4 pb-3 border-b flex items-center gap-3 font-display font-semibold" style={{ color: "#002216", borderColor: "#E9E2D5" }}>
                <span className="w-2 h-7 rounded-full" style={{ background: "#D4AF37" }} />
                Transit Delays & Damaged Shipments
              </h2>
              <div className="space-y-4 text-sm text-gray-700 leading-relaxed">

                <div className="p-5 rounded-2xl border border-gray-200 bg-white">
                  <h4 className="font-semibold text-[#002216] mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#003E29]" /> Operational Delays
                  </h4>
                  <p className="text-gray-600">
                    While we strive to meet all estimated timelines, external factors like severe weather, festival rush, local lockdowns, or courier network disruptions may occasionally cause slight delays beyond our control.
                  </p>
                </div>

                <div className="p-5 rounded-2xl border border-amber-300 bg-amber-50/40">
                  <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-700" /> Transit Damage Protocol
                  </h4>
                  <p className="text-gray-700 mb-3">
                    If your parcel arrives severely tampered with or crushed from the outside, please <strong>refuse to accept it</strong> and take a clear photo of the damaged outer box.
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold pt-2 border-t border-amber-200">
                    <a href="tel:+918796449692" className="flex items-center gap-1.5 text-[#003E29] hover:underline">
                      <PhoneCall className="h-3.5 w-3.5" /> +91-8796449692
                    </a>
                    <a href="mailto:info@inaayika.com" className="flex items-center gap-1.5 text-[#003E29] hover:underline">
                      <Mail className="h-3.5 w-3.5" /> Info@Inaayika.com
                    </a>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
