"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Instagram, Youtube } from "lucide-react";
import { fetchApi } from "@/lib/utils";

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
    <footer className="text-[#002216] pt-16 pb-8 border-t font-sans" style={{ background: "#FFFFFF", borderColor: "#E5E7EB" }}>
      {/* ── Main footer grid ── */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">

          {/* Column 1: About */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-6 text-[#003E29]">About Inaayika</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-500 hover:text-[#D4AF37] text-sm transition-colors">
                  Inaayika Inside
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-500 hover:text-[#D4AF37] text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-500 hover:text-[#D4AF37] text-sm transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="text-gray-500 hover:text-[#D4AF37] text-sm transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/why-us" className="text-gray-500 hover:text-[#D4AF37] text-sm transition-colors">
                  Why Choose Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Categories */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-6 text-[#003E29]">Categories</h4>
            <ul className="space-y-3">
              {categories.length > 0 ? (
                categories.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/category/${c.slug}`} className="text-gray-500 hover:text-[#D4AF37] text-sm transition-colors capitalize">
                      {c.name}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <Link href="/products" className="text-gray-500 hover:text-[#D4AF37] text-sm transition-colors">
                      Rings
                    </Link>
                  </li>
                  <li>
                    <Link href="/products" className="text-gray-500 hover:text-[#D4AF37] text-sm transition-colors">
                      Accessories
                    </Link>
                  </li>
                  <li>
                    <Link href="/products" className="text-gray-500 hover:text-[#D4AF37] text-sm transition-colors">
                      Earrings
                    </Link>
                  </li>
                  <li>
                    <Link href="/products" className="text-gray-500 hover:text-[#D4AF37] text-sm transition-colors">
                      Bracelets
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Column 3: Campaigns */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-6 text-[#003E29]">Campaigns</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/products" className="text-gray-500 hover:text-[#D4AF37] text-sm transition-colors">
                  Handcrafted Jewellery
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-500 hover:text-[#D4AF37] text-sm transition-colors">
                  New Collection
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-500 hover:text-[#D4AF37] text-sm transition-colors">
                  Custom Designs
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-500 hover:text-[#D4AF37] text-sm transition-colors">
                  Best Sellers
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Help */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-6 text-[#003E29]">Help</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/shipping-policy" className="text-gray-500 hover:text-[#D4AF37] text-sm transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="text-gray-500 hover:text-[#D4AF37] text-sm transition-colors">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-500 hover:text-[#D4AF37] text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-500 hover:text-[#D4AF37] text-sm transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Social / Follow */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-6 text-[#003E29]">Follow Us</h4>
            <div className="flex gap-3 mb-6">
              <a
                href="https://www.instagram.com/all_about_hair_accesories?igsh=MTJ6bXA2YnZ5M2k3Ng%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-lg flex items-center justify-center hover:opacity-90 transition-all border"
                style={{ background: "#003E29", borderColor: "rgba(212,175,55,0.1)" }}
              >
                <Instagram className="h-5 w-5 text-white" />
              </a>
              <a
                href="https://www.youtube.com/@Inaayikabypoojakhan"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-10 h-10 rounded-lg flex items-center justify-center hover:opacity-90 transition-all border"
                style={{ background: "#003E29", borderColor: "rgba(212,175,55,0.1)" }}
              >
                <Youtube className="h-5 w-5 text-white" />
              </a>
            </div>

            <h4 className="text-sm font-semibold uppercase tracking-wider mb-3 text-[#003E29]">Contact Info</h4>
            <p className="text-gray-500 text-sm mb-1">+91 87964 49692</p>
            <p className="text-gray-500 text-sm break-all">Inaayikabypoojakhan@gmail.com</p>
          </div>

        </div>
      </div>

      {/* Divider */}
      <div className="border-t my-6" style={{ borderColor: "#E5E7EB" }} />

      {/* ── Bottom Bar ── */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Email */}
          <div className="text-sm tracking-widest uppercase order-1 md:order-none" style={{ color: "#003E29" }}>
            <a href="mailto:Inaayikabypoojakhan@gmail.com" className="hover:text-[#D4AF37] transition-colors">
              INAAYIKABYPOOJAKHAN@GMAIL.COM
            </a>
          </div>

          {/* Center: Simple payment representations */}
          <div className="flex items-center gap-2 opacity-85 hover:opacity-100 transition-opacity order-3 md:order-none">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest mr-2">Secure Payments:</span>
            <span className="px-2 py-0.5 rounded border text-[10px] text-zinc-300 font-semibold" style={{ background: "#003E29", borderColor: "rgba(212,175,55,0.2)" }}>VISA</span>
            <span className="px-2 py-0.5 rounded border text-[10px] text-zinc-300 font-semibold" style={{ background: "#003E29", borderColor: "rgba(212,175,55,0.2)" }}>MC</span>
            <span className="px-2 py-0.5 rounded border text-[10px] text-zinc-300 font-semibold" style={{ background: "#003E29", borderColor: "rgba(212,175,55,0.2)" }}>UPI</span>
            <span className="px-2 py-0.5 rounded border text-[10px] text-zinc-300 font-semibold" style={{ background: "#003E29", borderColor: "rgba(212,175,55,0.2)" }}>PAYPAL</span>
          </div>

          {/* Right: Copyright */}
          <div className="text-xs text-gray-400 tracking-wider uppercase order-2 md:order-none">
            COPYRIGHT - INAAYIKA
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
