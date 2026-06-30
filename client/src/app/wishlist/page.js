"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ClientOnly } from "@/components/client-only";
import { fetchApi } from "@/lib/utils";
import { Trash2, Heart, ShoppingBag, ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";

export default function WishlistPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/auth?redirect=/wishlist");
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    setLoadingItems(true);
    fetchApi("/users/wishlist", { credentials: "include" })
      .then((res) => setWishlistItems(res.data?.wishlistItems || []))
      .catch(() => setError("Failed to load wishlist. Please try again."))
      .finally(() => setLoadingItems(false));
  }, [isAuthenticated]);

  const removeFromWishlist = async (wishlistItemId) => {
    try {
      await fetchApi(`/users/wishlist/${wishlistItemId}`, { method: "DELETE", credentials: "include" });
      setWishlistItems((cur) => cur.filter((item) => item.id !== wishlistItemId));
      setError("");
    } catch {
      setError("Failed to remove item. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <ClientOnly>
      <div className="min-h-screen bg-neutral-50/30 pb-24">

        {/* Hero Section with Gold Accent */}
        <section className="py-12 text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg, #002216 0%, #003E29 60%, #005a3c 100%)" }}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(212,175,55,0.1),_transparent_60%)] z-0 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] tracking-[0.25em] text-neutral-300 uppercase block mb-1">CURATED SELECTIONS</span>
              <h1 className="text-3xl md:text-4xl font-display text-white mb-1 uppercase">My Wishlist</h1>
            </div>
            {!loadingItems && wishlistItems.length > 0 && (
              <span className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37] bg-white/10 border border-[#D4AF37]/30 px-4 py-2 rounded-xl">
                {wishlistItems.length} {wishlistItems.length === 1 ? "Item" : "Items"} Saved
              </span>
            )}
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 py-12">

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 text-xs font-semibold uppercase tracking-wider px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Loading skeletons */}
          {loadingItems ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-neutral-100 animate-pulse overflow-hidden">
                  <div className="aspect-[4/5] bg-neutral-100" />
                  <div className="p-4 space-y-2.5">
                    <div className="h-3 bg-neutral-100 rounded w-1/3" />
                    <div className="h-4 bg-neutral-100 rounded w-full" />
                    <div className="h-3.5 bg-neutral-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : wishlistItems.length === 0 ? (

            /* Empty state */
            <div className="bg-white rounded-3xl p-12 md:p-16 text-center max-w-lg mx-auto border border-neutral-100 shadow-sm mt-12">
              <div className="w-20 h-20 rounded-2xl bg-neutral-50 flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-neutral-300" />
              </div>
              <h2 className="text-2xl    uppercase tracking-wide mb-3 text-neutral-900">Wishlist is Empty</h2>
              <p className="text-neutral-500 mb-8 max-w-xs mx-auto text-xs font-light leading-relaxed">
                Save your favorite handcrafted creations for later. Tap the heart icon on any jewellery to save them here.
              </p>
              <Link href="/products">
                <button
                  className="text-white text-xs font-semibold uppercase tracking-widest px-8 py-4 rounded-xl transition-all shadow-md border border-[#D4AF37]/30 hover:bg-[#002216]"
                  style={{ background: "#003E29" }}
                >
                  Browse Collection
                </button>
              </Link>
            </div>

          ) : (

            /* Wishlist grid */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {wishlistItems.map((product) => (
                <div key={product.id} className="relative group">
                  <ProductCard product={product} />

                  {/* Trash Hover Button */}
                  <button
                    onClick={(e) => { e.preventDefault(); removeFromWishlist(product.id); }}
                    className="absolute top-3 right-14 z-30 w-8 h-8 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 shadow-md border border-neutral-100 transition-all duration-300 transform active:scale-95"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

          )}
        </div>
      </div>
    </ClientOnly>
  );
}
