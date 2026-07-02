"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import BrandCarousel from "@/components/sections/BrandCarousel";
import { ProductCard } from "@/components/products/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

/* ─────────────────────────────────────────
   SECTION METADATA (BANNER CONTENTS)
───────────────────────────────────────── */
const SECTION_METADATA = {
  featured: {
    bannerImage: "/featured_banner.png",
    tag: "FINE JEWELLERY",
    title: "FEATURED",
    subtitle: "COLLECTIONS",
    dateText: "Handpicked handcrafted jewellery pieces selected for your style",
    linkUrl: "/shop?type=featured"
  },
  latest: {
    bannerImage: "/latest_banner.png",
    tag: "NEW IN STORE",
    title: "LATEST",
    subtitle: "ADDITIONS",
    dateText: "Newly added premium jewellery collections",
    linkUrl: "/shop?type=latest"
  },
  bestseller: {
    bannerImage: "/bestseller_banner.png",
    tag: "MOST POPULAR",
    title: "BEST",
    subtitle: "SELLERS",
    dateText: "Our most popular jewellery designs loved by clients across India",
    linkUrl: "/shop?type=bestseller"
  },
  trending: {
    bannerImage: "/trending_banner.png",
    tag: "MUST HAVES",
    title: "TRENDING",
    subtitle: "NOW",
    dateText: "Most loved and trending handmade designs and accessories this week",
    linkUrl: "/shop?type=trending"
  },
  new: {
    bannerImage: "/new_banner.png",
    tag: "FRESH DESIGNS",
    title: "NEW",
    subtitle: "ARRIVALS",
    dateText: "Fresh handcrafted creations added to our gallery",
    linkUrl: "/shop?type=new"
  }
};

/* ─────────────────────────────────────────
   SKELETON LOADER
───────────────────────────────────────── */
const ProductSkeleton = () => (
  <div className="bg-white rounded-xl overflow-hidden animate-pulse border border-gray-100">
    <div className="h-48 w-full bg-gradient-to-br from-gray-100 to-gray-200" />
    <div className="p-4 space-y-2">
      <div className="h-3 w-16 bg-gray-200 rounded-full mx-auto" />
      <div className="h-4 w-full bg-gray-100 rounded" />
      <div className="h-4 w-3/4 mx-auto bg-gray-100 rounded" />
      <div className="h-6 w-20 bg-gray-200 rounded-full mx-auto" />
    </div>
  </div>
);

