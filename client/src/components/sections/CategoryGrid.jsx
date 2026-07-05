"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchApi, sortCategories } from "@/lib/utils";
import Reveal from "@/components/ui/Reveal";

/* ─── fallback gradients for jewelry theme ─────────────────── */
const getCategoryBg = (index) => {
  const gradients = [
    "from-stone-900 to-neutral-950 text-white", // Charcoal dark luxury
    "from-amber-100 via-amber-50 to-orange-100 text-stone-900", // Soft Gold / Champagne
    "from-zinc-800 to-zinc-950 text-white", // Deep Silver/Steel
    "from-rose-50 via-rose-100 to-amber-100 text-stone-900", // Rose Gold / Peach
    "from-neutral-100 to-stone-200 text-stone-900", // Warm cream/white
    "from-emerald-950 via-teal-950 to-neutral-950 text-white" // Emerald Green luxury
  ];
  return gradients[index % gradients.length];
};

/* ─── card: flat editorial tile + serif caption below ──────────────── */
const CategoryCard = ({ category, index }) => {
  const bgCls = getCategoryBg(index);
  const firstLetter = category.name ? category.name.charAt(0).toUpperCase() : "";

  return (
    <div className="group cursor-pointer">
      {/* Image tile */}
      <div
        className={`
          img-shine relative w-full aspect-[4/5] overflow-hidden
          border border-transparent group-hover:border-[#B08D57]/40
          transition-all duration-500 ease-out
          bg-gradient-to-br ${bgCls}
        `}
      >
        {category.image ? (
          <Image
            src={category.image}
            alt={category.name || "Category"}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-[1.07] transition-transform duration-[1400ms] ease-out"
            loading="lazy"
          />
        ) : (
          /* typographic fallback watermark */
          <div className="absolute inset-0 flex items-center justify-center select-none overflow-hidden opacity-10">
            <span className="font-display text-[10rem] tracking-tighter">
              {firstLetter}
            </span>
          </div>
        )}

        {/* soft scrim on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Discover label rises on hover */}
        <div className="absolute inset-x-0 bottom-5 flex justify-center opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
          <span className="text-[10px] uppercase tracking-[0.35em] text-white border-b border-[#E7C983] pb-1">
            Discover
          </span>
        </div>
      </div>

      {/* Caption below tile */}
      <div className="text-center pt-4">
        <h3 className="font-display text-lg sm:text-xl font-medium tracking-wide text-neutral-900 group-hover:text-[#003E29] transition-colors">
          {category.name}
        </h3>
        <p className="text-[9px] tracking-[0.35em] mt-1 uppercase" style={{ color: "#B08D57" }}>
          {category.count > 0 ? `${category.count} Designs` : "Explore"}
        </p>
      </div>
    </div>
  );
};

/* ─── skeleton ────────────────────────────────────────────────────────── */
const SkeletonLoader = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
    {[...Array(4)].map((_, i) => (
      <div
        key={i}
        className="w-full aspect-[4/5] bg-gradient-to-br from-[#F7F3EB] to-[#EFE8DA] animate-pulse"
      />
    ))}
  </div>
);

/* ─── main ────────────────────────────────────────────────────────────── */
const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchApi("/public/categories");
        if (response.success && response.data?.categories) {
          setCategories(sortCategories(response.data.categories));
        } else {
          setError(response.message || "Failed to fetch categories");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch categories"
        );
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    window.location.reload();
  };

  const sectionCls = `relative py-16 md:py-20 overflow-hidden border-b`;
  const sectionStyle = { background: "#FDFBF7", borderColor: "#E9E2D5" };

  const Header = () => (
    <div className="text-center mb-14">
      <span className="luxe-eyebrow block mb-4">
        The Design Gallery
      </span>
      <h2 className="font-display text-4xl sm:text-5xl font-medium tracking-wide text-neutral-900">
        Shop by Category
      </h2>
      <span className="luxe-rule mt-5" />
      <p className="mt-5 text-neutral-500 text-xs sm:text-sm font-light tracking-wide max-w-md mx-auto leading-relaxed">
        Explore our collection of meticulously handcrafted premium jewellery, designed for every style and occasion.
      </p>
    </div>
  );

  if (loading) {
    return (
      <section className={sectionCls} style={sectionStyle}>
        <div className="container max-w-7xl mx-auto px-4">
          <Header />
          <SkeletonLoader />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={sectionCls} style={sectionStyle}>
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center py-14">
            <p className="text-red-500 font-medium mb-4">Error: {error}</p>
            <button
              onClick={handleRetry}
              className="px-5 py-2.5 bg-neutral-900 text-white text-xs font-semibold tracking-widest uppercase rounded-lg hover:bg-neutral-800 transition-colors shadow-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <section className={sectionCls} style={sectionStyle}>
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center py-14">
            <p className="text-neutral-400 font-medium">
              No categories available at the moment
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={sectionCls} style={sectionStyle}>
      <div className="container max-w-7xl mx-auto px-4">
        <Reveal>
          <Header />
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-7">
          {categories.map((category, index) => (
            <Reveal key={category.id} delay={(index % 4) * 0.08}>
              <Link
                href={`/category/${category.slug}`}
                className="block"
              >
                <CategoryCard category={category} index={index} />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;

