"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchApi, sortCategories } from "@/lib/utils";
import { AlertCircle, ArrowRight, Sparkles, BadgeCheck, Award, Truck, Gem } from "lucide-react";

const getImageUrl = (image) => {
  if (!image) return null;
  if (image.startsWith("http")) return image;
  return `https://desirediv-storage.blr1.digitaloceanspaces.com/${image}`;
};

const CategoryCard = ({ category, index }) => {
  const productCount = category._count?.products || 0;
  const imageUrl = getImageUrl(category.image);

  return (
    <Link href={`/category/${category.slug}`} className="group block h-full">
      <div
        className="relative bg-white rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#B08D57]/40 h-full flex flex-col"
        style={{ borderColor: "#E9E2D5" }}
      >
        {/* Image area */}
        <div className="relative h-44 w-full overflow-hidden flex-shrink-0 bg-[#F7F3EB] flex items-center justify-center">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#F7F3EB] text-[#003E29] p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-[#003E29]/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Gem className="w-6 h-6 text-[#003E29]" />
              </div>
              <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider line-clamp-1">{category.name}</span>
            </div>
          )}

          {/* Product count badge */}
          {productCount > 0 && (
            <div
              className="absolute top-3 right-3 text-white px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#003E29] shadow-md border border-[#D4AF37]/30"
            >
              {productCount} {productCount === 1 ? "Item" : "Items"}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 border-t flex flex-col flex-1 bg-white" style={{ borderColor: "#E9E2D5" }}>
          <h3 className="text-sm font-display font-medium mb-1.5 transition-colors group-hover:text-[#003E29] line-clamp-1 text-neutral-900">
            {category.name}
          </h3>
          <p className="text-neutral-500 text-xs mb-3 line-clamp-2 flex-1 font-sans leading-relaxed">
            {category.description || "Beautifully handcrafted premium accessories and custom designs"}
          </p>
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100">
            <span className="text-[11px] text-neutral-400 font-sans">{productCount} Products</span>
            <span className="flex items-center text-xs font-semibold gap-1 text-[#003E29] group-hover:text-[#D4AF37] group-hover:gap-1.5 transition-all">
              Explore <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const CategoryCardSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden animate-pulse border" style={{ borderColor: "#E9E2D5" }}>
    <div className="h-44 w-full bg-[#F7F3EB]" />
    <div className="p-4 border-t" style={{ borderColor: "#E9E2D5" }}>
      <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-slate-100 rounded w-full mb-1" />
      <div className="h-3 bg-slate-100 rounded w-5/6 mb-3" />
      <div className="flex justify-between pt-2 border-t border-slate-100">
        <div className="h-3 bg-slate-100 rounded w-1/4" />
        <div className="h-3 bg-slate-200 rounded w-1/4" />
      </div>
    </div>
  </div>
);

const STATS = [
  { icon: Sparkles, label: "Curated Collections", dynamic: true, key: "categories", color: "#003E29" },
  { icon: BadgeCheck, label: "Handcrafted Quality", value: "100%", color: "#D4AF37" },
  { icon: Award, label: "Founder Originals", value: "Custom", color: "#003E29" },
  { icon: Truck, label: "Global Express Delivery", value: "Worldwide", color: "#D4AF37" },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApi("/public/categories")
      .then((res) => setCategories(sortCategories(res.data?.categories || [])))
      .catch((err) => setError(err.message || "Failed to load categories"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen font-sans" style={{ background: "#FDFBF7" }}>

      {/* Hero */}
      <section
        className="relative py-14 md:py-20 overflow-hidden text-white"
        style={{ background: "linear-gradient(135deg, #00180F 0%, #002216 50%, #003E29 100%)" }}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 right-0 w-96 h-96 rounded-full opacity-15" style={{ background: "radial-gradient(circle, #D4AF37, transparent 70%)" }} />
          <div className="absolute bottom-0 left-10 w-72 h-72 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #D4AF37, transparent 70%)" }} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5 border uppercase tracking-wider"
            style={{ background: "rgba(212,175,55,0.15)", borderColor: "rgba(212,175,55,0.3)", color: "#D4AF37" }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Artisan Handcrafted Collections
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display text-white mb-4 leading-tight">
            Browse Jewellery Categories
          </h1>
          <p className="text-slate-300 max-w-xl mx-auto text-sm md:text-base font-sans leading-relaxed">
            Explore our curated collections of customised hair accessories, necklaces, earrings, and bespoke jewellery sets.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mt-5 font-sans">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>·</span>
            <span className="text-[#D4AF37] font-medium">Categories</span>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b bg-white" style={{ borderColor: "#E9E2D5" }}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map(({ icon: Icon, label, value, dynamic, key, color }) => (
              <div key={label} className="flex flex-col items-center">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 shadow-sm"
                  style={{ background: color === "#D4AF37" ? "#FDFBF0" : "#E8F3EE", color }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div className="text-xl md:text-2xl font-display font-bold mb-0.5 text-neutral-900">
                  {dynamic ? categories.length || "—" : value}
                </div>
                <div className="text-xs text-neutral-500 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="max-w-7xl mx-auto px-6 mt-6">
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0 w-5 h-5 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800 mb-1">Error Loading Categories</h3>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-10 pb-20">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {[...Array(12)].map((_, i) => <CategoryCardSkeleton key={i} />)}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border" style={{ borderColor: "#E9E2D5" }}>
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-[#003E29]/10">
              <Sparkles className="w-8 h-8 text-[#003E29]" />
            </div>
            <h2 className="text-xl font-display font-medium text-neutral-900 mb-2">No Categories Found</h2>
            <p className="text-neutral-500 mb-6 max-w-md mx-auto text-xs sm:text-sm font-sans">Collections will appear here once added from the admin panel.</p>
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 rounded-xl text-white font-semibold transition-colors hover:bg-[#002216] font-sans bg-[#003E29] shadow-md"
            >
              Browse All Jewellery
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {categories.map((cat, i) => <CategoryCard key={cat.id} category={cat} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}
