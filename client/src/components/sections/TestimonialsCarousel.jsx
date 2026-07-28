"use client";

import { useEffect, useState } from "react";
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
                    {/* Customer Image */}
                    <div className="flex justify-center mb-4">
                      {t.image ? (
                        <img
                          src={t.image}
                          alt={t.name}
                          className="w-16 h-16 rounded-full object-cover border-3 shadow-md"
                          style={{ borderColor: "#B08D57" }}
                        />
                      ) : (
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center text-white font-display text-xl font-medium shadow-md"
                          style={{ background: "linear-gradient(135deg, #003E29, #B08D57)" }}
                        >
                          {t.name?.charAt(0)}
                        </div>
                      )}
                    </div>

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
    </section>
  );
}
