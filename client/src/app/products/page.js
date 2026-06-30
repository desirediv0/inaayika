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
    <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden animate-pulse shadow-sm">
      <div className="aspect-square bg-zinc-50 relative animate-pulse" />
      <div className="p-3.5 space-y-3">
        <div className="space-y-1.5">
          <div className="h-4 bg-zinc-100 rounded-full w-full" />
          <div className="h-3 bg-zinc-50 rounded-full w-2/3" />
        </div>
        <div className="flex justify-between items-center pt-2">
          <div className="space-y-1">
            <div className="h-4 bg-zinc-100 rounded-full w-14" />
          </div>
          <div className="h-8 bg-zinc-100 rounded-xl w-16" />
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
    <div className="border-b border-zinc-100 py-4 last:border-b-0">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left transition-colors"
      >
        <span className="text-xs   text-zinc-950 uppercase tracking-widest">{title}</span>
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
  const [drawerOpen, setDrawerOpen] = useState(false);
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

  const [priceRange, setPriceRange] = useState({ min: minPrice || 0, max: maxPrice || 1000 });
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [pagination, setPagination] = useState({ page: pageParam, limit: 12, total: 0, pages: 0 });

  const [filters, setFilters] = useState({
    search: searchQuery, category: categorySlug, productType,
    color: colorId, size: sizeId, minPrice, maxPrice,
    sort: sortParam, order: orderParam,
  });

  /* ── Sync search input ── */
  useEffect(() => { setSearchInput(filters.search || ""); }, [filters.search]);

  /* ── Fetch Filter Details ── */
  useEffect(() => {
    Promise.all([
      fetchApi("/public/categories"),
      fetchApi("/public/filter-attributes"),
    ]).then(([catRes, attrRes]) => {
      setCategories(catRes.data.categories || []);
      setColors(attrRes.data.colors || []);
      setSizes(attrRes.data.sizes || []);
      if (Array.isArray(attrRes.data.attributes)) {
        setAllAttributes(attrRes.data.attributes);
      } else {
        const attrs = [];
        if (attrRes.data.colors?.length) attrs.push({ id: "color-attr", name: "Color", values: attrRes.data.colors });
        if (attrRes.data.sizes?.length) attrs.push({ id: "size-attr", name: "Size", values: attrRes.data.sizes });
        setAllAttributes(attrs);
      }
    }).catch(console.error);
  }, []);

  /* ── Fetch Products ── */
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let response;
        if (filters.productType) {
          const q = new URLSearchParams({ limit: String(pagination.limit * pagination.page) });
          response = await fetchApi(`/public/products/type/${filters.productType}?${q}`);
          const all = response.data?.products || [];
          const s = (pagination.page - 1) * pagination.limit;
          setProducts(all.slice(s, s + pagination.limit));
          setPagination((p) => ({ ...p, total: all.length, pages: Math.ceil(all.length / p.limit) }));
        } else {
          const q = new URLSearchParams({
            page: String(pagination.page),
            limit: String(pagination.limit),
            sort: ["createdAt", "updatedAt", "name", "price", "featured"].includes(filters.sort) ? filters.sort : "createdAt",
            order: filters.order,
          });
          if (filters.search) q.append("search", filters.search);
          if (filters.category) q.append("category", filters.category);
          if (filters.minPrice) q.append("minPrice", filters.minPrice);
          if (filters.maxPrice) q.append("maxPrice", filters.maxPrice);

          const attrIds = new Set();
          if (selectedColors.length > 0) { q.append("color", selectedColors[0]); selectedColors.forEach((id) => attrIds.add(id)); }
          if (selectedSizes.length > 0) { q.append("size", selectedSizes[0]); selectedSizes.forEach((id) => attrIds.add(id)); }
          Object.keys(selectedAttributes).forEach((k) => {
            if (k !== "color" && k !== "size") (selectedAttributes[k] || []).forEach((id) => attrIds.add(id));
          });
          if (attrIds.size > 0) q.append("attributeValueIds", [...attrIds].join(","));

          response = await fetchApi(`/public/products?${q}`);
          setProducts(response.data.products || []);
          setPagination(response.data.pagination || {});
        }
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

  const handleFilterChange = (name, value) => {
    const nf = { ...filters, [name]: value };
    setFilters(nf);
    updateURL(nf);
    if (pagination.page !== 1) setPagination((p) => ({ ...p, page: 1 }));
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
    setPriceRange({ min: 0, max: 1000 });
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
    const nf = { ...filters, sort, order };
    setFilters(nf);
    updateURL(nf);
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
                className={`text-xs flex items-center justify-between w-full transition-colors ${filters.category === cat.slug ? "text-[#003E29]  " : "text-zinc-500 hover:text-zinc-950"
                  }`}
              >
                <span>{cat.name}</span>
                {cat.productCount !== undefined && (
                  <span className="text-[10px] text-zinc-400 font-medium">{cat.productCount}</span>
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
        <div className="space-y-4">
          <input
            type="range"
            min="0"
            max="2000"
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
            className="w-full accent-black cursor-pointer bg-zinc-200 h-1 rounded-lg"
          />
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>Price: ₹{priceRange.min} — ₹{priceRange.max}</span>
            <button
              onClick={() => {
                handleFilterChange("minPrice", String(priceRange.min));
                handleFilterChange("maxPrice", String(priceRange.max));
              }}
              className="px-4 py-1.5 bg-black text-white text-[10px]   tracking-widest uppercase hover:bg-zinc-900 transition-colors"
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
                      <span className={active ? "  text-[#003E29]" : ""}>{c.name}</span>
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
                    className={`text-xs block text-left w-full transition-colors ${active ? "text-[#003E29]  " : "text-zinc-500 hover:text-zinc-950"
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
    <div className="bg-white min-h-screen font-sans">

      {/* ── Header Breadcrumb & Title ── */}
      <div className="relative w-full h-[180px] bg-[#f9f9f9] border-b border-zinc-100 flex items-center justify-center overflow-hidden mb-8">
        <div className="text-center relative z-10">
          <div className="text-[10px] text-zinc-400   uppercase tracking-[0.2em] flex items-center justify-center gap-1.5 mb-2">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <span className="text-zinc-300">•</span>
            <span>Shop</span>
          </div>
          <h1 className="text-4xl   text-zinc-950 tracking-tight">Shop</h1>
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

      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* ── Left Sidebar (3 cols) ── */}
          <aside className="lg:col-span-3 hidden lg:block border-r border-zinc-100 pr-8">
            <SidebarContent />
          </aside>

          {/* ── Right Product Area (9 cols) ── */}
          <div className="lg:col-span-9 space-y-8">

            {/* Top Promo Banner inside Shop area */}
            <div className="relative rounded-3xl overflow-hidden bg-[#F9F9F9] border border-zinc-100 flex flex-col md:flex-row items-stretch shadow-sm">
              <div className="p-8 md:p-12 flex flex-col justify-center flex-1">
                <h3 className="text-lg   text-zinc-950 mb-2">Free Shipping On Over ₹999</h3>
                <p className="text-xs text-zinc-500 leading-relaxed mb-6">
                  For the terms of the campaign, check our details page. Handcrafted adornments delivered to your doorstep.
                </p>
                <div>
                  <Link
                    href="/products?productType=featured"
                    className="inline-block bg-black hover:bg-zinc-900 text-white text-[10px]   uppercase tracking-widest px-6 py-3 transition-colors"
                  >
                    See More Products
                  </Link>
                </div>
              </div>
              <div className="relative w-full md:w-[35%] min-h-[200px] md:min-h-full">
                <Image
                  src="/shop-banner.png"
                  alt="Exclusive Campaign Model"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Fast Filters Bar */}
            <div className="bg-[#FAF9F6] border border-zinc-100 rounded-2xl p-4 flex flex-wrap items-center gap-3">
              <span className="text-[10px]   text-zinc-400 uppercase tracking-wider">Fast Filters:</span>
              <button
                onClick={() => handleFilterChange("productType", filters.productType === "featured" ? "" : "featured")}
                className={`px-3 py-1 text-[10px]   rounded-full border uppercase tracking-wider transition-colors ${filters.productType === "featured" ? "bg-black border-black text-white" : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-400"
                  }`}
              >
                Featured
              </button>
              <button
                onClick={() => handleFilterChange("productType", filters.productType === "bestseller" ? "" : "bestseller")}
                className={`px-3 py-1 text-[10px]   rounded-full border uppercase tracking-wider transition-colors ${filters.productType === "bestseller" ? "bg-black border-black text-white" : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-400"
                  }`}
              >
                Best Sellers
              </button>
              <button
                onClick={() => handleFilterChange("productType", filters.productType === "trending" ? "" : "trending")}
                className={`px-3 py-1 text-[10px]   rounded-full border uppercase tracking-wider transition-colors ${filters.productType === "trending" ? "bg-black border-black text-white" : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-400"
                  }`}
              >
                Top Rated
              </button>
              <button
                onClick={clearFilters}
                className="px-3 py-1 text-[10px]   rounded-full border bg-white border-zinc-200 text-zinc-400 uppercase tracking-wider hover:border-zinc-400 transition-colors"
              >
                Reset Filters
              </button>
            </div>

            {/* Controls Row (Stats, Columns, Sort) */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-zinc-100 pb-5">

              {/* Results counter */}
              <div className="text-xs text-zinc-500">
                {loading ? (
                  <span className="h-4 bg-zinc-100 animate-pulse rounded w-24 block" />
                ) : (
                  <span>Showing 1–{products.length} of {pagination.total || 0} results</span>
                )}
              </div>

              {/* Layout controls */}
              <div className="flex items-center gap-6">

                {/* Column sizes for desktop grid */}
                <div className="hidden md:flex items-center gap-1.5 border border-zinc-200 p-0.5 rounded bg-zinc-50">
                  {[2, 3, 4, 5].map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setViewMode("grid");
                        setViewCols(c);
                      }}
                      className={`text-[10px]   w-6 h-6 flex items-center justify-center transition-colors ${viewMode === "grid" && viewCols === c ? "bg-black text-white" : "text-zinc-400 hover:text-black"
                        }`}
                    >
                      {c}
                    </button>
                  ))}
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1 flex items-center justify-center transition-colors ${viewMode === "list" ? "bg-black text-white" : "text-zinc-400 hover:text-black"
                      }`}
                    title="List View"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Sort selector */}
                <div className="flex items-center gap-2 border border-zinc-200 rounded px-3 py-1.5 bg-white">
                  <select
                    onChange={handleSortChange}
                    className="text-xs text-zinc-700 bg-white focus:outline-none cursor-pointer"
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
                <div className="text-center py-16 border border-zinc-100 rounded-3xl bg-zinc-50">
                  <h3 className="text-sm   text-zinc-950 mb-1">No products found</h3>
                  <p className="text-xs text-zinc-500 mb-4">Try removing some filter choices.</p>
                  <button
                    onClick={clearFilters}
                    className="px-5 py-2 bg-black text-white text-xs   uppercase tracking-widest hover:bg-zinc-900 transition-colors"
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
                  className="w-10 h-10 border border-zinc-200 hover:border-black flex items-center justify-center rounded-xl text-zinc-500 hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {[...Array(pagination.pages)].map((_, i) => {
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`w-10 h-10 border   text-xs flex items-center justify-center rounded-xl transition-all ${p === pagination.page
                        ? "bg-black border-black text-white scale-105"
                        : "border-zinc-200 text-zinc-500 hover:border-black hover:text-black"
                        }`}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages || loading}
                  className="w-10 h-10 border border-zinc-200 hover:border-black flex items-center justify-center rounded-xl text-zinc-500 hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
    <div className="min-h-screen" style={{ background: "#ffffff" }}>
      <ClientOnly fallback={<div className="p-8 text-center animate-pulse text-zinc-400">Loading shop...</div>}>
        <Suspense fallback={<div className="p-8 text-center animate-pulse text-zinc-400">Loading shop...</div>}>
          <ProductsContent />
        </Suspense>
      </ClientOnly>
    </div>
  );
}