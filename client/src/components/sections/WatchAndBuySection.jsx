"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { fetchApi } from "@/lib/utils";
import Reveal from "@/components/ui/Reveal";
import {
  VolumeX,
  Volume2,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
} from "lucide-react";

// Helper to get product image URL
function getProductImageUrl(product) {
  if (!product) return null;
  // Public API returns "image" (singular string)
  if (product.image) return product.image;
  // Admin API returns "primaryImage" (string)
  if (product.primaryImage) return product.primaryImage;
  // Fallback: check images array
  if (product.images && product.images.length > 0) {
    const img = product.images[0];
    if (typeof img === "string") return img;
    if (img?.url) return img.url;
  }
  return null;
}

/* ─────────────────────────────────────────
   SKELETON LOADER (dark stage)
───────────────────────────────────────── */
const ReelSkeleton = ({ index }) => (
  <div
    className={`flex-shrink-0 w-[170px] sm:w-[190px] md:w-[calc(20%-13px)] animate-pulse ${index % 2 === 1 ? "md:translate-y-6" : ""}`}
  >
    <div className="aspect-[9/14] bg-white/[0.06] border border-white/10" />
  </div>
);

/* ─────────────────────────────────────────
   SINGLE REEL CARD — "jewel film" frame
   - Autoplay muted
   - Click = open fullscreen viewer
   - Gold corner brackets, glass product chip
───────────────────────────────────────── */
function ReelCard({ reel, onClick }) {
  const videoRef = useRef(null);
  const cardRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!cardRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (videoRef.current) {
          if (entry.isIntersecting) {
            videoRef.current.play().catch(() => { });
            setIsPlaying(true);
          } else {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const product = reel.products?.[0];

  return (
    <div
      ref={cardRef}
      className="flex-shrink-0 w-[170px] sm:w-[190px] md:w-[calc(20%-13px)] cursor-pointer snap-start md:even:translate-y-6"
      onClick={() => onClick(reel)}
    >
      <div className="luxe-corners relative aspect-[9/14] overflow-hidden bg-[#03130C] border border-white/10 hover:border-[#B08D57]/70 transition-all duration-500 hover:shadow-[0_30px_60px_-25px_rgba(231,201,131,0.25)]">
        {reel.videoUrl ? (
          <video
            ref={videoRef}
            src={reel.videoUrl}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-[#03130C]">
            <Play className="h-10 w-10 text-[#E7C983]/30" />
          </div>
        )}

        {/* Playing status — gold equalizer */}
        {isPlaying && (
          <div className="absolute top-3 right-3 z-20 eq-bars" aria-hidden="true">
            <span /><span /><span />
          </div>
        )}

        {/* Paused — thin gold play ring */}
        {!isPlaying && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/25">
            <div className="w-12 h-12 rounded-full border border-[#E7C983]/80 bg-black/30 backdrop-blur-sm flex items-center justify-center">
              <Play className="h-4 w-4 text-[#E7C983] ml-0.5" />
            </div>
          </div>
        )}

        {/* Legibility scrim behind the chip */}
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

        {/* Glass product chip — links directly to the product page */}
        {product && (
          <Link
            href={`/products/${product.slug || product.id}`}
            onClick={(e) => e.stopPropagation()}
            className="group/chip absolute bottom-2 inset-x-2 z-20 flex items-center gap-2.5 bg-black/60 backdrop-blur-md border border-white/15 hover:border-[#B08D57]/70 p-2.5 transition-colors"
          >
            {getProductImageUrl(product) && (
              <div className="w-12 h-12 overflow-hidden flex-shrink-0 border border-[#B08D57]/40">
                <img
                  src={getProductImageUrl(product)}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-[14px] font-medium text-white truncate leading-tight group-hover/chip:text-[#E7C983] transition-colors">
                {product.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                {product.salePrice ? (
                  <>
                    <span className="text-[12px] tracking-wide text-[#E7C983]">
                      ₹{Number(product.salePrice).toLocaleString("en-IN")}
                    </span>
                    <span className="text-[9px] line-through text-white/40">
                      ₹{Number(product.price).toLocaleString("en-IN")}
                    </span>
                    <span className="text-[8px] uppercase tracking-[0.15em] text-[#E7C983] border border-[#B08D57]/50 px-1 py-px">
                      −{Math.round(
                        ((product.price - product.salePrice) / product.price) * 100
                      )}%
                    </span>
                  </>
                ) : (
                  <span className="text-[12px] tracking-wide text-[#E7C983]">
                    ₹{Number(product.price).toLocaleString("en-IN")}
                  </span>
                )}
              </div>
              <span className="mt-1 hidden sm:block text-[8px] uppercase tracking-[0.22em] text-white/50 group-hover/chip:text-[#E7C983] transition-colors">
                View Product
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-[#E7C983] flex-shrink-0 opacity-80 transition-transform group-hover/chip:translate-x-0.5" />
          </Link>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   FULLSCREEN REEL VIEWER (Instagram-style)
   - Click video = unmute + play
   - Product card at bottom
   - Left/right navigation
   - Mute/unmute button
───────────────────────────────────────── */
function ReelViewer({ reels, currentIndex, onClose, onNavigate }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showProduct, setShowProduct] = useState(true);
  const videoRef = useRef(null);

  const currentReel = reels[currentIndex];
  const product = currentReel?.products?.[0];

  // Reset state when navigating
  useEffect(() => {
    setIsMuted(false);
    setIsPlaying(false);
    setShowProduct(true);
  }, [currentIndex]);

  // Autoplay UNMUTED when reel changes
  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = false;
    videoRef.current.play().catch(() => { });
    setIsPlaying(true);
    setIsMuted(false);
  }, [currentIndex]);

  // Click on video = toggle play/pause (already unmuted)
  const handleVideoClick = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Toggle mute button
  const toggleMute = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && currentIndex > 0) onNavigate(currentIndex - 1);
      if (e.key === "ArrowRight" && currentIndex < reels.length - 1)
        onNavigate(currentIndex + 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentIndex, reels.length, onClose, onNavigate]);

  // Swipe support for mobile
  const touchStartRef = useRef(null);
  const handleTouchStart = (e) => {
    touchStartRef.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (!touchStartRef.current) return;
    const diff = touchStartRef.current - e.changedTouches[0].clientX;
    if (diff > 50 && currentIndex < reels.length - 1) {
      onNavigate(currentIndex + 1);
    } else if (diff < -50 && currentIndex > 0) {
      onNavigate(currentIndex - 1);
    }
    touchStartRef.current = null;
  };

  if (!currentReel) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#00140D]/95 backdrop-blur-sm flex items-center justify-center px-3">
      {/* Previous arrow */}
      {currentIndex > 0 && (
        <button
          onClick={() => onNavigate(currentIndex - 1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full border border-white/25 bg-black/40 backdrop-blur-sm flex items-center justify-center hover:border-[#E7C983] hover:text-[#E7C983] text-white transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {/* Next arrow */}
      {currentIndex < reels.length - 1 && (
        <button
          onClick={() => onNavigate(currentIndex + 1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full border border-white/25 bg-black/40 backdrop-blur-sm flex items-center justify-center hover:border-[#E7C983] hover:text-[#E7C983] text-white transition-colors"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Main video popup — ~85% of viewport height, framed */}
      <div
        className="relative w-full max-w-[420px] h-[85vh] max-h-[85vh] flex flex-col overflow-hidden border border-[#B08D57]/30 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.85)]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Reel counter — top-left */}
        <div className="absolute top-3 left-3 z-[60] px-3 py-1 border border-white/15 bg-black/50 backdrop-blur-sm">
          <span className="text-white/80 text-[10px] uppercase tracking-[0.25em]">
            {currentIndex + 1} / {reels.length}
          </span>
        </div>

        {/* Close — top-right */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-[60] w-10 h-10 rounded-full border border-white/25 bg-black/50 backdrop-blur-sm flex items-center justify-center hover:border-[#E7C983] hover:text-[#E7C983] text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Mute — stacked below Close so they never overlap on mobile */}
        <button
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute" : "Mute"}
          className="absolute top-16 right-3 z-[60] w-10 h-10 rounded-full border border-white/25 bg-black/50 backdrop-blur-sm flex items-center justify-center hover:border-[#E7C983] transition-colors"
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5 text-white" />
          ) : (
            <Volume2 className="h-5 w-5 text-[#E7C983]" />
          )}
        </button>

        {/* Video */}
        <div
          className="relative flex-1 bg-black cursor-pointer overflow-hidden"
          onClick={handleVideoClick}
        >
          <video
            ref={videoRef}
            src={currentReel.videoUrl}
            className="w-full h-full object-contain"
            loop
            playsInline
          />

          {/* Play overlay when paused */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/25">
              <div className="w-16 h-16 rounded-full border border-[#E7C983]/80 bg-black/30 backdrop-blur-sm flex items-center justify-center">
                <Play className="h-6 w-6 text-[#E7C983] ml-1" />
              </div>
            </div>
          )}

          {/* Play/Pause hint */}
          {isPlaying && (
            <div className="absolute bottom-28 left-1/2 -translate-x-1/2 px-3 py-1.5 border border-white/15 bg-black/40 backdrop-blur-sm pointer-events-none">
              <span className="text-white/80 text-[10px] uppercase tracking-[0.25em]">
                Tap to pause
              </span>
            </div>
          )}
        </div>

        {/* Product info card at bottom */}
        {product && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/65 to-transparent p-4 pb-6">
            <div className="flex items-end gap-3">
              {/* Product thumbnail */}
              {getProductImageUrl(product) && (
                <div className="w-14 h-14 overflow-hidden flex-shrink-0 border border-[#B08D57]/50">
                  <img
                    src={getProductImageUrl(product)}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Product details */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${product.slug || product.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="group/name block min-w-0"
                >
                  <h3 className="font-display text-white text-base font-medium truncate underline decoration-white/25 decoration-1 underline-offset-4 group-hover/name:text-[#E7C983] group-hover/name:decoration-[#E7C983] transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  {product.salePrice ? (
                    <>
                      <span className="text-[#E7C983] text-base tracking-wide">
                        ₹{Number(product.salePrice).toLocaleString("en-IN")}
                      </span>
                      <span className="text-white/40 text-xs line-through">
                        ₹{Number(product.price).toLocaleString("en-IN")}
                      </span>
                      <span className="text-[9px] uppercase tracking-[0.15em] text-[#E7C983] border border-[#B08D57]/50 px-1.5 py-0.5">
                        −{Math.round(
                          ((product.price - product.salePrice) /
                            product.price) *
                          100
                        )}%
                      </span>
                    </>
                  ) : (
                    <span className="text-[#E7C983] text-base tracking-wide">
                      ₹{Number(product.price).toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
              </div>

              {/* Shop button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `/products/${product.slug || product.id}`;
                }}
                className="flex-shrink-0 flex items-center gap-2 bg-white text-[#00140D] px-4 py-2.5 text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-[#E7C983] transition-colors"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">Shop Now</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   SECTION HEADER (shared by loading + loaded)
───────────────────────────────────────── */
function SectionHeader() {
  return (
    <Reveal className="relative z-10 text-center mb-12">
      <span className="inline-flex items-center gap-2.5 luxe-eyebrow mb-4">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-[#E7C983] opacity-75 animate-ping" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#E7C983]" />
        </span>
        Now Showing &middot; The Reel Edit
      </span>
      <h2 className="font-display text-4xl sm:text-5xl font-medium tracking-wide text-white">
        Watch <span className="italic text-gold-shimmer">&amp;</span> Buy
      </h2>
      <span className="luxe-rule mt-5" />
      <p className="mt-5 text-white/50 text-xs sm:text-sm font-light tracking-wide max-w-md mx-auto leading-relaxed">
        Our handcrafted pieces, in motion. Tap any film to see it up close — and
        make it yours.
      </p>
    </Reveal>
  );
}

const SECTION_BG = {
  background:
    "radial-gradient(ellipse 80% 60% at 50% -10%, #0A4430 0%, #002216 45%, #00140D 100%)",
};

/* ─────────────────────────────────────────
   MAIN WATCH AND BUY SECTION — dark cinema stage
───────────────────────────────────────── */
export default function WatchAndBuySection() {
  const [reels, setReels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const scrollRef = useRef(null);
  const autoScrollRef = useRef(null);
  const isPausedRef = useRef(false);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const data = await fetchApi("/api/public/video-reels");
        setReels(data?.data?.reels || []);
      } catch (error) {
        console.error("Failed to fetch video reels:", error);
        setReels([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReels();
  }, []);

  // Auto-scroll continuous
  useEffect(() => {
    if (reels.length === 0 || !scrollRef.current) return;

    const container = scrollRef.current;
    let animationId;
    let speed = 0.5;

    const autoScroll = () => {
      if (!isPausedRef.current && container) {
        container.scrollLeft += speed;
        const maxScroll = container.scrollWidth - container.clientWidth;
        if (container.scrollLeft >= maxScroll) {
          container.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(autoScroll);
    };

    animationId = requestAnimationFrame(autoScroll);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [reels]);

  const handleMouseEnter = () => {
    isPausedRef.current = true;
  };

  const handleMouseLeave = () => {
    isPausedRef.current = false;
  };

  const handleTouchStart = () => {
    isPausedRef.current = true;
  };

  const handleTouchEnd = () => {
    setTimeout(() => {
      isPausedRef.current = false;
    }, 2000);
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const amount = scrollRef.current.clientWidth / 2;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  // Open fullscreen viewer
  const openViewer = useCallback((reel) => {
    const index = reels.findIndex((r) => r.id === reel.id);
    setViewerIndex(index >= 0 ? index : 0);
    setViewerOpen(true);
    document.body.style.overflow = "hidden";
  }, [reels]);

  // Close fullscreen viewer
  const closeViewer = useCallback(() => {
    setViewerOpen(false);
    document.body.style.overflow = "";
  }, []);

  // Navigate in viewer
  const navigateViewer = useCallback((index) => {
    setViewerIndex(index);
  }, []);

  // Lock body scroll when viewer is open
  useEffect(() => {
    if (viewerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [viewerOpen]);

  if (isLoading) {
    return (
      <section
        className="relative py-16 md:py-20 overflow-hidden border-y border-[#B08D57]/20"
        style={SECTION_BG}
      >
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader />
          <div className="flex gap-4 overflow-hidden pt-2 pb-10">
            {[...Array(6)].map((_, i) => (
              <ReelSkeleton key={i} index={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (reels.length === 0) return null;

  return (
    <>
      <section
        className="relative py-16 md:py-20 overflow-hidden border-y border-[#B08D57]/20"
        style={SECTION_BG}
      >
        {/* Giant serif watermark */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-2 text-center pointer-events-none select-none overflow-hidden"
        >
          <span className="font-display italic text-[15vw] leading-none text-white/[0.035] whitespace-nowrap">
            Inaayika
          </span>
        </div>

        <div className="relative max-w-7xl mx-auto px-4">
          <SectionHeader />

          <div
            className="relative group"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => scroll("left")}
              className="absolute -left-1 top-[38%] -translate-y-1/2 z-30 w-9 h-9 border border-[#B08D57]/50 bg-[#00140D]/85 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-[#E7C983] hover:bg-[#B08D57] hover:text-[#00140D]"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div
              ref={scrollRef}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="flex gap-4 overflow-x-auto pt-2 pb-12"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                scrollBehavior: "auto",
              }}
            >
              {reels.map((reel) => (
                <ReelCard key={reel.id} reel={reel} onClick={openViewer} />
              ))}
            </div>

            <button
              onClick={() => scroll("right")}
              className="absolute -right-1 top-[38%] -translate-y-1/2 z-30 w-9 h-9 border border-[#B08D57]/50 bg-[#00140D]/85 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-[#E7C983] hover:bg-[#B08D57] hover:text-[#00140D]"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Fullscreen Reel Viewer */}
      {viewerOpen && (
        <ReelViewer
          reels={reels}
          currentIndex={viewerIndex}
          onClose={closeViewer}
          onNavigate={navigateViewer}
        />
      )}
    </>
  );
}
