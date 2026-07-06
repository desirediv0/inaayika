"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { fetchApi } from "@/lib/utils";
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
   SKELETON LOADER
───────────────────────────────────────── */
const ReelSkeleton = () => (
  <div className="flex-shrink-0 w-[calc(16.666%-10px)] animate-pulse">
    <div className="aspect-[9/14] bg-gradient-to-br from-[#F7F3EB] to-[#EFE8DA]" />
    <div className="mt-2 space-y-1.5">
      <div className="h-3.5 w-3/4 bg-[#F7F3EB] rounded" />
      <div className="h-3 w-1/2 bg-[#EFE8DA] rounded" />
    </div>
  </div>
);

/* ─────────────────────────────────────────
   SINGLE REEL CARD
   - Autoplay muted
   - Click = open fullscreen viewer
   - No rounded corners
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
      className="flex-shrink-0 w-[160px] sm:w-[180px] md:w-[calc(16.666%-12px)] cursor-pointer snap-start"
      onClick={() => onClick(reel)}
    >
      <div className="relative aspect-[9/14] overflow-hidden bg-[#111]">
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
          <div className="flex items-center justify-center h-full bg-[#1a1a1a]">
            <Play className="h-10 w-10 text-white/40" />
          </div>
        )}

        <div className="absolute top-2 right-2">
          <div className="w-6 h-6 rounded-full bg-black/40 flex items-center justify-center">
            <VolumeX className="h-3 w-3 text-white" />
          </div>
        </div>

        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center">
              <Play className="h-5 w-5 text-[#1a1a1a] ml-0.5" />
            </div>
          </div>
        )}
      </div>

      {product && (
        <div className="mt-2 px-0.5 flex gap-2">
          {getProductImageUrl(product) && (
            <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0 border border-gray-200">
              <img
                src={getProductImageUrl(product)}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-[12px] md:text-[13px] font-semibold text-[#1a1a1a] truncate leading-tight">
              {product.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              {product.salePrice ? (
                <>
                  <span className="text-[12px] md:text-[13px] font-bold text-[#1a1a1a]">
                    ₹{Number(product.salePrice).toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] md:text-[11px] line-through text-gray-400">
                    ₹{Number(product.price).toLocaleString("en-IN")}
                  </span>
                  <span className="text-[9px] md:text-[10px] bg-[#E8F5E9] text-[#2E7D32] px-1 py-0.5 rounded font-semibold">
                    {Math.round(
                      ((product.price - product.salePrice) / product.price) * 100
                    )}
                    % off
                  </span>
                </>
              ) : (
                <span className="text-[12px] md:text-[13px] font-bold text-[#1a1a1a]">
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
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
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
      >
        <X className="h-5 w-5 text-white" />
      </button>

      {/* Previous arrow */}
      {currentIndex > 0 && (
        <button
          onClick={() => onNavigate(currentIndex - 1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
      )}

      {/* Next arrow */}
      {currentIndex < reels.length - 1 && (
        <button
          onClick={() => onNavigate(currentIndex + 1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </button>
      )}

      {/* Main video area */}
      <div
        className="relative w-full max-w-[420px] h-full max-h-[100vh] flex flex-col"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Video */}
        <div
          className="relative flex-1 bg-black cursor-pointer"
          onClick={handleVideoClick}
        >
          <video
            ref={videoRef}
            src={currentReel.videoUrl}
            className="w-full h-full object-contain"
            loop
            playsInline
          />

          {/* Mute/Unmute button */}
          <button
            onClick={toggleMute}
            className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors"
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5 text-white" />
            ) : (
              <Volume2 className="h-5 w-5 text-white" />
            )}
          </button>

          {/* Play overlay when paused */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center">
                <Play className="h-7 w-7 text-[#1a1a1a] ml-1" />
              </div>
            </div>
          )}

          {/* Play/Pause hint */}
          {isPlaying && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm">
              <span className="text-white text-xs font-medium">
                Tap to pause
              </span>
            </div>
          )}
        </div>

        {/* Product info card at bottom */}
        {product && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 pb-6">
            <div className="flex items-end gap-3">
              {/* Product thumbnail */}
              {getProductImageUrl(product) && (
                <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border border-white/20">
                  <img
                    src={getProductImageUrl(product)}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Product details */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white text-sm font-semibold truncate">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  {product.salePrice ? (
                    <>
                      <span className="text-white text-base font-bold">
                        ₹{Number(product.salePrice).toLocaleString("en-IN")}
                      </span>
                      <span className="text-white/50 text-xs line-through">
                        ₹{Number(product.price).toLocaleString("en-IN")}
                      </span>
                      <span className="text-[10px] bg-[#E8F5E9] text-[#2E7D32] px-1.5 py-0.5 rounded font-semibold">
                        {Math.round(
                          ((product.price - product.salePrice) /
                            product.price) *
                          100
                        )}
                        % off
                      </span>
                    </>
                  ) : (
                    <span className="text-white text-base font-bold">
                      ₹{Number(product.price).toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `/product/${product.slug || product.id}`;
                }}
                className="flex-shrink-0 flex items-center gap-2 bg-white text-[#1a1a1a] px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">Add to Cart</span>
              </button>
            </div>
          </div>
        )}

        {/* Reel counter */}
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm">
          <span className="text-white text-xs font-medium">
            {currentIndex + 1} / {reels.length}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN WATCH AND BUY SECTION
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
      <section className="py-6 md:py-10">
        <div className="max-w-[1400px] mx-auto px-4">
          <h2 className="font-display text-4xl sm:text-5xl font-medium tracking-wide text-neutral-900 text-center  mb-5">
            Watch and Buy
          </h2>
          <div className="flex gap-3 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <ReelSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (reels.length === 0) return null;

  return (
    <>
      <section className="py-6 md:py-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-display text-4xl sm:text-5xl font-medium tracking-wide text-neutral-900 text-center  mb-5">
            Watch and Buy
          </h2>

          <div
            className="relative group"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-[35%] -translate-y-1/2 z-10 w-8 h-8 md:w-9 md:h-9 rounded-full bg-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50 border border-gray-200"
            >
              <svg className="h-4 w-4 text-[#1a1a1a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div
              ref={scrollRef}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="flex gap-3 overflow-x-auto pb-3"
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
              className="absolute right-0 top-[35%] -translate-y-1/2 z-10 w-8 h-8 md:w-9 md:h-9 rounded-full bg-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50 border border-gray-200"
            >
              <svg className="h-4 w-4 text-[#1a1a1a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
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
