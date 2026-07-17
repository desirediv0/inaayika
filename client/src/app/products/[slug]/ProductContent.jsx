"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchApi, formatCurrency } from "@/lib/utils";
import {
  Minus, Plus, AlertCircle,
  Heart, CheckCircle, Zap,
  Truck, RefreshCw,
  Calendar, ShoppingBag, HelpCircle
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import ReviewSection from "./ReviewSection";
import { useAddVariantToCart } from "@/lib/cart-utils";
import { useCart } from "@/lib/cart-context";
import { ProductCard } from "@/components/products/ProductCard";

/* ─────────────────────────────────────────────
   UTIL
───────────────────────────────────────────── */
const getImageUrl = (img) => {
  if (!img) return "/placeholder.jpg";
  if (img.startsWith("http")) return img;
  return `https://desirediv-storage.blr1.digitaloceanspaces.com/${img}`;
};


/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
export default function ProductContent({ slug }) {
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [effectivePriceInfo, setEffectivePriceInfo] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);
  const [availableCombinations, setAvailableCombinations] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [priceSettings, setPriceSettings] = useState(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Frequently Bought Together (Bundle) State
  const [bundleSelected, setBundleSelected] = useState({});
  const [isAddingBundle, setIsAddingBundle] = useState(false);

  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { addVariantToCart } = useAddVariantToCart();
  const { addToCart } = useCart();

  /* ── Slab pricing ── */
  const getEffectivePrice = (variant, qty) => {
    if (!variant) return null;
    const salePrice = variant.salePrice ? parseFloat(variant.salePrice) : null;
    const regPrice = variant.price ? parseFloat(variant.price) : 0;

    let price = salePrice && salePrice < regPrice ? salePrice : regPrice;
    let originalPrice = salePrice && salePrice < regPrice ? regPrice : null;

    if (variant.pricingSlabs?.length > 0) {
      const sorted = [...variant.pricingSlabs].sort((a, b) => b.minQty - a.minQty);
      for (const slab of sorted) {
        if (qty >= slab.minQty && (slab.maxQty === null || qty <= slab.maxQty)) {
          return { price: parseFloat(slab.price), originalPrice: price, source: "SLAB", slab };
        }
      }
    }
    return { price, originalPrice, source: "DEFAULT", slab: null };
  };

  /* ── Fetch product ── */
  useEffect(() => {
    if (!slug) return;
    setLoading(true); setInitialLoading(true);
    fetchApi(`/public/products/${slug}`)
      .then((res) => {
        const pd = res.data.product;
        setProduct(pd);
        setRelatedProducts(res.data.relatedProducts || []);
        if (pd.images?.length) setMainImage(pd.images[0]);
        if (pd.variants?.length) {
          const combos = pd.variants
            .filter((v) => v.isActive)
            .map((v) => ({ attributeValueIds: v.attributes?.map((a) => a.attributeValueId) || [], variant: v }));
          setAvailableCombinations(combos);
          if (pd.attributeOptions?.length) {
            const defaults = {};
            pd.attributeOptions.forEach((a) => { if (a.values?.length) defaults[a.id] = a.values[0].id; });
            setSelectedAttributes(defaults);
            const match = combos.find((c) => {
              const cIds = c.attributeValueIds.sort().join(",");
              return cIds === Object.values(defaults).sort().join(",");
            });
            const v = match?.variant || pd.variants[0];
            setSelectedVariant(v);
            const moq = v.moq || 1;
            setQuantity(moq);
            setEffectivePriceInfo(getEffectivePrice(v, moq));
          } else {
            const v = pd.variants[0];
            setSelectedVariant(v);
            const moq = v.moq || 1;
            setQuantity(moq);
            setEffectivePriceInfo(getEffectivePrice(v, moq));
          }
        }
      })
      .catch((err) => { console.error(err); setError(err.message); })
      .finally(() => { setLoading(false); setInitialLoading(false); });
  }, [slug]);

  /* ── Price visibility ── */
  useEffect(() => {
    fetchApi("/public/price-visibility-settings")
      .then((r) => { if (r.success) setPriceSettings(r.data); })
      .catch(() => setPriceSettings({ hidePricesForGuests: false }));
  }, []);

  /* ── Wishlist status ── */
  useEffect(() => {
    if (!isAuthenticated || !product) return;
    fetchApi("/users/wishlist", { credentials: "include" })
      .then((r) => setIsInWishlist(r.data.wishlistItems?.some((i) => i.productId === product.id)))
      .catch(console.error);
  }, [isAuthenticated, product]);

  /* ── Scroll listener for sticky bar ── */
  useEffect(() => {
    const handleScroll = () => {
      const btn = document.getElementById("main-add-to-cart-btn");
      if (btn) {
        const rect = btn.getBoundingClientRect();
        setShowStickyBar(rect.bottom < 0);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ── Initialize Bundle checkboxes ── */
  useEffect(() => {
    if (product) {
      const initial = { [product.id]: true };
      relatedProducts.slice(0, 3).forEach((p) => {
        initial[p.id] = true;
      });
      setBundleSelected(initial);
    }
  }, [product, relatedProducts]);

  /* ── Attribute select ── */
  const handleAttributeChange = (attrId, valueId) => {
    const next = { ...selectedAttributes, [attrId]: valueId };
    setSelectedAttributes(next);
    const selIds = Object.values(next).sort();
    const match = availableCombinations.find((c) => {
      const cIds = c.attributeValueIds.sort();
      return cIds.length === selIds.length && cIds.every((id, i) => id === selIds[i]);
    });
    if (match) {
      setSelectedVariant(match.variant);
      const moq = match.variant.moq || 1;
      const qty = quantity < moq ? moq : quantity;
      if (quantity < moq) setQuantity(qty);
      setEffectivePriceInfo(getEffectivePrice(match.variant, qty));
    } else {
      setSelectedVariant(null); setEffectivePriceInfo(null);
    }
  };

  const getAvailableValues = (attrId) => {
    if (!product?.attributeOptions) return [];
    const attr = product.attributeOptions.find((a) => a.id === attrId);
    if (!attr?.values) return [];
    const others = { ...selectedAttributes }; delete others[attrId];
    const available = new Set();
    availableCombinations.forEach((c) => {
      const othIds = Object.values(others);
      if (othIds.length === 0 || othIds.every((id) => c.attributeValueIds.includes(id)))
        c.variant.attributes?.forEach((a) => { if (a.attributeId === attrId) available.add(a.attributeValueId); });
    });
    return attr.values.filter((v) => available.has(v.id));
  };

  /* ── Quantity ── */
  const handleQuantityChange = (delta) => {
    const moq = selectedVariant?.moq || 1;
    const stock = selectedVariant?.stock || selectedVariant?.quantity || 0;
    const next = quantity + delta;
    if (next < moq) return;
    if (stock > 0 && next > stock) return;
    setQuantity(next);
    if (selectedVariant) setEffectivePriceInfo(getEffectivePrice(selectedVariant, next));
  };

  /* ── Add to cart ── */
  const handleAddToCart = async () => {
    const v = selectedVariant || product?.variants?.[0];
    if (!v) return;
    setIsAddingToCart(true); setCartSuccess(false);
    try {
      const result = await addVariantToCart(v, quantity, product.name);
      if (result.success) { setCartSuccess(true); setTimeout(() => setCartSuccess(false), 3000); }
    } catch (err) { console.error(err); }
    finally { setIsAddingToCart(false); }
  };

  /* ── Add Bundle to Cart ── */
  const handleAddBundleToCart = async () => {
    setIsAddingBundle(true);
    try {
      // Add main product
      const mainV = selectedVariant || product?.variants?.[0];
      if (mainV && bundleSelected[product.id]) {
        await addToCart(mainV.id, quantity);
      }
      // Add checked related products
      for (const p of relatedProducts.slice(0, 3)) {
        if (bundleSelected[p.id]) {
          const v = p.variants?.[0];
          if (v) {
            await addToCart(v.id, 1);
          }
        }
      }
      setCartSuccess(true);
      setTimeout(() => setCartSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAddingBundle(false);
    }
  };

  /* ── Wishlist ── */
  const handleWishlist = async () => {
    if (!isAuthenticated) { router.push(`/auth?redirect=/products/${slug}`); return; }
    setIsAddingToWishlist(true);
    try {
      if (isInWishlist) {
        const r = await fetchApi("/users/wishlist", { credentials: "include" });
        const item = r.data.wishlistItems.find((i) => i.productId === product.id);
        if (item) { await fetchApi(`/users/wishlist/${item.id}`, { method: "DELETE", credentials: "include" }); setIsInWishlist(false); }
      } else {
        await fetchApi("/users/wishlist", { method: "POST", credentials: "include", body: JSON.stringify({ productId: product.id }) });
        setIsInWishlist(true);
      }
    } catch (err) { console.error(err); }
    finally { setIsAddingToWishlist(false); }
  };

  /* ── Helper: Get Delivery Range ── */
  const getDeliveryDates = () => {
    const today = new Date();
    const format = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const start = new Date(today); start.setDate(today.getDate() + 3);
    const end = new Date(today); end.setDate(today.getDate() + 6);
    return `${format(start).toUpperCase()} - ${format(end).toUpperCase()}`;
  };

  /* ── Images ── */
  const getImages = () => {
    if (selectedVariant?.images?.length) return selectedVariant.images;
    if (product?.images?.length) return product.images;
    const vwi = product?.variants?.find((v) => v.images?.length);
    return vwi?.images || [];
  };

  /* ── Price display ── */
  const PriceDisplay = () => {
    if (initialLoading)
      return <div className="h-10 w-36 bg-gray-100 rounded animate-pulse" />;

    const hidePrices = priceSettings?.hidePricesForGuests && !isAuthenticated;
    if (hidePrices || priceSettings === null)
      return (
        <div>
          <p className="text-xl   text-gray-400">Login to view price</p>
          <Link href={`/auth?redirect=/products/${slug}`}
            className="mt-1.5 inline-block text-sm text-neutral-800 underline underline-offset-2">
            Sign in
          </Link>
        </div>
      );

    if (product?.flashSale?.isActive) {
      const flashPrice = parseFloat(product.flashSale.flashSalePrice);
      const regPrice = parseFloat(product.basePrice);
      return (
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-light tracking-wide text-neutral-900">
            {formatCurrency(flashPrice)}
          </span>
          <span className="text-sm text-gray-400 line-through">
            {formatCurrency(regPrice)}
          </span>
          <span className="text-xs   text-red-600 uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded">
            -{product.flashSale.discountPercentage}%
          </span>
        </div>
      );
    }

    if (selectedVariant) {
      const info = effectivePriceInfo || getEffectivePrice(selectedVariant, quantity);
      if (!info) return <p className="text-xl   text-gray-400">Price unavailable</p>;
      const mrp = info.originalPrice ? parseFloat(info.originalPrice) : null;
      const saleP = parseFloat(info.price);
      const hasDiff = mrp && mrp > saleP;
      const discPct = hasDiff ? Math.round(((mrp - saleP) / mrp) * 100) : 0;
      return (
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-light tracking-wide text-neutral-900">
            {formatCurrency(saleP)}
          </span>
          {hasDiff && (
            <>
              <span className="text-sm text-gray-400 line-through">
                {formatCurrency(mrp)}
              </span>
              <span className="text-xs   text-green-600 bg-green-50 px-2 py-0.5 rounded">
                {discPct}% OFF
              </span>
            </>
          )}
        </div>
      );
    }

    const bp = parseFloat(product?.basePrice) || 0;
    const rp = parseFloat(product?.regularPrice) || 0;
    const currentPrice = (product?.hasSale && rp > bp) ? bp : (bp || rp);
    const originalPrice = (product?.hasSale && rp > bp) ? rp : null;
    const discPct = originalPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;

    return (
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-light tracking-wide text-neutral-900">
          {formatCurrency(currentPrice)}
        </span>
        {originalPrice && (
          <>
            <span className="text-sm text-gray-400 line-through">
              {formatCurrency(originalPrice)}
            </span>
            <span className="text-xs   text-green-600 bg-green-50 px-2 py-0.5 rounded">
              {discPct}% OFF
            </span>
          </>
        )}
      </div>
    );
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-2 border-[#003E29] border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-neutral-400 tracking-widest uppercase font-semibold">Loading Page…</p>
    </div>
  );

  if (error || !product) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="h-8 w-8 text-neutral-500" />
      </div>
      <h2 className="text-xl    text-gray-900 mb-2">Product Not Available</h2>
      <p className="text-sm text-gray-500 mb-6">{error || "The requested item is not found."}</p>
      <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-[#003E29] text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-[#002e1f] transition-colors">
        Go Back to Gallery
      </Link>
    </div>
  );

  const images = getImages();
  const primary = mainImage && images.some((i) => i.url === mainImage.url)
    ? mainImage : (images.find((i) => i.isPrimary) || images[0]);
  const stock = selectedVariant?.stock || selectedVariant?.quantity || product.stock || 15;
  const outOfStock = stock === 0;

  // Calculate Ordered Bar values
  const orderedCount = Math.floor(((product.id ? product.id.charCodeAt(0) : 5) % 12) + 4);
  const totalBar = orderedCount + stock;
  const progressPercent = (orderedCount / totalBar) * 100;

  // Bundle calculations
  const bundleItems = [
    { id: product.id, name: product.name, price: parseFloat(effectivePriceInfo?.price || selectedVariant?.salePrice || selectedVariant?.price || product.basePrice || product.regularPrice || 0), isMain: true, stock: stock, image: primary?.url },
    ...relatedProducts.slice(0, 3).map((p) => {
      const v = p.variants?.[0] || {};
      const price = v.salePrice || v.price || p.basePrice || p.regularPrice || 0;
      return { id: p.id, name: p.name, price: parseFloat(price), isMain: false, stock: p.stock || p.quantity || 10, image: p.image || p.images?.[0]?.url };
    })
  ];

  const bundleTotal = bundleItems.reduce((sum, item) => {
    const qty = item.isMain ? quantity : 1;
    return sum + (bundleSelected[item.id] ? (item.price * qty) : 0);
  }, 0);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[10px] font-semibold tracking-widest text-neutral-400 mb-8 uppercase flex-wrap">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span>•</span>
          <Link href="/products" className="hover:text-black transition-colors">Products</Link>
          {product.category && (
            <>
              <span>•</span>
              <Link href={`/category/${product.category.slug}`} className="hover:text-black transition-colors">
                {product.category.name}
              </Link>
            </>
          )}
          <span>•</span>
          <span className="text-black   truncate max-w-[180px] sm:max-w-sm">{product.name}</span>
        </nav>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 mb-16">

          {/* LEFT COLUMN: Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">

            {/* Thumbnails (Vertical) */}
            {images.length > 1 && (
              <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto sm:max-h-[580px] no-scrollbar">
                {images.map((img, idx) => {
                  const active = primary?.url === img.url;
                  return (
                    <button
                      key={idx}
                      onClick={() => setMainImage(img)}
                      className={`relative flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 bg-neutral-50 ${active ? "border-[#003E29] shadow-sm" : "border-neutral-200 hover:border-neutral-400"
                        }`}
                    >
                      <Image src={getImageUrl(img.url)} alt="" fill className="object-cover" sizes="64px" />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Main Image Container */}
            <div className="relative flex-1 aspect-[4/5] rounded-none overflow-hidden border group" style={{ background: "#F7F3EB", borderColor: "#E9E2D5" }}>
              {images.length > 0 ? (
                <Image
                  src={getImageUrl(primary?.url)}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <Image src="/placeholder.jpg" alt={product.name} fill className="object-cover" />
              )}

              {/* Badges on image */}
              <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                {product.flashSale?.isActive && (
                  <span className="px-3 py-1.5 bg-[#003E29] text-white text-[9px]   uppercase tracking-widest rounded shadow-md flex items-center gap-1">
                    <Zap className="h-3 w-3 fill-white animate-pulse" /> FLASH SALE
                  </span>
                )}
                {outOfStock && (
                  <span className="px-3 py-1.5 bg-red-600 text-white text-[9px]   uppercase tracking-widest rounded shadow-md">
                    OUT OF STOCK
                  </span>
                )}
              </div>

              {/* Heart Wishlist Overlay */}
              <button
                onClick={handleWishlist}
                disabled={isAddingToWishlist}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full shadow-md flex items-center justify-center transition-all bg-white hover:bg-neutral-50 z-20 ${isInWishlist ? "text-red-500" : "text-gray-400 hover:text-red-400"
                  }`}
              >
                <Heart className={`h-4.5 w-4.5 ${isInWishlist ? "fill-red-500" : ""}`} />
              </button>
            </div>

          </div>

          {/* RIGHT COLUMN: Details */}
          <div className="lg:col-span-5 flex flex-col">

            {/* Title & Brand */}
            <div className="mb-4">
              {product.brand && (
                <span className="text-[10px] tracking-[0.35em] uppercase block mb-2" style={{ color: "#B08D57" }}>
                  {product.brand.name}
                </span>
              )}
              <h1 className="font-display text-4xl md:text-[2.75rem] font-medium tracking-wide text-neutral-900 leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Price display */}
            <div className="mb-6 pb-6 border-b border-neutral-100">
              <PriceDisplay />
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="text-sm text-neutral-500 leading-relaxed font-light mb-6">
                {product.shortDescription}
              </p>
            )}



            {/* Cart Alert Badge */}
            <div className="mb-6 flex items-center gap-2.5 p-3.5 rounded-none text-xs border" style={{ background: "#F7F3EB", borderColor: "#E9E2D5", color: "#8a6d3f" }}>
              <ShoppingBag className="h-4.5 w-4.5 text-amber-700 animate-bounce flex-shrink-0" />
              <span>
                <strong>12 people</strong> have this in their carts right now. It&apos;s running out!
              </span>
            </div>

            {/* Attributes Selection */}
            {product.attributeOptions?.map((attr) => {
              const values = getAvailableValues(attr.id);
              const selId = selectedAttributes[attr.id];
              const selVal = values.find((v) => v.id === selId);
              return (
                <div key={attr.id} className="mb-6">
                  <p className="text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-2.5">
                    {attr.name} {selVal && <span className="text-neutral-400 font-normal ml-1">— {selVal.value}</span>}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {values.map((v) => {
                      const active = selId === v.id;
                      return (
                        <button
                          key={v.id}
                          onClick={() => handleAttributeChange(attr.id, v.id)}
                          className={`px-4 py-2 text-xs font-semibold border rounded-lg transition-all duration-300 ${active
                            ? "border-[#003E29] bg-[#003E29] text-white shadow-sm"
                            : "border-neutral-200 text-neutral-700 hover:border-[#003E29]"
                            }`}
                        >
                          {v.value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Cart action success banner */}
            {cartSuccess && (
              <div className="flex items-center gap-2.5 p-3.5 bg-green-50 border border-green-100 rounded-xl text-xs text-green-700 mb-5 font-semibold">
                <CheckCircle className="h-4.5 w-4.5 flex-shrink-0" />
                Added to your shopping bag!
              </div>
            )}

            {/* Stepper + Add to Cart Row */}
            <div className="flex gap-3 mb-6">
              {/* Stepper */}
              <div className="flex items-center border border-neutral-300 rounded-xl overflow-hidden h-12 bg-white">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= (selectedVariant?.moq || 1) || isAddingToCart}
                  className="w-10 h-full flex items-center justify-center text-neutral-500 hover:bg-neutral-50 disabled:opacity-40"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-10 text-center   text-sm text-neutral-900">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= stock || isAddingToCart}
                  className="w-10 h-full flex items-center justify-center text-neutral-500 hover:bg-neutral-50 disabled:opacity-40"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Add to Cart button */}
              <button
                id="main-add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={isAddingToCart || outOfStock}
                className="flex-1 h-12 bg-[#003E29] hover:bg-[#002216] text-white text-[11px] uppercase tracking-[0.25em] rounded-none transition-all flex items-center justify-center gap-2 disabled:opacity-40 active:scale-[0.99]"
              >
                {isAddingToCart ? (
                  <div className="h-4 w-4 border-2 border-white/60 border-t-white rounded-full animate-spin" />
                ) : (
                  "Add to Cart"
                )}
              </button>
            </div>

            {/* Quick Delivery Tag */}
            <div className="flex items-center gap-3 py-3 px-4 bg-neutral-50 rounded-xl border border-neutral-100 text-xs text-neutral-700 mb-6">
              <Truck className="h-4.5 w-4.5 text-neutral-800" />
              <span>
                <strong>2-3 DAY DELIVERY</strong> <span className="text-neutral-400">|</span> Speedy & fully insured delivery!
              </span>
            </div>

            {/* Collapsible Info/Tags */}
            <div className="space-y-4 pt-6 border-t border-neutral-100">
              <div className="flex items-center gap-2.5 text-xs text-neutral-600">
                <Calendar className="h-4 w-4 text-neutral-400" />
                <span>ESTIMATED DELIVERY: <strong>{getDeliveryDates()}</strong></span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-neutral-600">
                <HelpCircle className="h-4 w-4 text-neutral-400" />
                <button onClick={() => setActiveTab("shipping")} className="underline hover:text-black">
                  Delivery & Return Policies
                </button>
              </div>
            </div>

            {/* Meta & Share Row */}
            <div className="pt-6 mt-6 border-t border-neutral-100 space-y-3">
              <div className="flex text-xs text-neutral-500">
                <span className="w-24 uppercase tracking-wider font-semibold">Categories:</span>
                <span className="text-neutral-800 font-medium">
                  {product.category?.name || "Jewellery"}, Premium Collection
                </span>
              </div>
              <div className="flex text-xs text-neutral-500">
                <span className="w-24 uppercase tracking-wider font-semibold">Brands:</span>
                <span className="text-neutral-800 font-medium">
                  {product.brand?.name || "Inaayika"}
                </span>
              </div>

              {/* Share links */}
              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-neutral-500">Share:</span>
                <div className="flex gap-1.5">
                  {[
                    { label: "FB", bg: "bg-[#3b5998]", url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}` },
                    { label: "TW", bg: "bg-[#1da1f2]", url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}` },
                    { label: "PT", bg: "bg-[#bd081c]", url: "#" },
                    { label: "LN", bg: "bg-[#0077b5]", url: "#" },
                    { label: "WA", bg: "bg-[#25d366]", url: `https://api.whatsapp.com/send?text=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}` }
                  ].map((s) => (
                    <a
                      key={s.label}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white   transition-transform hover:-translate-y-0.5 ${s.bg}`}
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* FREQUENTLY BOUGHT TOGETHER / BUNDLE */}
        {relatedProducts.length > 0 && (
          <div className="mb-16 border border-neutral-100 rounded-2xl p-6 md:p-8 bg-neutral-50/50 shadow-sm">
            <h3 className="text-lg    uppercase tracking-wider text-neutral-900 mb-6">
              Frequently Bought Together
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

              {/* Bundle checklist */}
              <div className="lg:col-span-8 space-y-4">
                {bundleItems.map((item, idx) => (
                  <div key={item.id} className="flex items-center gap-4 py-2 border-b border-neutral-100 last:border-0">
                    <input
                      type="checkbox"
                      id={`bundle-${item.id}`}
                      checked={!!bundleSelected[item.id]}
                      disabled={item.isMain}
                      onChange={(e) => {
                        setBundleSelected({
                          ...bundleSelected,
                          [item.id]: e.target.checked
                        });
                      }}
                      className="w-4.5 h-4.5 rounded border-neutral-300 text-black focus:ring-black cursor-pointer disabled:opacity-50"
                    />

                    <div className="relative w-12 h-14 bg-neutral-100 rounded overflow-hidden flex-shrink-0">
                      <Image src={getImageUrl(item.image)} alt="" fill className="object-cover" sizes="48px" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <label htmlFor={`bundle-${item.id}`} className="text-xs font-semibold text-neutral-800 hover:text-black cursor-pointer truncate block">
                        {item.isMain ? <span className="text-neutral-400 font-normal uppercase mr-1">This Item:</span> : null}
                        {item.name}
                      </label>
                      <p className="text-[10px] text-green-600 font-semibold mt-0.5">
                        {item.stock > 0 ? `${item.stock} in stock` : "Pre-order"}
                      </p>
                    </div>

                    <div className="text-xs   text-neutral-900">
                      {formatCurrency(item.price)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bundle checkout total */}
              <div className="lg:col-span-4 p-6 bg-white border border-neutral-100 rounded-xl flex flex-col gap-4 text-center lg:text-left shadow-sm">
                <div>
                  <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider block mb-1">
                    Selected Bundle Price
                  </span>
                  <span className="text-2xl   text-black">
                    {formatCurrency(bundleTotal)}
                  </span>
                </div>

                <button
                  onClick={handleAddBundleToCart}
                  disabled={isAddingBundle || !Object.values(bundleSelected).some(Boolean)}
                  className="w-full h-11 bg-[#003E29] hover:bg-[#002e1f] text-white text-xs   uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isAddingBundle ? "Adding Bundle..." : "Add All to Cart"}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* TABS SECTION */}
        <div className="mb-16">
          <div className="flex gap-0 border-b border-neutral-200 overflow-x-auto mb-8">
            {[
              { key: "description", label: "Description" },
              { key: "additional", label: "Additional Information" },
              { key: "reviews", label: `Reviews (${product.reviewCount || 0})` },
              { key: "shipping", label: "Shipping & Returns" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-6 py-4 text-xs   uppercase tracking-widest border-b-2 -mb-[1px] transition-all whitespace-nowrap ${activeTab === key
                  ? "border-[#003E29] text-[#003E29]"
                  : "border-transparent text-gray-400 hover:text-gray-800"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl">
            {activeTab === "description" && (
              <div
                className="prose prose-sm text-neutral-600 leading-relaxed font-light"
                dangerouslySetInnerHTML={{ __html: product.description || "No description provided." }}
              />
            )}

            {activeTab === "additional" && (
              <div className="border border-neutral-100 rounded-xl overflow-hidden text-sm">
                <table className="w-full">
                  <tbody>
                    <tr className="border-b border-neutral-100 bg-neutral-50/50">
                      <td className="py-3 px-4   text-neutral-700 w-48">Style Tag</td>
                      <td className="py-3 px-4 text-neutral-600">Handcrafted Goldsmith Premium Collection</td>
                    </tr>
                    <tr className="border-b border-neutral-100">
                      <td className="py-3 px-4   text-neutral-700">Care Advice</td>
                      <td className="py-3 px-4 text-neutral-600">Avoid contact with water, perfume, and chemicals. Store in a zip-lock bag.</td>
                    </tr>
                    <tr className="border-neutral-100">
                      <td className="py-3 px-4   text-neutral-700">Material</td>
                      <td className="py-3 px-4 text-neutral-600">925 Sterling Silver / 24K Gold Plating</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "reviews" && <ReviewSection product={product} />}

            {activeTab === "shipping" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Shipping & Delivery",
                    icon: Truck,
                    rows: [
                      ["Metro Cities", "24 – 48 Hours"],
                      ["Rest of India", "3 – 5 Business Days"],
                      ["Premium Gift Wrap", "Available on checkout"],
                      ["Free Shipping", "Available all over India"],
                    ],
                  },
                  {
                    title: "Returns & Exchange",
                    icon: RefreshCw,
                    rows: [
                      ["Easy Returns", "2-day window, unboxing video mandatory"],
                      ["Seal & Tags", "Must be intact (returns not accepted if seal is broken)"],
                      ["Support", "WhatsApp support active 9AM - 6PM"],
                      ["Process", "Doorstep pickup for exchange items"],
                    ],
                  },
                ].map(({ title, icon: Icon, rows }) => (
                  <div key={title} className="rounded-2xl p-6 border border-neutral-100 bg-neutral-50/40">
                    <h3 className="text-sm   uppercase tracking-wider text-neutral-900 mb-4 flex items-center gap-2">
                      <Icon className="h-4 w-4 text-neutral-800" />
                      {title}
                    </h3>
                    <dl className="space-y-3">
                      {rows.map(([dt, dd]) => (
                        <div key={dt} className="text-xs">
                          <dt className="  text-neutral-800 uppercase tracking-wide">{dt}</dt>
                          <dd className="text-neutral-500 mt-0.5">{dd}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="pt-12 border-t border-neutral-100">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-3xl md:text-4xl font-medium tracking-wide text-neutral-900">You May Also Like</h2>
              <Link href="/products" className="text-[10px] uppercase tracking-[0.3em] border-b pb-1 transition-colors" style={{ color: "#B08D57", borderColor: "#B08D57" }}>
                View All Collection
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}

      </div>

      {/* STICKY ADD TO CART BAR */}
      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-50 py-3.5 shadow-2xl transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-10 h-12 rounded-lg overflow-hidden bg-neutral-50 border flex-shrink-0">
                <Image src={getImageUrl(primary?.url)} alt="" fill className="object-cover" sizes="48px" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs   text-neutral-900 uppercase tracking-wide truncate">{product.name}</h4>
                <p className="text-xs text-neutral-500 font-semibold mt-0.5">
                  {formatCurrency(selectedVariant ? (effectivePriceInfo?.price || selectedVariant.price) : (product.basePrice || product.regularPrice))}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-neutral-300 rounded-lg overflow-hidden h-9 bg-white">
                <button onClick={() => handleQuantityChange(-1)} className="px-2.5 h-full hover:bg-neutral-50 disabled:opacity-40">
                  <Minus className="h-3 w-3" />
                </button>
                <span className="px-2.5   text-xs text-neutral-900">{quantity}</span>
                <button onClick={() => handleQuantityChange(1)} className="px-2.5 h-full hover:bg-neutral-50 disabled:opacity-40">
                  <Plus className="h-3 w-3" />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || outOfStock}
                className="px-6 h-9 bg-[#003E29] hover:bg-[#002216] text-white text-[10px] uppercase tracking-[0.25em] rounded-none transition-colors flex items-center justify-center"
              >
                {isAddingToCart ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}