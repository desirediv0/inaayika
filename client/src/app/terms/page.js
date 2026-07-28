import { Scale, Sparkles, ShieldAlert, CreditCard, Lock, AlertTriangle, FileText, UserCheck } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions | INAAYIKA",
  description: "Read INAAYIKA's official Terms & Conditions governing website usage, handcrafted disclaimers, orders, intellectual property, and governing law.",
};

export default function TermsPage() {
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
            <span className="text-[#D4AF37]">Terms &amp; Conditions</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display text-white mb-4">
            Terms &amp; Conditions
          </h1>
          <p className="text-white/70 max-w-2xl text-base font-sans leading-relaxed">
            Welcome to INAAYIKA! These Terms & Conditions (&quot;Terms&quot;) govern your use of our website www.Inaayika.com and the purchase of any products from our online store.
          </p>
        </div>
      </section>

      {/* ── Main Policy Content ── */}
      <section className="py-12 px-6 font-sans">
        <div className="max-w-5xl mx-auto">
          
          <div className="mb-8 p-5 rounded-2xl bg-[#003E29]/5 border border-[#003E29]/20 text-sm text-gray-800 leading-relaxed">
            <p>
              By accessing, browsing, or making a purchase on this website, you agree to be bound by these Terms and our associated policies (including our Return & Replacement Policy, Shipping Policy, and Privacy Policy). Please read them carefully before placing an order.
            </p>
          </div>

          <div className="rounded-3xl p-8 md:p-12 border space-y-10" style={{ background: "#FDFBF7", borderColor: "#E9E2D5" }}>

            {/* 1. General & Business Ownership */}
            <div>
              <h2 className="text-xl md:text-2xl mb-4 pb-3 border-b flex items-center gap-3 font-display font-semibold" style={{ color: "#002216", borderColor: "#E9E2D5" }}>
                <span className="w-2 h-7 rounded-full" style={{ background: "#003E29" }} />
                1. General &amp; Business Ownership
              </h2>
              <ul className="space-y-2.5 list-disc pl-5 text-sm text-gray-700 leading-relaxed">
                <li>This website is owned, operated, and maintained by <strong>INAAYIKA</strong>, headquartered in New Delhi, India.</li>
                <li>The terms &quot;we&quot;, &quot;us&quot;, and &quot;our&quot; refer to INAAYIKA. The terms &quot;you&quot;, &quot;user&quot;, and &quot;customer&quot; refer to any individual accessing or ordering from this website.</li>
                <li>We reserve the right to modify or update these Terms at any time without prior notice. Continued use of the website following changes constitutes acceptance of the revised Terms.</li>
              </ul>
            </div>

            {/* 2. Product Disclaimers & Accuracy */}
            <div>
              <h2 className="text-xl md:text-2xl mb-4 pb-3 border-b flex items-center gap-3 font-display font-semibold" style={{ color: "#002216", borderColor: "#E9E2D5" }}>
                <span className="w-2 h-7 rounded-full" style={{ background: "#D4AF37" }} />
                2. Product Disclaimers &amp; Accuracy
              </h2>
              <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
                <div className="p-4 rounded-xl border border-gray-200 bg-white">
                  <h4 className="font-semibold text-[#002216] mb-1 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#D4AF37]" /> Handmade Uniqueness:
                  </h4>
                  <p>Our hair accessories and jewelry are handcrafted or hand-assembled. Minor variations in finish, stone placement, thread work, or embellishments are natural characteristics of handcrafted items and are not considered defects.</p>
                </div>
                <div className="p-4 rounded-xl border border-gray-200 bg-white">
                  <h4 className="font-semibold text-[#002216] mb-1">🎨 Color Accuracy:</h4>
                  <p>We make every effort to display product colors and textures as accurately as possible. However, actual colors may slightly vary depending on screen brightness, monitor settings, or professional lighting used during photography.</p>
                </div>
              </div>
            </div>

            {/* 3. Material & Tarnish Disclaimer */}
            <div>
              <h2 className="text-xl md:text-2xl mb-4 pb-3 border-b flex items-center gap-3 font-display font-semibold" style={{ color: "#002216", borderColor: "#E9E2D5" }}>
                <span className="w-2 h-7 rounded-full" style={{ background: "#003E29" }} />
                3. Material &amp; Tarnish Disclaimer
              </h2>
              <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 text-sm text-gray-800 leading-relaxed space-y-2">
                <p>Our products consist of imitation jewelry, alloy metals, electroplated finishes, synthetic pearls, and fabric components.</p>
                <p>Plated metals may naturally oxidize or tarnish over time when exposed to moisture, perfumes, skin oils, or water. Proper care as outlined in our <strong>Product Care Guide</strong> is essential to prolong product luster.</p>
              </div>
            </div>

            {/* 4. Orders, Pricing & Payment */}
            <div>
              <h2 className="text-xl md:text-2xl mb-4 pb-3 border-b flex items-center gap-3 font-display font-semibold" style={{ color: "#002216", borderColor: "#E9E2D5" }}>
                <span className="w-2 h-7 rounded-full" style={{ background: "#D4AF37" }} />
                4. Orders, Pricing &amp; Payment
              </h2>
              <ul className="space-y-3 list-disc pl-5 text-sm text-gray-700 leading-relaxed">
                <li><strong>Pricing:</strong> All prices listed on the website are in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise.</li>
                <li><strong>Price &amp; Inventory Errors:</strong> In the rare event that a product is listed at an incorrect price or with inaccurate stock details due to a typographical or system error, we reserve the right to cancel or refuse any orders placed for that product. If your payment has already been processed, a full refund will be issued.</li>
                <li><strong>Payment Gateways:</strong> Online payments are securely processed through authorized Indian payment gateways (such as Razorpay, UPI, credit/debit card, net banking). We do not store your financial details or banking credentials on our servers.</li>
              </ul>
            </div>

            {/* 5. Intellectual Property Rights */}
            <div>
              <h2 className="text-xl md:text-2xl mb-4 pb-3 border-b flex items-center gap-3 font-display font-semibold" style={{ color: "#002216", borderColor: "#E9E2D5" }}>
                <span className="w-2 h-7 rounded-full" style={{ background: "#003E29" }} />
                5. Intellectual Property Rights
              </h2>
              <div className="p-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 leading-relaxed space-y-2">
                <p>All content featured on this website—including brand names, logos, handmade product design, names, website graphics, photography, video clips, layout, and written text—is the exclusive intellectual property of <strong>INAAYIKA</strong>.</p>
                <p>You may not copy, reproduce, modify, distribute, or commercially exploit any content, images, or designs from this website without explicit written consent from us.</p>
              </div>
            </div>

            {/* 6. Prohibited Uses */}
            <div>
              <h2 className="text-xl md:text-2xl mb-4 pb-3 border-b flex items-center gap-3 font-display font-semibold" style={{ color: "#002216", borderColor: "#E9E2D5" }}>
                <span className="w-2 h-7 rounded-full" style={{ background: "#D4AF37" }} />
                6. Prohibited Uses
              </h2>
              <p className="text-gray-600 text-sm mb-3">When using this website, you agree NOT to:</p>
              <ul className="space-y-2 list-disc pl-5 text-sm text-gray-700 leading-relaxed">
                <li>Provide false, inaccurate, or misleading contact or shipping details.</li>
                <li>Attempt to bypass website security, upload malicious code, or disrupt server functionality.</li>
                <li>Place fraudulent orders or misuse Cash on Delivery (COD) services.</li>
              </ul>
            </div>

            {/* 7. Governing Law & Dispute Resolution */}
            <div>
              <h2 className="text-xl md:text-2xl mb-4 pb-3 border-b flex items-center gap-3 font-display font-semibold" style={{ color: "#002216", borderColor: "#E9E2D5" }}>
                <span className="w-2 h-7 rounded-full" style={{ background: "#003E29" }} />
                7. Governing Law &amp; Dispute Resolution
              </h2>
              <div className="p-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 leading-relaxed space-y-2">
                <p>These Terms shall be governed by and construed in accordance with the laws of India.</p>
                <p>Any legal claims, disputes, or proceedings arising from or related to the use of this website or orders placed through it shall be subject to the exclusive jurisdiction of the courts located in <strong>New Delhi, India</strong>.</p>
              </div>
            </div>

            {/* 8. Grievance Redressal Officer */}
            <div className="pt-4 border-t border-gray-200">
              <h2 className="text-xl font-display font-semibold text-[#002216] mb-3 flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-[#003E29]" /> 8. Grievance Redressal Officer
              </h2>
              <p className="text-xs text-gray-600 mb-4">
                In compliance with the Consumer Protection (E-Commerce) Rules, 2020, the details of our Grievance Redressal Officer are provided below:
              </p>
              <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-sm text-gray-800 space-y-1.5">
                <p><strong>Name:</strong> Pooja Khan</p>
                <p><strong>Designation:</strong> Founder / Grievance Officer</p>
                <p><strong>Email:</strong> <a href="mailto:info@inaayika.com" className="text-[#003E29] underline">info@inaayika.com</a></p>
                <p><strong>Contact Address:</strong> New Delhi, India – 110001</p>
                <p className="text-xs text-gray-600 pt-2 border-t border-emerald-200/60">
                  ⏱ <strong>Response Time:</strong> We acknowledge grievances within 48 hours and aim to resolve them within 15 business days.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
