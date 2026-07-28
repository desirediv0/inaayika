import { RefreshCw, Video, AlertCircle, ShieldAlert, CheckCircle, Clock, PhoneCall, Mail } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Return & Replacement Policy | INAAYIKA",
  description: "Read INAAYIKA's complete policy for returns, replacements, refunds, non-returnable items, and mandatory 360° unboxing video guidelines.",
};

const EXCLUSION_LIST = [
  "Product damaged while in your possession.",
  "Used, washed, soiled, or without tamper-proof seals and broken ties.",
  "Product not in its original condition.",
  "Missing original packaging, tags, accessories, or retail box.",
  "Missing parts and stones, damaged, altered, or unreadable serial number.",
  "Product different from what was shipped.",
  "Sets or combo products cannot be returned or replaced individually.",
  "Products marked as non-returnable on the individual product page.",
  "Customised products are strictly not returnable.",
];

export default function ReturnPolicyPage() {
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
            <span className="text-[#D4AF37]">Return & Refund Policy</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display text-white mb-4">
            Return &amp; Replacement Policy
          </h1>
          <p className="text-white/70 max-w-2xl text-base font-sans leading-relaxed">
            Transparent guidelines for product returns, replacements, refunds, non-returnable items, and mandatory transit damage claims.
          </p>
        </div>
      </section>

      {/* ── Main Container ── */}
      <section className="py-12 px-6 font-sans">
        <div className="max-w-5xl mx-auto">

          {/* ── Mandatory Unboxing Video Alert Banner ── */}
          <div className="mb-10 rounded-2xl p-6 md:p-8 bg-amber-500/10 border-2 border-[#D4AF37] relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#003E29] text-[#D4AF37] flex items-center justify-center flex-shrink-0">
                <Video className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg font-bold text-[#002216] mb-1">
                  Important Mandatory Unboxing Video Requirement (24 - 48 Hours)
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  If you receive a damaged product or a different product than ordered, you <strong>MUST provide a 360° continuous (uncut/unedited) unboxing video recorded from scratch</strong> to process transit damage claims (whether returnable or non-returnable). Contact INAAYIKA customer care immediately at <strong>+91 8796449692</strong> within <strong>24 - 48 hours of delivery</strong>. Failure to do so may forfeit your claim. The defective or incorrect product will be recalled and replaced or refunded promptly.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl p-8 md:p-12 border space-y-10" style={{ background: "#FDFBF7", borderColor: "#E9E2D5" }}>

            {/* General Rule Notice */}
            <div className="p-5 rounded-2xl bg-[#003E29]/5 border border-[#003E29]/20 text-sm text-gray-800 leading-relaxed">
              <p className="font-semibold text-[#003E29] mb-1 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-[#003E29]" /> General Product Notice:
              </p>
              <p>
                The eligibility for return / replacement / refund is specified on the individual product details page. For all products, the policy outlined on the product page shall take precedence over this general return policy. (Usual claim time window is 24–72 hours). Please refer to the product page for any specific exceptions.
              </p>
            </div>

            {/* Return / Replacement Periods */}
            <div>
              <h2 className="text-xl md:text-2xl mb-4 pb-3 border-b flex items-center gap-3 font-display font-semibold" style={{ color: "#002216", borderColor: "#E9E2D5" }}>
                <span className="w-2 h-7 rounded-full" style={{ background: "#003E29" }} />
                Return / Replacement Periods
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                Products are eligible for return / replacement / refund within the periods specified on the respective product page, except for items explicitly marked as non-returnable.
              </p>
            </div>

            {/* Conditions for Non-Acceptance */}
            <div>
              <h2 className="text-xl md:text-2xl mb-4 pb-3 border-b flex items-center gap-3 font-display font-semibold" style={{ color: "#002216", borderColor: "#E9E2D5" }}>
                <span className="w-2 h-7 rounded-full" style={{ background: "#D4AF37" }} />
                Conditions for Return / Replacement Exclusion
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                Requests for return or replacement are subject to thorough verification by INAAYIKA. Returns / replacements will <strong>NOT</strong> be accepted in the following cases:
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                {EXCLUSION_LIST.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50/40 border border-red-100 text-xs text-gray-800">
                    <ShieldAlert className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Replacement & Refund Process */}
            <div>
              <h2 className="text-xl md:text-2xl mb-4 pb-3 border-b flex items-center gap-3 font-display font-semibold" style={{ color: "#002216", borderColor: "#E9E2D5" }}>
                <span className="w-2 h-7 rounded-full" style={{ background: "#003E29" }} />
                Replacement &amp; Refund Rules
              </h2>
              <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
                
                <div className="p-4 rounded-xl border border-gray-200 bg-white">
                  <p className="font-semibold text-gray-900 mb-1">🔄 Replacement Availability:</p>
                  <p>Replacement depends on product availability (size, colour, design, etc.) and is limited to <strong>one request per product</strong>. If a replacement cannot be processed due to stock constraints, a refund will be issued.</p>
                </div>

                <div className="p-4 rounded-xl border border-gray-200 bg-white">
                  <p className="font-semibold text-gray-900 mb-1">💳 Refund Processing Time:</p>
                  <p>Refunds will be processed via the original payment method within <strong>7–10 days</strong> of product receipt confirmation at our warehouse. INAAYIKA may require additional information or bank documents for verification before initiating the refund.</p>
                </div>

                <div className="p-4 rounded-xl border border-gray-200 bg-white">
                  <p className="font-semibold text-gray-900 mb-1">🎁 Free Items & Coupons:</p>
                  <p>In case of a full refund, any free-of-cost (FOC) items, promotional freebies, or gift coupons included with the order must also be returned.</p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
                  <p className="font-semibold text-[#003E29] mb-1 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#003E29]" /> Reverse Shipping Charges:
                  </p>
                  <p className="text-gray-800">In case of a verified manufacturing defect or dispatch of a different item, all reverse return shipping charges will be fully borne by <strong>INAAYIKA</strong>.</p>
                </div>

              </div>
            </div>

            {/* Customer Support Contact */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="font-display text-base font-semibold text-[#002216] mb-2">Need help with a return or damage claim?</h3>
              <p className="text-xs text-gray-600 mb-4">Reach out to our customer care team with your 360° unboxing video and order details:</p>
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
