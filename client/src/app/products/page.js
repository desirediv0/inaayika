"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchApi } from "@/lib/utils";
import {
  ChevronLeft, ChevronRight, List,
} from "lucide-react";
import { ClientOnly } from "@/components/client-only";
import { ProductCard } from "@/components/products/ProductCard";
import Link from "next/link";

/* ─────────────────────────────────────────────
   SKELETON
───────────────────────────────────────────── */
function ProductCardSkeleton() {
  return (
    <div className="bg-white overflow-hidden animate-pulse">
      <div className="aspect-square bg-[#F7F3EB] relative animate-pulse" />
      <div className="p-3.5 space-y-3">
        <div className="space-y-1.5">
          <div className="h-4 bg-[#F7F3EB] w-full" />
          <div className="h-3 bg-[#FDFBF7] w-2/3 mx-auto" />
        </div>
        <div className="flex justify-center items-center pt-2">
          <div className="h-4 bg-[#F7F3EB] w-14" />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ACCORDION FILTER
───────────────────────────────────────────── */
function FilterSection({ title, isOpen, onToggle, children }) {
  return (
    <div className="border-b py-4 last:border-b-0" style={{ borderColor: "#E9E2D5" }}>
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left transition-colors"
      >
        <span className="text-[11px] text-neutral-900 uppercase tracking-[0.25em] font-medium">{title}</span>
        {isOpen ? (
          <span className="text-zinc-400   text-sm leading-none">—</span>
        ) : (
          <span className="text-zinc-400   text-sm leading-none">+</span>
        )}
      </button>
      <div className={`overflow-hidden transition-all duration-200 ${isOpen ? "max-h-[300px] mt-4" : "max-h-0"}`}>
        <div>{children}</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PRODUCTS CONTENT
───────────────────────────────────────────── */
function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const decodePlus = (s) => (s ? s.replace(/\+/g, " ") : "");
  const searchQuery = decodePlus(searchParams.get("search") || "");
  const categorySlug = searchParams.get("category") || "";
  const productType = searchParams.get("productType") || "";
  const colorId = searchParams.get("color") || "";
  const sizeId = searchParams.get("size") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sortParam = searchParams.get("sort") || "createdAt";
  const orderParam = searchParams.get("order") || "desc";
  const pageParam = parseInt(searchParams.get("page")) || 1;

  /* ── State ── */
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [allAttributes, setAllAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [viewCols, setViewCols] = useState(4); // 2, 3, 4, 5
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"

  const [selectedColors, setSelectedColors] = useState(colorId ? [colorId] : []);
  const [selectedSizes, setSelectedSizes] = useState(sizeId ? [sizeId] : []);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
    color: true,
    size: true
  });

  const [selectedPredefinedRange, setSelectedPredefinedRange] = useState(() => {
    if (!minPrice && !maxPrice) return "all";
    const minN = Number(minPrice || 10);
    const maxN = Number(maxPrice || 10000);
    if (minN === 10 && maxN === 499) return "under499";
    if (minN === 500 && maxN === 999) return "500-999";
    if (minN === 1000 && maxN === 2499) return "1000-2499";
    if (minN === 2500 && maxN === 4999) return "2500-4999";
    if (minN === 5000 && maxN === 10000) return "5000-10000";
    if (minN === 10 && maxN === 10000) return "all";
    return "custom";
  });
  const [maxPossiblePrice, setMaxPossiblePrice] = useState(10000);
  const [priceRange, setPriceRange] = useState({ min: minPrice ? Number(minPrice) : 10, max: maxPrice ? Number(maxPrice) : 10000 });
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [pagination, setPagination] = useState({ page: pageParam, limit: 12, total: 0, pages: 0 });

  const [filters, setFilters] = useState({
    search: searchQuery, category: categorySlug, productType,
    color: colorId, size: sizeId, minPrice, maxPrice,
    sort: sortParam, order: orderParam,
  });

  /* ── Sync search input ── */
  useEffect(() => { setSearchInput(filters.search || ""); }, [filters.search]);

  /* ── Fetch Max Price and Filter Details ── */
  useEffect(() => {
    Promise.all([
      fetchApi("/public/categories"),
      fetchApi("/public/filter-attributes"),
      fetchApi("/public/products/max-price"),
    ]).then(([catRes, attrRes, maxPriceRes]) => {
      setCategories(catRes.data?.categories || []);
      setColors(attrRes.data?.colors || []);
      setSizes(attrRes.data?.sizes || []);
      if (Array.isArray(attrRes.data?.attributes)) {
        setAllAttributes(attrRes.data.attributes);
      } else {
        const attrs = [];
        if (attrRes.data?.colors?.length) attrs.push({ id: "color-attr", name: "Color", values: attrRes.data.colors });
        if (attrRes.data?.sizes?.length) attrs.push({ id: "size-attr", name: "Size", values: attrRes.data.sizes });
        setAllAttributes(attrs);
      }
      if (maxPriceRes.data?.maxPrice) {
        const fetchedMax = Math.ceil(maxPriceRes.data.maxPrice);
        setMaxPossiblePrice(fetchedMax);
        if (!maxPrice) {
          setPriceRange((prev) => ({ ...prev, max: fetchedMax }));
        }
      }
    }).catch(console.error);
  }, []);

  /* ── Fetch Products ── */
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const q = new URLSearchParams({
          page: String(pagination.page),
          limit: String(pagination.limit),
          sort: filters.sort || "createdAt",
          order: filters.order || "desc",
        });
        if (filters.search) q.append("search", filters.search);
        if (filters.category) q.append("category", filters.category);
        if (filters.productType) q.append("productType", filters.productType);
        if (filters.minPrice) q.append("minPrice", filters.minPrice);
        if (filters.maxPrice) q.append("maxPrice", filters.maxPrice);

        const attrIds = new Set();
        if (selectedColors.length > 0) { q.append("color", selectedColors[0]); selectedColors.forEach((id) => attrIds.add(id)); }
        if (selectedSizes.length > 0) { q.append("size", selectedSizes[0]); selectedSizes.forEach((id) => attrIds.add(id)); }
        Object.keys(selectedAttributes).forEach((k) => {
          if (k !== "color" && k !== "size") (selectedAttributes[k] || []).forEach((id) => attrIds.add(id));
        });
        if (attrIds.size > 0) q.append("attributeValueIds", [...attrIds].join(","));

        const response = await fetchApi(`/public/products?${q}`);
        setProducts(response.data?.products || []);
        setPagination(response.data?.pagination || { page: 1, limit: 12, total: 0, pages: 0 });
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination.page, selectedColors, selectedSizes, selectedAttributes]);

  /* ── URL builder ── */
  const updateURL = (f) => {
    const pairs = [];
    const add = (k, v) => {
      if (v !== undefined && v !== null && v !== "")
        pairs.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(v)).replace(/%20/g, "+")}`);
    };
    add("search", f.search); add("category", f.category); add("productType", f.productType);
    add("color", f.color); add("size", f.size);
    add("minPrice", f.minPrice); add("maxPrice", f.maxPrice);
    if (f.sort !== "createdAt" || f.order !== "desc") { add("sort", f.sort); add("order", f.order); }
    if (f.page > 1) add("page", f.page);
    router.push(pairs.length ? `?${pairs.join("&")}` : window.location.pathname, { scroll: false });
  };

  const handleMultipleFiltersChange = (updates) => {
    const nf = { ...filters, ...updates };
    setFilters(nf);
    updateURL(nf);
    if (pagination.page !== 1) setPagination((p) => ({ ...p, page: 1 }));
  };

  const handleFilterChange = (name, value) => {
    handleMultipleFiltersChange({ [name]: value });
  };

  const handleAttrChange = (attrName, valueId) => {
    const k = attrName.toLowerCase();
    const cur = selectedAttributes[k] || [];
    const updated = cur.includes(valueId) ? cur.filter((id) => id !== valueId) : [valueId];
    setSelectedAttributes((p) => ({ ...p, [k]: updated }));
    if (k === "color") { setSelectedColors(updated); handleFilterChange("color", updated[0] || ""); }
    else if (k === "size") { setSelectedSizes(updated); handleFilterChange("size", updated[0] || ""); }
  };

  const clearFilters = () => {
    const cf = { search: "", category: "", productType: "", color: "", size: "", minPrice: "", maxPrice: "", sort: "createdAt", order: "desc" };
    setFilters(cf); setSelectedColors([]); setSelectedSizes([]); setSelectedAttributes({});
    setPriceRange({ min: 10, max: 10000 });
    setSelectedPredefinedRange("all");
    updateURL(cf); setPagination((p) => ({ ...p, page: 1 }));
  };

  const handleSortChange = (e) => {
    const map = {
      default: ["createdAt", "desc"],
      "price-asc": ["price", "asc"],
      "price-desc": ["price", "desc"],
      name: ["name", "asc"],
      featured: ["featured", "desc"]
    };
    const [sort, order] = map[e.target.value] || ["createdAt", "desc"];
    handleMultipleFiltersChange({ sort, order });
  };

  const getSortValue = () => {
    if (filters.sort === "price" && filters.order === "asc") return "price-asc";
    if (filters.sort === "price" && filters.order === "desc") return "price-desc";
    if (filters.sort === "name") return "name";
    if (filters.sort === "featured") return "featured";
    return "default";
  };

  const handlePageChange = (p) => {
    if (p < 1 || p > pagination.pages) return;
    setPagination((prev) => ({ ...prev, page: p }));
    const params = new URLSearchParams(searchParams.toString());
    p > 1 ? params.set("page", p) : params.delete("page");
    router.push(`${window.location.pathname}?${params.toString()}`, { scroll: false });
  };

  const activeCount = [
    filters.search, filters.category, filters.productType,
    selectedColors.length > 0, selectedSizes.length > 0,
    filters.minPrice, filters.maxPrice,
  ].filter(Boolean).length;

  const getColsClass = () => {
    if (viewMode === "list") return "grid-cols-1";
    if (viewCols === 2) return "grid-cols-2";
    if (viewCols === 3) return "grid-cols-2 md:grid-cols-3";
    if (viewCols === 5) return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5";
    return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";
  };

  const SidebarContent = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <FilterSection
        title="Filter By Categories"
        isOpen={!!openSections.categories}
        onToggle={() => setOpenSections((p) => ({ ...p, categories: !p.categories }))}
      >
        <ul className="space-y-2.5">
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => handleFilterChange("category", filters.category === cat.slug ? "" : cat.slug)}
                className={`text-xs flex items-center justify-between w-full transition-colors ${filters.category === cat.slug ? "text-[#003E29] font-bold" : "text-zinc-500 hover:text-zinc-950"
                  }`}
              >
                <span>{cat.name}</span>
                {cat._count?.products !== undefined && (
                  <span className="text-[10px] text-zinc-400 font-medium">{cat._count.products}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </FilterSection>

      {/* Price Filter */}
      <FilterSection
        title="Filter By Price"
        isOpen={!!openSections.price}
        onToggle={() => setOpenSections((p) => ({ ...p, price: !p.price }))}
      >
        <div className="space-y-4 pt-1">
          {/* Dropdown Box for Pre-defined Price Ranges */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-1.5 font-semibold">
              Select Price Range
            </label>
            <select
              value={selectedPredefinedRange}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedPredefinedRange(val);
                let min = 10;
                let max = 10000;
                if (val === "under499") { min = 10; max = 499; }
                else if (val === "500-999") { min = 500; max = 999; }
                else if (val === "1000-2499") { min = 1000; max = 2499; }
                else if (val === "2500-4999") { min = 2500; max = 4999; }
                else if (val === "5000-10000") { min = 5000; max = 10000; }
                else if (val === "all") { min = 10; max = 10000; }

                if (val !== "custom") {
                  setPriceRange({ min, max });
                  handleMultipleFiltersChange({
                    minPrice: String(min),
                    maxPrice: String(max),
                  });
                }
              }}
              className="w-full p-2 bg-white border border-[#E9E2D5] text-xs font-medium text-zinc-800 rounded focus:outline-none focus:border-[#003E29] cursor-pointer shadow-sm"
            >
              <option value="all">All Prices (₹10 - ₹10,000)</option>
              <option value="under499">Under ₹499</option>
              <option value="500-999">₹500 - ₹999</option>
              <option value="1000-2499">₹1,000 - ₹2,499</option>
              <option value="2500-4999">₹2,500 - ₹4,999</option>
              <option value="5000-10000">₹5,000 - ₹10,000</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {/* Smooth Range Slider (10 to 10000) */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
              <span>Max: ₹{priceRange.max}</span>
              <span>₹10,000</span>
            </div>
            <input
              type="range"
              min="10"
              max="10000"
              step="10"
              value={priceRange.max}
              onChange={(e) => {
                const newMax = parseInt(e.target.value) || 10000;
                setPriceRange((prev) => ({ ...prev, max: newMax }));
                setSelectedPredefinedRange("custom");
              }}
              className="w-full accent-[#003E29] cursor-pointer bg-zinc-200 h-2 rounded-lg transition-all"
            />
          </div>

          {/* Direct Min & Max Inputs */}
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <span className="text-[9px] uppercase tracking-wider text-zinc-400 block mb-0.5 font-semibold">Min ₹</span>
              <input
                type="number"
                min="10"
                max="10000"
                value={priceRange.min}
                onChange={(e) => {
                  const val = Math.max(10, Math.min(10000, parseInt(e.target.value) || 10));
                  setPriceRange((prev) => ({ ...prev, min: val }));
                  setSelectedPredefinedRange("custom");
                }}
                className="w-full px-2.5 py-1.5 border border-[#E9E2D5] rounded text-xs text-zinc-800 bg-white font-medium focus:outline-none focus:border-[#003E29]"
              />
            </div>
            <span className="text-zinc-400 text-xs mt-3">—</span>
            <div className="flex-1">
              <span className="text-[9px] uppercase tracking-wider text-zinc-400 block mb-0.5 font-semibold">Max ₹</span>
              <input
                type="number"
                min="10"
                max="10000"
                value={priceRange.max}
                onChange={(e) => {
                  const val = Math.max(10, Math.min(10000, parseInt(e.target.value) || 10000));
                  setPriceRange((prev) => ({ ...prev, max: val }));
                  setSelectedPredefinedRange("custom");
                }}
                className="w-full px-2.5 py-1.5 border border-[#E9E2D5] rounded text-xs text-zinc-800 bg-white font-medium focus:outline-none focus:border-[#003E29]"
              />
            </div>
          </div>

          {/* Filter Action Button */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-semibold text-[#003E29]">
              Price: ₹{priceRange.min} — ₹{priceRange.max}
            </span>
            <button
              onClick={() => {
                handleMultipleFiltersChange({
                  minPrice: String(priceRange.min),
                  maxPrice: String(priceRange.max),
                });
              }}
              className="px-4 py-1.5 bg-[#003E29] text-white text-[10px] tracking-widest uppercase hover:bg-[#002e1f] transition-colors rounded shadow-sm font-semibold"
            >
              Filter
            </button>
          </div>
        </div>
      </FilterSection>

      {/* Color Filter */}
      {colors.length > 0 && (
        <FilterSection
          title="Filter By Color"
          isOpen={!!openSections.color}
          onToggle={() => setOpenSections((p) => ({ ...p, color: !p.color }))}
        >
          <ul className="space-y-2">
            {colors.map((c) => {
              const active = selectedColors.includes(c.id);
              return (
                <li key={c.id}>
                  <button
                    onClick={() => handleAttrChange("Color", c.id)}
                    className="flex items-center justify-between w-full text-xs text-zinc-600 hover:text-black transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-zinc-200"
                        style={{ backgroundColor: c.hexCode || "#fff" }}
                      />
                      <span className={active ? "font-bold text-[#003E29]" : ""}>{c.name}</span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </FilterSection>
      )}

      {/* Size Filter */}
      {sizes.length > 0 && (
        <FilterSection
          title="Filter By Sizes"
          isOpen={!!openSections.size}
          onToggle={() => setOpenSections((p) => ({ ...p, size: !p.size }))}
        >
          <ul className="space-y-2">
            {sizes.map((s) => {
              const active = selectedSizes.includes(s.id);
              return (
                <li key={s.id}>
                  <button
                    onClick={() => handleAttrChange("Size", s.id)}
                    className={`text-xs block text-left w-full transition-colors ${active ? "text-[#003E29] font-bold" : "text-zinc-500 hover:text-zinc-950"
                      }`}
                  >
                    {s.display || s.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </FilterSection>
      )}
    </div>
  );

  return (
    <div className="min-h-screen font-sans" style={{ background: "#FDFBF7" }}>

      {/* ── Header Breadcrumb & Title ── */}
      <div className="relative w-full h-[160px] sm:h-[200px] border-b flex items-center justify-center overflow-hidden mb-6 sm:mb-10" style={{ background: "#F7F3EB", borderColor: "#E9E2D5" }}>
        <div className="text-center relative z-10">
          <div className="text-[9px] uppercase tracking-[0.35em] flex items-center justify-center gap-2 mb-3" style={{ color: "#B08D57" }}>
            <Link href="/" className="hover:text-[#003E29] transition-colors">Home</Link>
            <span>·</span>
            <span>Shop</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-medium text-neutral-900 tracking-wide">The Collection</h1>
          <span className="luxe-rule mt-4" />
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-[350px] opacity-20 md:opacity-100 pointer-events-none">
          <Image
            src="/shop-header.png"
            alt="Jewelry Backdrop"
            fill
            className="object-cover object-left"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">

        {/* Mobile Filter Toggle Accordion */}
        <div className="block lg:hidden mb-6">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="w-full py-3 px-4 bg-white border border-[#E9E2D5] rounded-xl flex items-center justify-between text-xs uppercase tracking-wider font-semibold text-[#003E29] shadow-sm"
          >
            <span>Filter Options {activeCount > 0 ? `(${activeCount} Active)` : ""}</span>
            <span>{mobileFilterOpen ? "▲ Hide" : "▼ Show Filters"}</span>
          </button>
          {mobileFilterOpen && (
            <div className="mt-3 p-4 bg-white border border-[#E9E2D5] rounded-xl shadow-md space-y-4">
              <SidebarContent />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">

          {/* ── Left Sidebar (3 cols) ── */}
          <aside className="lg:col-span-3 hidden lg:block border-r pr-8" style={{ borderColor: "#E9E2D5" }}>
            <SidebarContent />
          </aside>

          {/* ── Right Product Area (9 cols) ── */}
          <div className="lg:col-span-9 space-y-6 sm:space-y-8">

            {/* Top Promo Banner inside Shop area */}
            <div className="relative overflow-hidden border flex flex-col md:flex-row items-stretch" style={{ background: "#F7F3EB", borderColor: "#E9E2D5" }}>
              <div className="p-6 md:p-12 flex flex-col justify-center flex-1">
                <span className="luxe-eyebrow mb-3">Complimentary Shipping</span>
                <h3 className="font-display text-xl sm:text-2xl font-medium text-neutral-900 mb-2">Free Shipping on Orders Over ₹999</h3>
                <p className="text-xs text-neutral-500 font-light leading-relaxed tracking-wide mb-6">
                  For the terms of the campaign, check our details page. Handcrafted adornments delivered to your doorstep.
                </p>
                <div>
                  <Link
                    href="/products?productType=featured"
                    className="btn-luxe !px-6 !py-3"
                  >
                    See More Products
                  </Link>
                </div>
              </div>
              <div className="relative w-full md:w-[35%] min-h-[160px] md:min-h-full">
                <Image
                  src="/shop-banner.png"
                  alt="Exclusive Campaign Model"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Fast Filters Bar */}
            <div className="border p-3 sm:p-4 flex flex-wrap items-center gap-2 sm:gap-3 rounded-lg" style={{ background: "#FDFBF7", borderColor: "#E9E2D5" }}>
              <span className="text-[9px] uppercase tracking-[0.3em]" style={{ color: "#B08D57" }}>Curate:</span>
              <button
                onClick={() => handleFilterChange("productType", filters.productType === "featured" ? "" : "featured")}
                className={`px-3 sm:px-4 py-1.5 text-[10px] border uppercase tracking-[0.2em] transition-colors rounded ${filters.productType === "featured" ? "bg-[#003E29] border-[#003E29] text-white" : "bg-white border-[#E9E2D5] text-neutral-600 hover:border-[#B08D57] hover:text-[#003E29]"
                  }`}
              >
                Featured
              </button>
              <button
                onClick={() => handleFilterChange("productType", filters.productType === "bestseller" ? "" : "bestseller")}
                className={`px-3 sm:px-4 py-1.5 text-[10px] border uppercase tracking-[0.2em] transition-colors rounded ${filters.productType === "bestseller" ? "bg-[#003E29] border-[#003E29] text-white" : "bg-white border-[#E9E2D5] text-neutral-600 hover:border-[#B08D57] hover:text-[#003E29]"
                  }`}
              >
                Best Sellers
              </button>
              <button
                onClick={() => handleFilterChange("productType", filters.productType === "trending" ? "" : "trending")}
                className={`px-3 sm:px-4 py-1.5 text-[10px] border uppercase tracking-[0.2em] transition-colors rounded ${filters.productType === "trending" ? "bg-[#003E29] border-[#003E29] text-white" : "bg-white border-[#E9E2D5] text-neutral-600 hover:border-[#B08D57] hover:text-[#003E29]"
                  }`}
              >
                Top Rated
              </button>
              <button
                onClick={clearFilters}
                className="px-3 sm:px-4 py-1.5 text-[10px] border bg-white border-[#E9E2D5] text-neutral-400 uppercase tracking-[0.2em] hover:border-[#B08D57] hover:text-[#003E29] transition-colors rounded"
              >
                Reset Filters
              </button>
            </div>

            {/* Controls Row (Stats, Columns, Sort) */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-zinc-200 pb-5">

              {/* Results counter */}
              <div className="text-xs text-zinc-500">
                {loading ? (
                  <span className="h-4 bg-zinc-100 animate-pulse rounded w-24 block" />
                ) : (
                  <span>Showing 1–{products.length} of {pagination.total || 0} results</span>
                )}
              </div>

              {/* Layout controls */}
              <div className="flex items-center gap-4 sm:gap-6">

                {/* Column sizes for desktop grid */}
                <div className="hidden md:flex items-center gap-1.5 border border-zinc-200 p-0.5 rounded bg-zinc-50">
                  {[2, 3, 4, 5].map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setViewMode("grid");
                        setViewCols(c);
                      }}
                      className={`text-[10px] w-6 h-6 flex items-center justify-center transition-colors rounded ${viewMode === "grid" && viewCols === c ? "bg-[#003E29] text-white" : "text-zinc-400 hover:text-[#003E29]"
                        }`}
                    >
                      {c}
                    </button>
                  ))}
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1 flex items-center justify-center transition-colors rounded ${viewMode === "list" ? "bg-[#003E29] text-white" : "text-zinc-400 hover:text-[#003E29]"
                      }`}
                    title="List View"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Sort selector */}
                <div className="flex items-center gap-2 border border-zinc-300 rounded px-3 py-1.5 bg-white shadow-sm">
                  <select
                    value={getSortValue()}
                    onChange={handleSortChange}
                    className="text-xs text-zinc-700 bg-white focus:outline-none cursor-pointer font-medium"
                  >
                    <option value="default">Default sorting</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name">Sort by Name</option>
                    <option value="featured">Sort by Featured</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product Grid / List Container */}
            <div>
              {loading && products.length === 0 ? (
                <div className={`grid gap-6 ${getColsClass()}`}>
                  {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-20 border" style={{ background: "#F7F3EB", borderColor: "#E9E2D5" }}>
                  <h3 className="font-display text-2xl font-medium text-neutral-900 mb-1">No pieces found</h3>
                  <p className="text-xs text-neutral-500 font-light tracking-wide mb-6">Try removing some filter choices.</p>
                  <button
                    onClick={clearFilters}
                    className="btn-luxe !px-6 !py-2.5"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className={`grid gap-6 transition-opacity duration-300 ${loading ? "opacity-60 pointer-events-none" : ""} ${getColsClass()}`}>
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} viewMode={viewMode} />
                  ))}
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-1 mt-12">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1 || loading}
                  className="w-10 h-10 border border-[#E9E2D5] hover:border-[#003E29] flex items-center justify-center text-neutral-500 hover:text-[#003E29] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {[...Array(pagination.pages)].map((_, i) => {
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`w-10 h-10 border text-xs flex items-center justify-center transition-all ${p === pagination.page
                        ? "bg-[#003E29] border-[#003E29] text-white"
                        : "border-[#E9E2D5] text-neutral-500 hover:border-[#003E29] hover:text-[#003E29]"
                        }`}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages || loading}
                  className="w-10 h-10 border border-[#E9E2D5] hover:border-[#003E29] flex items-center justify-center text-neutral-500 hover:text-[#003E29] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen" style={{ background: "#FDFBF7" }}>
      <ClientOnly fallback={<div className="p-8 text-center animate-pulse text-zinc-400">Loading shop...</div>}>
        <Suspense fallback={<div className="p-8 text-center animate-pulse text-zinc-400">Loading shop...</div>}>
          <ProductsContent />
        </Suspense>
      </ClientOnly>
    </div>
  );
}