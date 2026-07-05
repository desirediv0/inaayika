"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

/* ─────────────────────────────────────────────
   HELPERS
 ───────────────────────────────────────────── */
function normalizeSlide(slide) {
  return {
    img: slide.img || slide.desktopImage || "",
    smimg: slide.smimg || slide.mobileImage || slide.desktopImage || slide.img || "",
    title: slide.title || slide.headline || "",
    subtitle: slide.subtitle || slide.subheadline || "",
    ctaLink: slide.ctaLink || slide.link || "/products",
  };
}

function bannerToSlide(banner) {
  return normalizeSlide({
    img: banner.desktopImage || "",
    smimg: banner.mobileImage || banner.desktopImage || "",
    title: banner.title || "",
    subtitle: banner.subtitle || "",
    ctaLink: banner.link || "/products",
  });
}

/* ─────────────────────────────────────────────
   FALLBACK DATA
 ───────────────────────────────────────────── */
const FALLBACK_SLIDES = [
  {
    img: "/hero-desktop-1.png",
    smimg: "/hero-mobile.png",
    title: "New Modern Collection",
    subtitle: "Elegance isn't solely defined by what you wear. It's how you carry yourself, how you speak, what you read.",
    ctaLink: "/products",
  },
  {
    img: "/hero-desktop-2.png",
    smimg: "/hero-mobile.png",
    title: "Exquisite Artistry",
    subtitle: "Each piece is lovingly handcrafted to add a touch of timeless elegance and charm to your style.",
    ctaLink: "/products",
  },
];

/* ─────────────────────────────────────────────
   COMPONENT
 ───────────────────────────────────────────── */
export default function HeroSection() {
  const [api, setApi] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [slides, setSlides] = useState(FALLBACK_SLIDES);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  /* ── Responsive check ── */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ── Fetch banners ── */
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetchApi("/public/banners");
        const bannersArray = response?.data?.banners;
        if (Array.isArray(bannersArray) && bannersArray.length > 0) {
          setSlides(bannersArray.map(bannerToSlide));
        } else {
          setSlides(FALLBACK_SLIDES);
        }
      } catch (err) {
        console.error("Error fetching banners:", err);
        setSlides(FALLBACK_SLIDES);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBanners();
  }, []);

  /* ── Autoplay ── */
  useEffect(() => {
    if (!api || !autoplay) return;
    const interval = setInterval(() => api.scrollNext(), 6000);
    return () => clearInterval(interval);
  }, [api, autoplay]);

  /* ── Dot sync ── */
  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrentSlide(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => api.off("select", onSelect);
  }, [api]);

  const handleSlideClick = (ctaLink) => router.push(ctaLink || "/products");

  /* ── Loading skeleton ── */
  if (isLoading) {
    return (
      <div className="relative w-full h-[60vh] md:h-[80vh] bg-gray-50 animate-pulse flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#003E29", borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (slides.length === 0) return null;

  return (
    <div className="w-full relative overflow-hidden bg-white">
      <Carousel
        setApi={setApi}
        opts={{ loop: true, align: "start" }}
        className="w-full"
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="p-0">
              <div
                className="relative w-full h-[65vh] sm:h-[75vh] md:h-[85vh] overflow-hidden cursor-pointer"
                onClick={() => handleSlideClick(slide.ctaLink)}
              >
                {/* Hero Background Image */}
                <Image
                  src={isMobile ? slide.smimg : slide.img}
                  alt={slide.title || `Slide ${index + 1}`}
                  fill
                  className="object-cover object-center hero-kenburns"
                  priority={index === 0}
                  sizes="100vw"
                />

                {/* Floating gold sparkles */}
                <span className="sparkle absolute top-[22%] right-[18%] text-lg z-10 hidden md:block" aria-hidden="true">✦</span>
                <span className="sparkle absolute top-[58%] right-[9%] text-xs z-10 hidden md:block" style={{ animationDelay: "1.4s" }} aria-hidden="true">✦</span>
                <span className="sparkle absolute top-[36%] right-[30%] text-sm z-10 hidden md:block" style={{ animationDelay: "2.6s" }} aria-hidden="true">✦</span>
                <span className="sparkle absolute bottom-[24%] left-[8%] text-xs z-10 hidden md:block" style={{ animationDelay: "2s" }} aria-hidden="true">✦</span>

                {/* Left/Center Text Overlay Box */}
                <div className="absolute inset-0 flex items-center" style={{ background: "linear-gradient(90deg, rgba(0,20,13,0.5) 0%, rgba(0,20,13,0.22) 45%, rgba(0,20,13,0) 75%)" }}>
                  <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16 w-full">
                    <div className="max-w-xl text-white">
                      {/* Eyebrow */}
                      <span className="block text-[10px] sm:text-[11px] uppercase tracking-[0.45em] text-[#E7C983] mb-5 animate-fade-in">
                        Inaayika &mdash; Handcrafted Jewellery
                      </span>

                      {/* Heading */}
                      <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-medium leading-[1.05] tracking-wide mb-5 text-white drop-shadow-md animate-fade-in">
                        {slide.title}
                      </h1>

                      {/* Subheading */}
                      <p className="text-sm sm:text-[15px] text-white/85 font-light leading-relaxed tracking-wide mb-9 max-w-md drop-shadow-sm animate-fade-in-delayed">
                        {slide.subtitle}
                      </p>

                      {/* CTA Button */}
                      <div className="animate-fade-in-delayed">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSlideClick(slide.ctaLink);
                          }}
                          className="btn-luxe-white active:scale-95"
                        >
                          Discover the Collection
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* ── Navigation Arrows ── */}
        <CarouselPrevious className="absolute left-6 top-1/2 -translate-y-1/2 hidden md:flex
                                     h-12 w-12 z-30 rounded-none
                                     bg-transparent hover:bg-white/15 border border-white/40 hover:border-white
                                     text-white backdrop-blur-sm transition-all" />
        <CarouselNext className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:flex
                                   h-12 w-12 z-30 rounded-none
                                   bg-transparent hover:bg-white/15 border border-white/40 hover:border-white
                                   text-white backdrop-blur-sm transition-all" />

        {/* ── Slide indicator bars ── */}
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-px transition-all duration-500 ${index === currentSlide
                ? "w-10 bg-[#E7C983]"
                : "w-5 bg-white/50 hover:bg-white/90"
                }`}
              style={{ height: index === currentSlide ? "2px" : "1px" }}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
}