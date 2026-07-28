import { Lock, Shield, Eye, Database, Cookie, UserCheck, Mail } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | INAAYIKA",
  description: "Read INAAYIKA's Privacy Policy outlining how we collect, use, store, and protect your personal information on www.Inaayika.com.",
};

export default function PrivacyPolicyPage() {
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
            <span className="text-[#D4AF37]">Privacy Policy</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-white/70 max-w-2xl text-base font-sans leading-relaxed">
            At INAAYIKA, we value the trust you place in us when sharing your personal information.
          </p>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="py-12 px-6 font-sans">
        <div className="max-w-5xl mx-auto">
          
          <div className="mb-8 p-5 rounded-2xl bg-[#003E29]/5 border border-[#003E29]/20 text-sm text-gray-800 leading-relaxed">
            <p>
              This Privacy Policy outlines how we collect, use, store, and protect your data when you visit our website www.Inaayika.com or purchase our handcrafted hair accessories and imitation jewelry. By accessing our website and placing an order, you agree to the collection and use of information in accordance with this policy.
            </p>
          </div>

          <div className="rounded-3xl p-8 md:p-12 border space-y-10" style={{ background: "#FDFBF7", borderColor: "#E9E2D5" }}>

            {/* 1. Information We Collect */}
            <div>
              <h2 className="text-xl md:text-2xl mb-4 pb-3 border-b flex items-center gap-3 font-display font-semibold" style={{ color: "#002216", borderColor: "#E9E2D5" }}>
                <span className="w-2 h-7 rounded-full" style={{ background: "#003E29" }} />
                1. Information We Collect
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                We collect information necessary to fulfill your orders, provide customer support, and improve your shopping experience:
              </p>
              <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
                <div className="p-4 rounded-xl border border-gray-200 bg-white">
                  <p className="font-semibold text-[#002216] mb-1">👤 Personal Identifiers:</p>
                  <p>Name, shipping address, billing address, phone number, and email address provided during checkout or account creation.</p>
                </div>
                <div className="p-4 rounded-xl border border-gray-200 bg-white">
                  <p className="font-semibold text-[#002216] mb-1">🛍️ Order &amp; Transaction Details:</p>
                  <p>Items purchased, order history, transaction dates, and preferred payment methods. <em>(Note: We do not collect or store credit card numbers, CVVs, UPI PINs, or bank passwords. All payments are processed through secure, PCI-DSS compliant payment gateways).</em></p>
                </div>
                <div className="p-4 rounded-xl border border-gray-200 bg-white">
                  <p className="font-semibold text-[#002216] mb-1">💻 Technical &amp; Browsing Data:</p>
                  <p>IP address, device type, browser type, and page browsing activity collected automatically via cookies to enhance website navigation and performance.</p>
                </div>
              </div>
            </div>

            {/* 2. How We Use Your Information */}
            <div>
              <h2 className="text-xl md:text-2xl mb-4 pb-3 border-b flex items-center gap-3 font-display font-semibold" style={{ color: "#002216", borderColor: "#E9E2D5" }}>
                <span className="w-2 h-7 rounded-full" style={{ background: "#D4AF37" }} />
                2. How We Use Your Information
              </h2>
              <p className="text-gray-600 text-sm mb-3">We use your data solely for legitimate business purposes, including:</p>
              <ul className="space-y-2 list-disc pl-5 text-sm text-gray-700 leading-relaxed">
                <li>Processing, packing, and dispatching your orders.</li>
                <li>Sending order confirmation updates, tracking numbers, and delivery alerts via SMS, Email, or WhatsApp.</li>
                <li>Verifying Cash on Delivery (COD) orders prior to dispatch.</li>
                <li>Resolving customer queries, returns, exchanges, or transit claims.</li>
                <li>Improving our product range, website performance, and promotional offers.</li>
              </ul>
            </div>

            {/* 3. Data Sharing & Third-Party Services */}
            <div>
              <h2 className="text-xl md:text-2xl mb-4 pb-3 border-b flex items-center gap-3 font-display font-semibold" style={{ color: "#002216", borderColor: "#E9E2D5" }}>
                <span className="w-2 h-7 rounded-full" style={{ background: "#003E29" }} />
                3. Data Sharing &amp; Third-Party Services
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                We <strong>never sell, rent, or trade your personal information</strong> to third-party advertisers. We share your data strictly on a need-to-know basis with trusted partners who assist in operating our store:
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="p-4 rounded-xl border border-gray-200 bg-white">
                  <p className="font-semibold text-[#002216] mb-1">🚚 Logistics & Couriers</p>
                  <p className="text-xs text-gray-600">Shiprocket, Delhivery, Blue Dart, or India Post receive name, address & phone number solely to deliver your package.</p>
                </div>
                <div className="p-4 rounded-xl border border-gray-200 bg-white">
                  <p className="font-semibold text-[#002216] mb-1">💳 Payment Gateways</p>
                  <p className="text-xs text-gray-600">Authorized payment processors (Razorpay, Paytm) handle payment verification securely.</p>
                </div>
                <div className="p-4 rounded-xl border border-gray-200 bg-white">
                  <p className="font-semibold text-[#002216] mb-1">🌐 Cloud & Hosting</p>
                  <p className="text-xs text-gray-600">E-commerce platform infrastructure used to host our online store securely.</p>
                </div>
              </div>
            </div>

            {/* 4. Cookies & Website Analytics */}
            <div>
              <h2 className="text-xl md:text-2xl mb-4 pb-3 border-b flex items-center gap-3 font-display font-semibold" style={{ color: "#002216", borderColor: "#E9E2D5" }}>
                <span className="w-2 h-7 rounded-full" style={{ background: "#D4AF37" }} />
                4. Cookies &amp; Website Analytics
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed mb-3">
                Our website uses cookies (small text files saved on your device) to:
              </p>
              <ul className="space-y-2 list-disc pl-5 text-sm text-gray-700 leading-relaxed">
                <li>Remember items in your shopping cart while you browse.</li>
                <li>Recognize returning visitors for faster checkout.</li>
                <li>Understand website traffic patterns to improve user navigation.</li>
              </ul>
              <p className="text-xs text-gray-500 mt-2">
                You can choose to disable cookies through your browser settings, though some website features (like saving your cart) may not function optimally as a result.
              </p>
            </div>

            {/* 5. Data Security */}
            <div>
              <h2 className="text-xl md:text-2xl mb-4 pb-3 border-b flex items-center gap-3 font-display font-semibold" style={{ color: "#002216", borderColor: "#E9E2D5" }}>
                <span className="w-2 h-7 rounded-full" style={{ background: "#003E29" }} />
                5. Data Security
              </h2>
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-sm text-gray-800 leading-relaxed">
                <p>
                  We implement reasonable administrative, technical, and physical safeguards to keep your personal data secure against unauthorized access, alteration, or disclosure. However, no method of transmission over the Internet or electronic storage is 100% secure, and we encourage you to maintain safe browsing habits.
                </p>
              </div>
            </div>

            {/* 6. Your Rights */}
            <div>
              <h2 className="text-xl md:text-2xl mb-4 pb-3 border-b flex items-center gap-3 font-display font-semibold" style={{ color: "#002216", borderColor: "#E9E2D5" }}>
                <span className="w-2 h-7 rounded-full" style={{ background: "#D4AF37" }} />
                6. Your Rights
              </h2>
              <p className="text-gray-600 text-sm mb-3">You have the right to:</p>
              <ul className="space-y-2 list-disc pl-5 text-sm text-gray-700 leading-relaxed">
                <li>Access, update, or correct your personal contact details in your store profile.</li>
                <li>Request the deletion of your account and customer history from our database (subject to record retention required for legal or tax compliance).</li>
                <li>Opt out of marketing emails or promotional messages at any time by clicking the &quot;Unsubscribe&quot; link or contacting customer support.</li>
              </ul>
            </div>

            {/* 7. Contact Us & Nodal Officer */}
            <div className="pt-4 border-t border-gray-200">
              <h2 className="text-xl font-display font-semibold text-[#002216] mb-3 flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-[#003E29]" /> 7. Contact Us &amp; Nodal Officer
              </h2>
              <p className="text-xs text-gray-600 mb-4">
                In accordance with Indian Information Technology rules and Consumer Protection (E-Commerce) Rules, if you have any questions or grievances regarding your data privacy, please contact:
              </p>
              <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-sm text-gray-800 space-y-1.5">
                <p><strong>Data Protection &amp; Grievance Officer:</strong> Pooja Khan</p>
                <p><strong>Brand Name:</strong> INAAYIKA</p>
                <p><strong>Email:</strong> <a href="mailto:info@inaayika.com" className="text-[#003E29] underline">info@inaayika.com</a></p>
                <p><strong>Contact Location:</strong> New Delhi, India – 110001</p>
                <p className="text-xs text-gray-600 pt-2 border-t border-emerald-200/60">
                  ⏱ <strong>Response Window:</strong> We acknowledge privacy inquiries within 48 hours and work to address them promptly.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
