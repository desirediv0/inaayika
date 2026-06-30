"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchApi, sortCategories } from "@/lib/utils";

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

/* ─── card: full-bleed image + premium glassmorphic tag ──────────────── */
const CategoryCard = ({ category, index }) => {
  const bgCls = getCategoryBg(index);
  const firstLetter = category.name ? category.name.charAt(0).toUpperCase() : "";

  return (
    <div
      className={`
        relative w-full aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer
        group shadow-sm hover:shadow-xl border border-gray-100/50
        transition-all duration-500 ease-out
        hover:-translate-y-1 hover:scale-[1.02]
        bg-gradient-to-br ${bgCls}
      `}
    >
      {/* full-bleed image */}
      {category.image ? (
        <Image
          src={category.image}
          alt={category.name || "Category"}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-110 transition-transform duration-[2000ms] ease-out"
          loading="lazy"
        />
      ) : (
        /* typographic fallback watermark */
        <div className="absolute inset-0 flex items-center justify-center select-none overflow-hidden opacity-10">
          <span className="text-[12rem]      tracking-tighter">
            {firstLetter}
          </span>
        </div>
      )}

      {/* gradient scrim for images */}
      {category.image && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition-opacity duration-500 group-hover:opacity-70" />
      )}

      {/* Glassmorphic Label Overlay */}
      <div className="absolute bottom-0 inset-x-0 p-4 flex flex-col items-center">
        <div className="w-full backdrop-blur-md bg-white/85 text-neutral-900 py-3 px-4 rounded-xl text-center shadow-md border border-white/40 transition-all duration-300 group-hover:bg-white group-hover:shadow-lg">
          <h3 className="   text-sm sm:text-base font-semibold tracking-wide uppercase">
            {category.name}
          </h3>
          {category.count > 0 ? (
            <p className="text-[10px] text-neutral-500 font-medium tracking-widest mt-0.5 uppercase">
              {category.count} Designs
            </p>
          ) : (
            <p className="text-[10px] text-neutral-500 font-medium tracking-widest mt-0.5 uppercase">
              Explore
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── skeleton ────────────────────────────────────────────────────────── */
const SkeletonLoader = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
    {[...Array(4)].map((_, i) => (
      <div
        key={i}
        className="w-full aspect-[4/5] rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200 animate-pulse border border-neutral-100"
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

  const sectionCls = `relative py-14 bg-neutral-50/50 overflow-hidden border-b border-neutral-100`;

  const Header = () => (
    <div className="text-center mb-12">
      <span className="text-[10px] font-semibold tracking-[0.3em] text-neutral-500 uppercase block mb-3">
        DESIGN GALLERY
      </span>
      <h2 className="text-3xl sm:text-4xl font-light    tracking-wide text-neutral-900 uppercase">
        Shop By Category
      </h2>
      <p className="mt-4 text-neutral-500 text-xs sm:text-sm font-light tracking-wide max-w-md mx-auto leading-relaxed">
        Explore our collection of meticulously handcrafted premium jewellery, designed for every style and occasion.
      </p>
    </div>
  );

  if (loading) {
    return (
      <section className={sectionCls}>
        <div className="container max-w-7xl mx-auto px-4">
          <Header />
          <SkeletonLoader />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={sectionCls}>
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
      <section className={sectionCls}>
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
    <section className={sectionCls}>
      <div className="container max-w-7xl mx-auto px-4">
        <Header />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {categories.map((category, index) => (
            <Link
              href={`/category/${category.slug}`}
              key={category.id}
              className="block"
            >
              <CategoryCard category={category} index={index} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;

