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
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-14 text-center">
          <p className="luxe-eyebrow mb-4">Handcrafted with love, by Pooja Khan</p>
          <p className="font-display text-3xl md:text-4xl font-medium tracking-[0.18em] uppercase text-gold-shimmer">
            Inaayika
          </p>
          <span className="luxe-rule mt-6" />
          <p className="text-white/50 text-sm font-light tracking-wide max-w-md mx-auto mt-5 leading-relaxed">
            Exquisite handcrafted jewellery, designed to make every moment
            unforgettable — from our atelier to your doorstep, worldwide.
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
                <Link href="/products" className={FOOTER_LINK_CLS}>
                  New Collection
                </Link>
              </li>
              <li>
                <Link href="/products" className={FOOTER_LINK_CLS}>
                  Custom Designs
                </Link>
              </li>
              <li>
                <Link href="/products" className={FOOTER_LINK_CLS}>
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
                  Return Policy
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

          {/* Column 5: Social / Follow */}
          <div>
            <h4 className={FOOTER_HEADING_CLS}>Follow Us</h4>
            <div className="flex gap-3 mb-8">
              <a
                href="https://www.instagram.com/all_about_hair_accesories?igsh=MTJ6bXA2YnZ5M2k3Ng%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 flex items-center justify-center border border-white/20 text-white/70 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300"
              >
                <Instagram className="h-4 w-4 stroke-[1.5]" />
              </a>
              <a
                href="https://www.youtube.com/@Inaayikabypoojakhan"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-10 h-10 flex items-center justify-center border border-white/20 text-white/70 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300"
              >
                <Youtube className="h-4 w-4 stroke-[1.5]" />
              </a>
            </div>

            <h4 className={FOOTER_HEADING_CLS.replace("mb-7", "mb-4")}>Contact</h4>
            <p className="text-white/55 text-[13px] font-light tracking-wide mb-1.5">+91 87964 49692</p>
            <p className="text-white/55 text-[13px] font-light tracking-wide break-all">
              Inaayikabypoojakhan@gmail.com
            </p>
          </div>

        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            {/* Left: Email */}
            <div className="text-[11px] tracking-[0.25em] uppercase order-1 md:order-none">
              <a
                href="mailto:Inaayikabypoojakhan@gmail.com"
                className="text-white/45 hover:text-[#D4AF37] transition-colors"
              >
                Inaayikabypoojakhan@gmail.com
              </a>
            </div>

            {/* Center: Simple payment representations */}
            <div className="flex items-center gap-2 order-3 md:order-none">
              <span className="text-[10px] text-white/35 uppercase tracking-[0.25em] mr-2">Secure Payments</span>
              <span className="px-2 py-0.5 border border-white/15 text-[10px] text-white/50 tracking-wider">VISA</span>
              <span className="px-2 py-0.5 border border-white/15 text-[10px] text-white/50 tracking-wider">MC</span>
              <span className="px-2 py-0.5 border border-white/15 text-[10px] text-white/50 tracking-wider">UPI</span>
              <span className="px-2 py-0.5 border border-white/15 text-[10px] text-white/50 tracking-wider">PAYPAL</span>
            </div>

            {/* Right: Copyright */}
            <div className="text-[11px] text-white/35 tracking-[0.25em] uppercase order-2 md:order-none">
              © {new Date().getFullYear()} Inaayika
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
