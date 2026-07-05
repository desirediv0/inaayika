"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Loader2, ShoppingCart, Eye, Check, Star } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { fetchApi, formatCurrency, cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { useRouter } from "next/navigation";

/* ── utils ── */
const getImageUrl = (image) => {
  if (!image) return "/placeholder.jpg";
  if (image.startsWith("http")) return image;
  return `https://desirediv-storage.blr1.digitaloceanspaces.com/${image}`;
};

const calculateDiscountPercentage = (regularPrice, salePrice) => {
  if (!regularPrice || !salePrice || regularPrice <= salePrice) return 0;
  return Math.round(((regularPrice - salePrice) / regularPrice) * 100);
};

const parsePrice = (value) => {
  if (value === null || value === undefined) return null;
  if (value === 0) return 0;
  const parsed = typeof value === "string" ? parseFloat(value) : value;
  return isNaN(parsed) ? null : parsed;
};

/* ════════════════════════════════════════════
   PRODUCT CARD
 ════════════════════════════════════════════ */
export const ProductCard = ({ product, viewMode = "grid" }) => {
  const isList = viewMode === "list";
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();

  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [wishlistItems, setWishlistItems] = useState({});
  const [isAddingToWishlist, setIsAddingToWishlist] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [priceSettings, setPriceSettings] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || typeof window === "undefined") return;
    fetchApi("/users/wishlist", { credentials: "include" })
      .then((res) => {
        const map = res.data?.wishlistItems?.reduce((acc, item) => {
          acc[item.productId] = true;
          return acc;
        }, {}) || {};
        setWishlistItems(map);
      })
      .catch(console.error);
  }, [isAuthenticated]);

  useEffect(() => {
    fetchApi("/public/price-visibility-settings")
      .then((res) => { if (res.success) setPriceSettings(res.data); })
      .catch(() => setPriceSettings({ hidePricesForGuests: false }));
  }, []);

  const getAllProductImages = useMemo(() => {
    const images = [];
    const imageUrls = new Set();
    const push = (raw) => {
      const url = raw?.url || raw;
      if (!url) return;
      const full = getImageUrl(url);
      if (!imageUrls.has(full)) { imageUrls.add(full); images.push(full); }
    };
    product.variants?.forEach((v) => v.images?.forEach(push));
    product.images?.forEach(push);
    if (images.length === 0 && product.image) push(product.image);
    if (images.length === 0) images.push("/placeholder.jpg");
    return images;
  }, [product]);

  useEffect(() => {
    if (!isHovered || getAllProductImages.length <= 1) { setCurrentImageIndex(0); return; }
    const t = setInterval(() => setCurrentImageIndex((p) => (p + 1) % getAllProductImages.length), 2000);
    return () => clearInterval(t);
  }, [isHovered, getAllProductImages.length]);

  /* ── Price calc ── */
  const basePriceField = parsePrice(product.basePrice);
  const regularPriceField = parsePrice(product.regularPrice);
  const priceField = parsePrice(product.price);
  const salePriceField = parsePrice(product.salePrice);

  const hasFlashSale = product.flashSale?.isActive === true;
  const flashSalePrice = hasFlashSale ? parsePrice(product.flashSale.flashSalePrice) : null;
  const flashSaleDiscountPercent = hasFlashSale ? product.flashSale.discountPercentage : 0;

  let hasSale = product.hasSale !== undefined && product.hasSale !== null ? Boolean(product.hasSale) : false;
  if (!hasSale && salePriceField !== null && salePriceField > 0) {
    if ((regularPriceField && salePriceField < regularPriceField) || (priceField && salePriceField < priceField))
      hasSale = true;
  }

  let originalPrice = null;
  let currentPrice = 0;
  if (basePriceField !== null && regularPriceField !== null) {
    currentPrice = basePriceField;
    originalPrice = hasSale && basePriceField < regularPriceField ? regularPriceField : null;
  } else if (salePriceField !== null && hasSale) {
    currentPrice = salePriceField;
    originalPrice = priceField || basePriceField || regularPriceField || null;
  } else {
    currentPrice = basePriceField || regularPriceField || priceField || salePriceField || 0;
  }
  if (!currentPrice || isNaN(currentPrice)) currentPrice = 0;

  let displayPrice = currentPrice;
  let showFlashSaleBadge = false;
  if (hasFlashSale && flashSalePrice !== null) {
    if (!originalPrice) originalPrice = currentPrice;
    displayPrice = flashSalePrice;
    showFlashSaleBadge = true;
  }

  const discountPercent = showFlashSaleBadge
    ? flashSaleDiscountPercent
    : hasSale && originalPrice && currentPrice
      ? calculateDiscountPercentage(originalPrice, currentPrice)
      : 0;

  const showPrice = !priceSettings?.hidePricesForGuests || isAuthenticated;
  const isOutOfStock = product.stock === 0 || product.inStock === false;
  const inWishlist = wishlistItems[product.id];

  /* ── Handlers ── */
  const handleAddToWishlist = async (e) => {
    e.preventDefault(); e.stopPropagation();
    if (!isAuthenticated) { router.push(`/auth?redirect=/products/${product.slug}`); return; }
    setIsAddingToWishlist((p) => ({ ...p, [product.id]: true }));
    try {
      if (inWishlist) {
        const res = await fetchApi("/users/wishlist", { credentials: "include" });
        const item = res.data?.wishlistItems?.find((i) => i.productId === product.id);
        if (item) {
          await fetchApi(`/users/wishlist/${item.id}`, { method: "DELETE", credentials: "include" });
          setWishlistItems((p) => { const n = { ...p }; delete n[product.id]; return n; });
        }
      } else {
        await fetchApi("/users/wishlist", {
          method: "POST", credentials: "include",
          body: JSON.stringify({ productId: product.id }),
        });
        setWishlistItems((p) => ({ ...p, [product.id]: true }));
      }
    } catch { toast.error("Failed to update wishlist"); }
    finally { setIsAddingToWishlist((p) => ({ ...p, [product.id]: false })); }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault(); e.stopPropagation();
    if (!showPrice) { toast.error("Please login to purchase items"); return; }
    const variantId = product.variants?.[0]?.id;
    if (!variantId) {
      toast.error("Select options on product page");
      router.push(`/products/${product.slug}`);
      return;
    }
    setIsAddingToCart(true);
    try {
      await addToCart(variantId, 1);
      setAddedToCart(true);
      toast.success("Added to cart!");
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (err) { console.error(err); }
    finally { setIsAddingToCart(false); }
  };

  /* ── LIST MODE ── */
  if (isList) {
    return (
      <div
        className="group relative bg-white overflow-hidden flex flex-row transition-all duration-300 hover:shadow-[0_20px_40px_-24px_rgba(0,34,22,0.25)] border-b py-4"
        style={{ borderColor: "#E9E2D5" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link
          href={`/products/${product.slug}`}
          className="flex-shrink-0 flex items-center justify-center overflow-hidden"
          style={{ width: "140px", minHeight: "140px", background: "#F7F3EB" }}
        >
          <Image
            src={getAllProductImages[currentImageIndex] || "/placeholder.jpg"}
            alt={product.name}
            width={120}
            height={120}
            className="object-contain transition-transform duration-500 group-hover:scale-105"
            style={{ width: "100%", height: "auto", maxHeight: "120px", padding: "10px" }}
          />
        </Link>
        <div className="flex flex-col flex-1 p-4 justify-between min-w-0">
          <div>
            <span className="text-[9px] uppercase tracking-[0.3em] mb-1 block" style={{ color: "#B08D57" }}>{product.category?.name || "Jewellery"}</span>
            <Link href={`/products/${product.slug}`}>
              <h3 className="font-display text-lg font-medium mb-1 line-clamp-2 hover:text-[#003E29] transition-colors text-neutral-900">{product.name}</h3>
            </Link>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {showPrice ? (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[15px] tracking-[0.08em] text-neutral-900">{formatCurrency(displayPrice)}</span>
                {originalPrice && <span className="text-xs text-neutral-400 line-through font-light">{formatCurrency(originalPrice)}</span>}
                {discountPercent > 0 && <span className="text-[9px] tracking-[0.2em] uppercase text-[#003E29] bg-[#F7F3EB] border border-[#E9E2D5] px-2 py-0.5">{discountPercent}% Off</span>}
              </div>
            ) : (
              <Link href="/auth" className="text-xs uppercase tracking-[0.2em] text-neutral-700">Login for Price</Link>
            )}
            <button
              onClick={handleAddToCart}
              disabled={!showPrice || isAddingToCart || isOutOfStock}
              className="ml-auto flex-shrink-0 flex items-center gap-2 px-5 py-2.5 text-white text-[10px] uppercase tracking-[0.25em] transition-all hover:bg-[#002216] disabled:opacity-50"
              style={{ background: addedToCart ? "#10b981" : isOutOfStock ? "#b91c1c" : "#003E29" }}
            >
              {isAddingToCart ? <Loader2 className="w-4 h-4 animate-spin" /> : addedToCart ? <><Check className="w-4 h-4" /><span>Added</span></> : isOutOfStock ? <span>Out Of Stock</span> : <><ShoppingCart className="w-4 h-4" /><span>Add to Cart</span></>}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── GRID MODE (Premium Minimal Goldsmith Aesthetic) ── */
  return (
    <div
      className="group relative bg-white flex flex-col transition-all duration-300 w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Image section ── */}
      <div
        className="img-shine relative block overflow-hidden border border-transparent group-hover:border-[#E9E2D5] transition-colors duration-500"
        style={{ aspectRatio: "1/1", background: "#F7F3EB" }}
      >
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          {/* Product image */}
          <Image
            src={getAllProductImages[currentImageIndex] || "/placeholder.jpg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </Link>

        {/* BESTSELLER / SALE Badges — top left */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 pointer-events-none">
          {product.isNew && (
            <span className="text-[8px] tracking-[0.25em] text-white px-2.5 py-1 uppercase" style={{ background: "#B08D57" }}>
              Bestseller
            </span>
          )}
          {discountPercent > 0 && (
            <span className="text-[8px] tracking-[0.25em] text-white px-2.5 py-1 bg-[#003E29] uppercase">
              Sale
            </span>
          )}
        </div>

        {/* Out of stock tag — bottom left */}
        {isOutOfStock && (
          <span className="absolute bottom-3 left-3 z-20 text-[10px] text-red-700 uppercase tracking-[0.2em] bg-white/95 px-2.5 py-1 shadow-sm">
            Out of stock
          </span>
        )}

        {/* Action icons stack — top right (shows on hover) */}
        <div className={cn(
          "absolute top-3 right-3 z-20 flex flex-col gap-2 transition-all duration-300",
          isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2 pointer-events-none"
        )}>
          {/* Wishlist */}
          <button
            onClick={handleAddToWishlist}
            disabled={isAddingToWishlist[product.id]}
            className={cn(
              "w-9 h-9 flex items-center justify-center bg-white/95 shadow-sm border border-[#E9E2D5] text-neutral-700 transition-colors hover:text-[#B08D57] hover:border-[#B08D57]",
              inWishlist && "text-red-500"
            )}
            aria-label="Wishlist"
          >
            {isAddingToWishlist[product.id]
              ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
              : <Heart className={cn("h-4 w-4 stroke-[1.5]", inWishlist && "fill-current")} />}
          </button>



          {/* Quick View */}
          <Link
            href={`/products/${product.slug}`}
            className="w-9 h-9 flex items-center justify-center bg-white/95 shadow-sm border border-[#E9E2D5] text-neutral-700 hover:text-[#B08D57] hover:border-[#B08D57] transition-colors"
            aria-label="Quick View"
          >
            <Eye className="h-4 w-4 stroke-[1.5]" />
          </Link>
        </div>

        {/* Add to Cart Overlay Button — bottom center (shows on hover) */}
        {!isOutOfStock && showPrice && (
          <div className={cn(
            "absolute bottom-0 inset-x-0 z-20 transition-all duration-300",
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
          )}>
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="w-full py-3.5 bg-[#002216]/95 hover:bg-[#003E29] text-white text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 transition-colors backdrop-blur-sm"
            >
              {isAddingToCart ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : addedToCart ? (
                <><Check className="w-4 h-4 text-white" /> Added</>
              ) : (
                "Add to Cart"
              )}
            </button>
          </div>
        )}
      </div>

      {/* ── Info section ── */}
      <div className="flex flex-col items-center text-center pt-4 pb-5 px-2">
        {/* Category */}
        {product.category?.name && (
          <span className="text-[9px] uppercase tracking-[0.3em] mb-1.5" style={{ color: "#B08D57" }}>
            {product.category.name}
          </span>
        )}

        {/* Name */}
        <Link href={`/products/${product.slug}`} className="block mb-1.5">
          <h3 className="font-display text-[17px] font-medium leading-snug text-neutral-900 hover:text-[#003E29] transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        {showPrice ? (
          <div className="flex items-center justify-center gap-2">
            {originalPrice && (
              <span className="text-xs text-neutral-400 line-through font-light">
                {formatCurrency(originalPrice)}
              </span>
            )}
            <span className="text-[13px] tracking-[0.08em] text-neutral-800">
              {formatCurrency(displayPrice)}
            </span>
          </div>
        ) : (
          <Link href="/auth" className="text-[11px] uppercase tracking-[0.2em] text-neutral-600 hover:text-[#B08D57] transition-colors">
            Login for Price
          </Link>
        )}

        {/* Rating */}
        {product.avgRating > 0 && (
          <div className="flex items-center gap-0.5 mt-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={cn(
                  "w-3 h-3",
                  s <= Math.round(product.avgRating)
                    ? "fill-[#B08D57] text-[#B08D57]"
                    : "text-neutral-200 fill-neutral-200"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
