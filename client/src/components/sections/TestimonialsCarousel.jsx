"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { fetchApi } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function TestimonialsCarousel() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(null); // index inside the list of testimonials that have a picture

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetchApi("/public/testimonials");
        setTestimonials(res.data?.testimonials || []);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  if (loading || testimonials.length === 0) return null;

  const withImages = testimonials.filter((t) => t.image);

  return (
    <section className="py-16 md:py-24 relative overflow-hidden" style={{ background: "#FDFBF7" }}>
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 rounded-full blur-3xl opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle, #B08D57, transparent)" }} />
      <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle, #B08D57, transparent)" }} />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold" style={{ color: "#B08D57" }}>
            Testimonials
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium mt-3 mb-4" style={{ color: "#002216" }}>
            What People Are Saying
          </h2>
          <p className="text-sm max-w-xl mx-auto" style={{ color: "#6b7280" }}>
            We enjoy ourselves when you talk about us. Check out all the sweet words of our happy customers.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
              slidesToScroll: 1,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {testimonials.map((t) => (
                <CarouselItem key={t.id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div
                    className="h-full rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border"
                    style={{
                      background: "linear-gradient(135deg, #F7F3EB 0%, #FDFBF7 100%)",
                      borderColor: "#E9E2D5",
                    }}
                  >
                    {/* Optional review evidence */}
                    <div className="mb-4">
                      {t.image ? (
                        <button
                          type="button"
                          onClick={() => setLightboxIndex(withImages.findIndex((x) => x.id === t.id))}
                          className="block w-full cursor-zoom-in"
                          aria-label={`View ${t.imageType === "CHAT_SCREENSHOT" ? "review chat screenshot" : "review photo"} for ${t.name} in full size`}
                        >
                          <img
                            src={t.image}
                            alt={`${t.imageType === "CHAT_SCREENSHOT" ? "Chat screenshot" : "Review photo"} from ${t.name}`}
                            className="w-full h-56 md:h-64 rounded-xl object-contain bg-white border shadow-md"
                            style={{ borderColor: "#E9E2D5" }}
                          />
                        </button>
                      ) : (
                        <div
                          className="w-full h-44 md:h-48 rounded-xl flex items-center justify-center text-white font-display text-2xl font-medium shadow-md"
                          style={{ background: "linear-gradient(135deg, #003E29, #B08D57)" }}
                        >
                          {t.name?.charAt(0)}
                        </div>
                      )}
                    </div>

                    {t.productName && (
                      <p className="text-center text-xs font-medium mb-2" style={{ color: "#8A7045" }}>
                        Product: {t.productName}
                      </p>
                    )}
                    {t.image && (
                      <p className="text-center text-[10px] uppercase tracking-wider mb-3" style={{ color: "#9CA3AF" }}>
                        {t.imageType === "CHAT_SCREENSHOT" ? "Customer chat" : t.imageType === "PRODUCT_PHOTO" ? "Product photo" : "Customer photo"}
                      </p>
                    )}

                    {/* Name */}
                    <h3
                      className="text-center font-display text-lg font-medium mb-2"
                      style={{ color: "#3d2b1a" }}
                    >
                      {t.name}
                    </h3>

                    {/* Star Rating */}
                    <div className="flex items-center justify-center gap-0.5 mb-4">
                      {[1, 2, 3, 4, 5].map((s) => {
                        const fillLevel = s <= Math.floor(t.rating) ? "full" : s - 0.5 <= t.rating ? "half" : "empty";
                        const gradId = `star-${t.id}-${s}`;
                        return (
                          <svg key={s} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4">
                            {fillLevel === "half" && (
                              <defs>
                                <linearGradient id={gradId}>
                                  <stop offset="50%" stopColor="#B08D57" />
                                  <stop offset="50%" stopColor="#d1d5db" />
                                </linearGradient>
                              </defs>
                            )}
                            <path
                              fill={fillLevel === "full" ? "#B08D57" : fillLevel === "half" ? `url(#${gradId})` : "#d1d5db"}
                              stroke={fillLevel !== "empty" ? "#B08D57" : "#d1d5db"}
                              strokeWidth="0.5"
                              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                            />
                          </svg>
                        );
                      })}
                    </div>

                    {/* Review Text */}
                    <p
                      className="text-center text-sm leading-relaxed italic"
                      style={{ color: "#6b7280" }}
                    >
                      &ldquo;{t.text}&rdquo;
                    </p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-5 border-0 shadow-lg" style={{ background: "#FDFBF7", color: "#B08D57" }} />
            <CarouselNext className="hidden md:flex -right-5 border-0 shadow-lg" style={{ background: "#FDFBF7", color: "#B08D57" }} />
          </Carousel>
        </div>
      </div>

      {lightboxIndex !== null && withImages[lightboxIndex] && (
        <TestimonialLightbox
          items={withImages}
          index={lightboxIndex}
          onIndexChange={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </section>
  );
}

function LightboxStars({ rating }) {
  return (
    <div className="flex items-center justify-center md:justify-start gap-0.5" aria-label={`Rated ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} viewBox="0 0 24 24" className="h-4 w-4">
          <path
            fill={n <= Math.round(rating) ? "#B08D57" : "#d1d5db"}
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          />
        </svg>
      ))}
    </div>
  );
}

// Full-screen viewer: picture on the left, the review on the right (stacked on phones).
// Arrows, keyboard (Esc / left / right) and swipe all work.
function TestimonialLightbox({ items, index, onIndexChange, onClose }) {
  const t = items[index];
  const total = items.length;
  const touchStartX = useRef(null);
  const closeRef = useRef(null);

  const go = useCallback(
    (delta) => onIndexChange((index + delta + total) % total),
    [index, total, onIndexChange]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft" && total > 1) go(-1);
      else if (e.key === "ArrowRight" && total > 1) go(1);
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // no page scroll behind the viewer
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [go, onClose, total]);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null || total < 2) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  };

  const kind =
    t.imageType === "CHAT_SCREENSHOT" ? "Customer chat" : t.imageType === "PRODUCT_PHOTO" ? "Product photo" : "Customer photo";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Review from ${t.name}`}
      onClick={onClose}
    >
      <div
        className="relative flex max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-[#FDFBF7] shadow-2xl md:flex-row"
        style={{ maxHeight: "92vh" }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Picture */}
        <div className="relative flex min-h-[40vh] flex-1 items-center justify-center bg-neutral-900 md:min-h-0 md:basis-3/5">
          <img
            src={t.image}
            alt={`${kind} from ${t.name}`}
            className="max-h-[58vh] w-full object-contain md:max-h-[88vh]"
          />
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous review"
                className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#003E29] shadow-lg transition hover:bg-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next review"
                className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#003E29] shadow-lg transition hover:bg-white"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-[11px] tracking-widest text-white">
            {index + 1} / {total}
          </span>
        </div>

        {/* Review details */}
        <div className="flex flex-col justify-center gap-3 overflow-y-auto p-5 text-center sm:p-7 md:basis-2/5 md:text-left">
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: "#B08D57" }}>
            {kind}
          </span>
          <h3 className="font-display text-2xl font-medium" style={{ color: "#3d2b1a" }}>
            {t.name}
          </h3>
          <LightboxStars rating={Number(t.rating) || 5} />
          {t.productName && (
            <p className="text-xs font-medium" style={{ color: "#8A7045" }}>
              Product: {t.productName}
            </p>
          )}
          {t.text && (
            <p className="text-sm italic leading-relaxed" style={{ color: "#6b7280" }}>
              &ldquo;{t.text}&rdquo;
            </p>
          )}
        </div>

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-neutral-800 shadow-lg transition hover:bg-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
