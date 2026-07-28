import { XCircle, Clock, AlertTriangle, CheckCircle, RefreshCw, Mail, PhoneCall } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Order Cancellation Policy | INAAYIKA",
  description: "Learn about INAAYIKA's order cancellation guidelines for customers and store management, refund timelines, and customized item rules.",
};

const INAAYIKA_CANCELLATION_REASONS = [
  "Product out of stock",
  "Pricing or description errors on website",
  "Restrictions on purchase quantity",
  "Incorrect or incomplete delivery address",
  "Non-serviceability of delivery location by courier partners",
  "Any other operational reason beyond control",
  "Similar material for customisation is not available",
];

export default function CancellationPolicyPage() {
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
            <span className="text-[#D4AF37]">Order Cancellation Policy</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display text-white mb-4">
            Order Cancellation Policy
          </h1>
          <p className="text-white/70 max-w-2xl text-base font-sans leading-relaxed">
            Clear guidelines regarding free pre-dispatch cancellations, shipped order rules, customized items, and store-initiated cancellations.
          </p>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="py-12 px-6 font-sans">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-3xl p-8 md:p-12 border space-y-10" style={{ background: "#FDFBF7", borderColor: "#E9E2D5" }}>

            {/* Section 1: Cancellation by Customer */}
            <div>
              <h2 className="text-xl md:text-2xl mb-4 pb-3 border-b flex items-center gap-3 font-display font-semibold" style={{ color: "#002216", borderColor: "#E9E2D5" }}>
                <span className="w-2 h-7 rounded-full" style={{ background: "#003E29" }} />
                Order Cancellation by Customer
              </h2>
              
              <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
                
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
                  <p className="font-semibold text-[#003E29] mb-1 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#003E29]" /> Pre-Dispatch Free Cancellation:
                  </p>
                  <p>You can cancel your order <strong>before it is dispatched</strong> by logging into your INAAYIKA account dashboard. Pre-dispatch cancellation is completely free of charge.</p>
                </div>

                <div className="p-4 rounded-xl border border-gray-200 bg-white">
                  <p className="font-semibold text-gray-900 mb-1">📦 Shipped Orders Protocol:</p>
                  <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
                    <li>If your order has already been shipped, it <strong>cannot be cancelled</strong> directly.</li>
                    <li>If a customer cancels or refuses an order after it has been shipped, <strong>shipping charges will be borne by the customer for both sides</strong> (dispatch freight and return pickup fees).</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-gray-200 bg-white">
                  <p className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#D4AF37]" /> Refund Timeline for Prepaid Orders:
                  </p>
                  <p>For prepaid orders cancelled before shipping, the full amount will be refunded to the original payment source within <strong>4–5 business days</strong> of the cancellation request.</p>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-300">
                  <p className="font-semibold text-amber-900 mb-1 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-700" /> Customized Items Special Rule:
                  </p>
                  <p className="text-gray-800">In any case of customized or handcrafted personalized items, cancellation can <strong>ONLY be requested if reported within 24 hours</strong> from the order placement date & time.</p>
                </div>

              </div>
            </div>

            {/* Section 2: Cancellation by INAAYIKA */}
            <div>
              <h2 className="text-xl md:text-2xl mb-4 pb-3 border-b flex items-center gap-3 font-display font-semibold" style={{ color: "#002216", borderColor: "#E9E2D5" }}>
                <span className="w-2 h-7 rounded-full" style={{ background: "#D4AF37" }} />
                Order Cancellation by INAAYIKA
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                Under rare operational circumstances, an order may be cancelled by INAAYIKA due to reasons including but not limited to:
              </p>
              
              <div className="grid md:grid-cols-2 gap-3 mb-6">
                {INAAYIKA_CANCELLATION_REASONS.map((reason, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3.5 rounded-xl bg-white border border-gray-200 text-xs text-gray-800 font-medium">
                    <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-sm">
                <p className="font-semibold text-[#003E29] mb-1 flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-[#003E29]" /> Automatic Store Refund Guarantee:
                </p>
                <p className="text-gray-800">
                  Refunds for any prepaid orders cancelled by INAAYIKA will be processed back to the original payment method automatically within <strong>4–5 days</strong>.
                </p>
              </div>
            </div>

            {/* Support */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="font-display text-base font-semibold text-[#002216] mb-2">Need assistance with order cancellation?</h3>
              <p className="text-xs text-gray-600 mb-4">Contact our support team immediately before dispatch:</p>
              <div className="flex flex-wrap items-center gap-6 text-sm font-semibold">
                <a href="tel:+918796449692" className="flex items-center gap-2 text-[#003E29] hover:underline">
                  <PhoneCall className="h-4 w-4 text-[#D4AF37]" /> +91 8796449692
                </a>
                <a href="mailto:info@inaayika.com" className="flex items-center gap-2 text-[#003E29] hover:underline">
                  <Mail className="h-4 w-4 text-[#D4AF37]" /> info@inaayika.com
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