/* ─────────────────────────────────────
   REUSABLE PRODUCTS CAROUSEL
───────────────────────────────────── */
function FeaturedProductsCarousel({ products, isLoading }) {
  const [api, setApi] = useState(null);

  useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => api.scrollNext(), 3000);
    return () => clearInterval(interval);
  }, [api]);

  if (!isLoading && products.length === 0) return null;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {[...Array(4)].map((_, i) => <ProductSkeleton key={i} />)}
      </div>
    );
  }

  return (
    <div className="relative">
      <Carousel
        setApi={setApi}
        opts={{ align: "start", loop: true }}
        className="w-full"
      >
        <CarouselContent className="-ml-3">
          {products.map((product, index) => (
            <CarouselItem
              key={product.id || product.slug || index}
              className="pl-3 basis-1/2 md:basis-1/3 lg:basis-1/4 py-2"
            >
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute -left-3 top-1/2 -translate-y-1/2 h-9 w-9 bg-white border-gray-200 shadow-md hover:bg-primary hover:text-white hover:border-primary transition-all z-10" />
        <CarouselNext className="absolute -right-3 top-1/2 -translate-y-1/2 h-9 w-9 bg-white border-gray-200 shadow-md hover:bg-primary hover:text-white hover:border-primary transition-all z-10" />
      </Carousel>
    </div>
  );
}

/* ─────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────── */
export default function HomePageContent() {
  const [loading, setLoading] = useState(true);
  const [dbSections, setDbSections] = useState([]);
  const [products, setProducts] = useState({});

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        // 1. Fetch sections from database for custom configurations
        let fetchedSections = [];
        try {
          const sectionRes = await fetchApi("/public/product-sections");
          if (sectionRes?.data?.sections) {
            fetchedSections = sectionRes.data.sections;
            setDbSections(fetchedSections);
          }
        } catch (sectionErr) {
          console.error("Error fetching db sections for banner:", sectionErr);
        }

        // Fallback to defaults if no sections exist yet
        const displaySections = fetchedSections.length > 0 ? fetchedSections : [
          { slug: "featured" },
          { slug: "latest" },
          { slug: "bestseller" },
          { slug: "trending" },
          { slug: "new" },
        ];

        // 2. Build dynamic endpoints based on active sections
        const dynamicEndpoints = displaySections.map(sec => ({
          key: sec.slug?.toLowerCase(),
          url: `/public/products/type/${sec.slug?.toLowerCase()}?limit=12`
        }));

        // Fetch products list for all active sections
        const results = await Promise.allSettled(
          dynamicEndpoints.map(({ url }) => fetchApi(url))
        );

        const updated = {};
        results.forEach((result, index) => {
          const key = dynamicEndpoints[index].key;
          if (result.status === "fulfilled") {
            updated[key] = result.value?.data?.products || [];
          }
        });
        setProducts(updated);
      } catch (err) {
        console.error("Error fetching home products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderSection = (key, title, description, bgClass = "bg-white") => {
    const sectionProducts = products[key];
    if (!loading && sectionProducts.length === 0) return null;

    const dbSection = dbSections.find(
      (s) =>
        s.slug?.toLowerCase() === key.toLowerCase() ||
        s.slug?.toLowerCase().replace(/-/g, "") === key.toLowerCase()
    );

    const defaultBanner = SECTION_METADATA[key] || {
      bannerImage: "/placeholder.jpg",
      tag: "COLLECTION",
      title: title,
      subtitle: "",
      dateText: description,
      linkUrl: `/shop?type=${key}`
    };

    // Split section name to fit layout's title and subtitle pattern
    let titleParts = dbSection?.name ? dbSection.name.split(" ") : [];

    const banner = {
      ...defaultBanner,
      bannerImage: dbSection?.image || defaultBanner.bannerImage,
      title: titleParts.length > 0 ? titleParts[0].toUpperCase() : defaultBanner.title,
      subtitle: titleParts.length > 1 ? titleParts.slice(1).join(" ").toUpperCase() : defaultBanner.subtitle,
      dateText: dbSection?.description || defaultBanner.dateText,
    };

    return (
      <section className={`py-12 ${bgClass}`} style={{ borderBottom: "1px solid #E5E7EB" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
            {/* Left Banner */}
            <div className="relative group overflow-hidden rounded-2xl min-h-[320px] lg:min-h-[400px] flex flex-col justify-end p-6 md:p-8 bg-neutral-900 shadow-md">
              <Image
                src={banner.bannerImage}
                alt={title}
                fill
                className="object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 25vw"
                priority={key === "featured"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent z-10" />
              <div className="relative z-20 flex flex-col h-full justify-end text-white">
                <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-gray-300 mb-2 block">
                  {banner.tag}
                </span>
                <h2 className="text-2xl md:text-3xl font-light tracking-wide uppercase leading-tight mb-2   ">
                  {banner.title}
                  <span className="block font-semibold mt-0.5 text-xl md:text-2xl tracking-normal">{banner.subtitle}</span>
                </h2>
                <p className="text-xs text-gray-300 font-light mb-6 leading-relaxed max-w-xs">
                  {banner.dateText}
                </p>
                <Link
                  href={banner.linkUrl}
                  className="inline-flex items-center text-xs font-semibold uppercase tracking-widest border-b border-white pb-1 w-max transition-all hover:text-gray-300 hover:border-gray-300 hover:pl-1"
                >
                  See More Products
                </Link>
              </div>
            </div>

            {/* Right Products Carousel */}
            <div className="lg:col-span-3 relative flex flex-col justify-center min-w-0">
              <FeaturedProductsCarousel products={sectionProducts} isLoading={loading} />
            </div>
          </div>
        </div>
      </section>
    );
  };

  const displaySections = dbSections.length > 0
    ? [...dbSections].sort((a, b) => a.displayOrder - b.displayOrder)
    : [
        { id: "featured", slug: "featured", name: "FEATURED COLLECTIONS", description: "Handpicked handcrafted jewellery pieces selected for your style" },
        { id: "latest", slug: "latest", name: "LATEST ADDITIONS", description: "Newly added premium jewellery collections" },
        { id: "bestseller", slug: "bestseller", name: "BEST SELLERS", description: "Our most popular jewellery designs loved by clients across India" },
        { id: "trending", slug: "trending", name: "TRENDING NOW", description: "Most loved and trending handmade designs and accessories this week" },
        { id: "new", slug: "new", name: "NEW ARRIVALS", description: "Fresh handcrafted creations added to our gallery" },
      ];

  return (
    <>
      {displaySections.map((sec, idx) => {
        const key = sec.slug?.toLowerCase();
        if (!products[key]) return null;

        return (
          <div key={sec.id || key}>
            {renderSection(
              key,
              sec.name,
              sec.description,
              "bg-white"
            )}
            {idx === 0 && <BrandCarousel tag="HOT" title="TRUSTED DESIGNERS" />}
            {idx === 3 && <BrandCarousel tag="NEW" title="NEW ARRIVALS" />}
          </div>
        );
      })}
    </>
  );
}
