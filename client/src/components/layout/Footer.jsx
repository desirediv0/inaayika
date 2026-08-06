"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Instagram, Youtube } from "lucide-react";
import { fetchApi } from "@/lib/utils";

const FOOTER_LINK_CLS =
  "text-white/55 hover:text-[#D4AF37] text-[13px] font-light tracking-wide transition-colors duration-300";

const FOOTER_HEADING_CLS =
  "text-[11px] uppercase tracking-[0.35em] mb-7 text-[#B08D57] font-medium";

export const Footer = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchApi("/public/categories")
      .then((res) => {
        setCategories((res.data?.categories || []).slice(0, 5));
      })
      .catch(console.error);
  }, []);

  return (
    <footer className="font-sans" style={{ background: "#002216" }}>
      {/* ── Brand strip ── */}
      <div className="border-b border-white/10 py-14 md:py-18 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 flex flex-col items-center">
          <span className="text-[#D4AF37] text-xs md:text-sm uppercase tracking-[0.4em] font-medium mb-4">
            ✦ Handcrafted with Love, by Pooja Khan ✦
          </span>

          <div className="my-6">
            <img
              src="/logo.png"
              alt="Inaayika Logo"
              className="h-20 md:h-28 w-auto mx-auto object-contain transition-transform duration-300 hover:scale-105"
            />
          </div>

          <p className="text-white/85 text-base md:text-lg font-light tracking-wide max-w-xl mx-auto leading-relaxed mt-2">
            Exclusive designs in handcrafted &amp; imitation jewellery. <br className="hidden sm:inline" />
            <span className="text-[#D4AF37] font-medium">Loved by 50,000+ Happy Customers Across India &amp; Globally.</span>
          </p>
        </div>
      </div>

      {/* ── Main footer grid ── */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12">

          {/* Column 1: About */}
          <div>
            <h4 className={FOOTER_HEADING_CLS}>The Maison</h4>
            <ul className="space-y-3.5">
              <li>
                <Link href="/about" className={FOOTER_LINK_CLS}>
                  Inaayika Inside
                </Link>
              </li>
              <li>
                <Link href="/about" className={FOOTER_LINK_CLS}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className={FOOTER_LINK_CLS}>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faqs" className={FOOTER_LINK_CLS}>
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/why-us" className={FOOTER_LINK_CLS}>
                  Why Choose Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Categories */}
          <div>
            <h4 className={FOOTER_HEADING_CLS}>Collections</h4>
            <ul className="space-y-3.5">
              {categories.length > 0 ? (
                categories.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/category/${c.slug}`} className={`${FOOTER_LINK_CLS} capitalize`}>
                      {c.name}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <Link href="/products" className={FOOTER_LINK_CLS}>
                      Rings
                    </Link>
                  </li>
                  <li>
                    <Link href="/products" className={FOOTER_LINK_CLS}>
                      Accessories
                    </Link>
                  </li>
                  <li>
                    <Link href="/products" className={FOOTER_LINK_CLS}>
                      Earrings
                    </Link>
                  </li>
                  <li>
                    <Link href="/products" className={FOOTER_LINK_CLS}>
                      Bracelets
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Column 3: Campaigns */}
          <div>
            <h4 className={FOOTER_HEADING_CLS}>Discover</h4>
            <ul className="space-y-3.5">
              <li>
                <Link href="/products" className={FOOTER_LINK_CLS}>
                  Handcrafted Jewellery
                </Link>
              </li>
              <li>
                <Link href="/products?sort=createdAt&order=desc" className={FOOTER_LINK_CLS}>
                  New Collection
                </Link>
              </li>
              <li>
                <Link href="/products?search=custom" className={FOOTER_LINK_CLS}>
                  Custom Designs
                </Link>
              </li>
              <li>
                <Link href="/products?sort=featured&order=desc" className={FOOTER_LINK_CLS}>
                  Best Sellers
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Help */}
          <div>
            <h4 className={FOOTER_HEADING_CLS}>Client Care</h4>
            <ul className="space-y-3.5">
              <li>
                <Link href="/shipping-policy" className={FOOTER_LINK_CLS}>
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className={FOOTER_LINK_CLS}>
                  Return &amp; Replacement Policy
                </Link>
              </li>
              <li>
                <Link href="/cancellation-policy" className={FOOTER_LINK_CLS}>
                  Order Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/product-care" className={FOOTER_LINK_CLS}>
                  Product Care Guide
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className={FOOTER_LINK_CLS}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className={FOOTER_LINK_CLS}>
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Social & Contact */}
          <div>
            <h4 className={FOOTER_HEADING_CLS}>Follow Us</h4>
            <div className="flex gap-3 mb-6">
              <a
                href="https://www.instagram.com/all_about_hair_accesories?igsh=MTJ6bXA2YnZ5M2k3Ng%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 flex items-center justify-center border border-[#E1306C]/40 text-[#E1306C] hover:bg-[#E1306C] hover:text-white transition-all duration-300 rounded-lg"
              >
                <Instagram className="h-4 w-4 stroke-[2]" />
              </a>
              <a
                href="https://www.youtube.com/@Inaayikabypoojakhan"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-10 h-10 flex items-center justify-center border border-[#FF0000]/40 text-[#FF0000] hover:bg-[#FF0000] hover:text-white transition-all duration-300 rounded-lg"
              >
                <Youtube className="h-4 w-4 stroke-[2]" />
              </a>
            </div>

            <h4 className={FOOTER_HEADING_CLS.replace("mb-7", "mb-3")}>Contact Us</h4>
            <p className="text-white/55 text-[13px] font-light tracking-wide mb-1">+91 87964 49692</p>
            <p className="text-white/55 text-[13px] font-light tracking-wide break-all">
              <a href="mailto:info@inaayika.com" className="hover:text-[#D4AF37] transition-colors">
                info@inaayika.com
              </a>
            </p>
          </div>

        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-white/10 pb-28 lg:pb-8 pt-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            
            {/* Payment Icons */}
            <div className="flex flex-col items-center md:items-start gap-2">
              <span className="text-[10px] text-white/40 uppercase tracking-[0.25em]">100% Secure Payments</span>
              <div className="flex items-center gap-2.5">
                <img src="/visa.png" alt="Visa" className="h-6 w-auto object-contain bg-white/5 p-1 rounded border border-white/10" />
                <img src="/mc.png" alt="MasterCard" className="h-6 w-auto object-contain bg-white/5 p-1 rounded border border-white/10" />
                <img src="/upi.png" alt="UPI" className="h-6 w-auto object-contain bg-white/5 p-1 rounded border border-white/10" />
                <img src="/paypal.png" alt="PayPal" className="h-6 w-auto object-contain bg-white/5 p-1 rounded border border-white/10" />
              </div>
            </div>

            {/* Right: Copyright + Designed by credit */}
            <div className="flex flex-col items-center md:items-end gap-1.5 text-center md:text-right">
              <div className="text-[11px] text-white/60 tracking-[0.25em] uppercase font-medium">
                © {new Date().getFullYear()} INAAYIKA BY POOJA KHAN
              </div>
              <div className="text-[10px] text-white/40 tracking-[0.25em] uppercase">
                Designed &amp; Developed by{" "}
                <a
                  href="https://desirediv.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D4AF37] hover:underline font-bold"
                >
                  DESIRE DIV
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
