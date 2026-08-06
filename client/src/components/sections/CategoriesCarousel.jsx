"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Carousel, CarouselContent, CarouselItem,
  CarouselPrevious, CarouselNext,
} from "@/components/ui/carousel";
import { fetchApi } from "@/lib/utils";
import { getPharmaIcon } from "@/lib/pharma-icons";

const CategoriesCarousel = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [api, setApi] = useState(null);

  useEffect(() => {
    fetchApi("/public/categories")
      .then((res) => {
        if (res.success && res.data?.categories) setCategories(res.data.categories);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-4" style={{ background: "#F7FAFC" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-4 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-shrink-0 animate-pulse">
                <div className="w-16 h-16 rounded-2xl bg-blue-50" />
                <div className="h-2.5 w-14 rounded bg-gray-100" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!categories.length) return null;

  return (
    <section className="py-4 border-b" style={{ background: "#F7FAFC", borderColor: "#DCE7F2" }}>
      <div className="max-w-7xl mx-auto px-4">
        <Carousel setApi={setApi} opts={{ align: "start", dragFree: true }} className="w-full">
          <CarouselContent className="-ml-2">
            {categories.map((cat, index) => {
              return (
                <CarouselItem key={cat.id} className="pl-2 basis-[80px] sm:basis-[90px] md:basis-[100px]">
                  <Link href={`/category/${cat.slug}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="flex flex-col items-center gap-1.5 group cursor-pointer"
                    >
                      {/* Icon / Image box */}
                      <div
                        className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-2xl flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lg border bg-[#F7F3EB] border-[#E9E2D5] group-hover:border-[#003E29]/30"
                      >
                        {cat.image ? (
                          <Image
                            src={cat.image}
                            alt={cat.name}
                            width={64}
                            height={64}
                            className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#003E29]/10 flex items-center justify-center text-[#003E29] group-hover:scale-110 transition-transform">
                            <span className="text-xs font-bold text-[#003E29]">{cat.name.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      {/* Name */}
                      <span className="text-[10px] sm:text-[11px] font-semibold text-center leading-tight text-neutral-700 group-hover:text-[#003E29] transition-colors max-w-[72px] line-clamp-2">
                        {cat.name}
                      </span>
                    </motion.div>
                  </Link>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4" />
          <CarouselNext className="hidden md:flex -right-4" />
        </Carousel>
      </div>
    </section>
  );
};

export default CategoriesCarousel;
