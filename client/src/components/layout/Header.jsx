"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { fetchApi, cn, sortCategories } from "@/lib/utils";
import { ClientOnly } from "@/components/client-only";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast, Toaster } from "sonner";
import {
  FiShoppingCart, FiUser, FiMenu, FiX, FiSearch,
  FiHeart, FiChevronDown, FiChevronRight, FiPackage,
  FiLogOut, FiMapPin, FiMail, FiPhone,
  FiInstagram, FiYoutube, FiShoppingBag,
} from "react-icons/fi";
import {
  TbSearch, TbShoppingBag, TbHeart, TbUser, TbChevronDown, TbMenu2,
  TbX, TbHome, TbLayoutGrid, TbPackage, TbMapPin, TbLogout,
  TbMail, TbPhone, TbBrandWhatsapp, TbChevronRight,
} from "react-icons/tb";
import {
  User, Package, MapPin, Heart, LogOut,
  ChevronDown, Sparkles,
} from "lucide-react";

/* ── Constants ─────────────────────────────── */
const CONTACT = {
  email: "info@inaayika.com",
  phone: "+91 87964 49692",
  whatsapp: "918796449692",
};


const FOOTER_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/shipping-policy", label: "Shipping Policy" },
  { href: "/faqs", label: "FAQs" },
];

/* ── Avatar ─────────────────────────────────── */
function AvatarCircle({ name, size = "sm" }) {
  const dim = size === "lg" ? "w-11 h-11 text-base" : "w-8 h-8 text-sm";
  return (
    <div
      className={`${dim} rounded-full flex items-center justify-center text-white font-display shadow-md flex-shrink-0 border border-[#B08D57]/40`}
      style={{ background: "#003E29" }}
    >
      {name?.charAt(0)?.toUpperCase() || "U"}
    </div>
  );
}

/* ── Mobile Nav Item ────────────────────────── */
function MobileNavItem({ href, icon: Icon, label, onClick, badge }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-[#003E29] hover:bg-[#F7F3EB] transition-all duration-200"
    >
      <Icon className="h-5.5 w-5.5 text-[#003E29] flex-shrink-0 stroke-[1.75]" />
      <span className="text-sm font-medium tracking-wide text-gray-800">{label}</span>
      {badge > 0 && (
        <span className="ml-auto bg-[#003E29] text-white text-[10px] font-bold min-w-[20px] h-[20px] px-1.5 rounded-full flex items-center justify-center border border-white shadow-sm">
          {badge}
        </span>
      )}
    </Link>
  );
}

/* ── Section helper (mobile drawer) ────────── */
function DrawerSection({ title, children }) {
  return (
    <div className="mt-2 pt-2 border-t" style={{ borderColor: "#E9E2D5" }}>
      <p className="px-4 py-1.5 text-[10px] uppercase tracking-[0.3em]" style={{ color: "#B08D57" }}>{title}</p>
      <div className="space-y-0.5 px-2">{children}</div>
    </div>
  );
}

/* ════════════════════════════════════════════
   MAIN NAVBAR
════════════════════════════════════════════ */
export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const announcements = [
    "Summer Sale - Extra 25% off on Orders above ₹5000",
    "Complimentary Free Doorstep Delivery Across India on Orders Above ₹5000",
    "Introducing Lab-grown diamonds set in pure 925 sterling silver. Shop Now",
    "Summer Sale - Extra 15% off on Orders above ₹1500 + 5% off on Prepaid Orders",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentAnnouncementIndex((prev) => (prev + 1) % announcements.length);
        setIsFading(false);
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const searchInputRef = useRef(null);
  const navbarRef = useRef(null);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 10);
        const total = document.documentElement.scrollHeight - window.innerHeight;
        setScrollProgress(total > 0 ? Math.min(100, (window.scrollY / total) * 100) : 0);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (navbarRef.current && !navbarRef.current.contains(e.target))
        setActiveDropdown(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (isSearchOpen) setTimeout(() => searchInputRef.current?.focus(), 100);
  }, [isSearchOpen]);

  useEffect(() => {
    fetchApi("/public/categories")
      .then((res) => setCategories(sortCategories(res.data?.categories || [])))
      .catch(console.error);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    router.push("/");
  };

  const cartCount = getCartItemCount();

  return (
    <>
      <header
        ref={navbarRef}
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          isScrolled
            ? "bg-[#FDFBF7]/90 backdrop-blur-md shadow-[0_10px_30px_-15px_rgba(0,34,22,0.2)]"
            : "bg-[#FDFBF7]"
        )}
      >
        <Toaster position="top-center" richColors />

        {/* ── Gold reading-progress hairline ── */}
        <div className="absolute top-0 left-0 right-0 h-[2px] z-[60] pointer-events-none" aria-hidden="true">
          <div
            className="h-full transition-[width] duration-150 ease-out"
            style={{
              width: `${scrollProgress}%`,
              background: "linear-gradient(90deg, #B08D57, #E7C983)",
              boxShadow: "0 0 8px rgba(231,201,131,0.6)",
            }}
          />
        </div>

        {/* ── TOP INFO BAR (Green Bar) ── */}
        <div className="text-white/90 text-[11px] font-light py-2 px-3 sm:px-4 overflow-hidden w-full" style={{ background: "#002216", letterSpacing: "0.2em" }}>
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            {/* Left: Social Links */}
            <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
              <a
                href="https://www.instagram.com/all_about_hair_accesories?igsh=MTJ6bXA2YnZ5M2k3Ng%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-[#E1306C] hover:scale-110 transition-transform duration-300 flex items-center justify-center"
              >
                <FiInstagram className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://www.youtube.com/@Inaayikabypoojakhan"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-[#FF0000] hover:scale-110 transition-transform duration-300 flex items-center justify-center"
              >
                <FiYoutube className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Center: Promo Text */}
            <div className="flex-1 text-center tracking-[0.05em] sm:tracking-[0.2em] md:tracking-[0.3em] text-[9px] sm:text-[10px] uppercase font-light overflow-hidden h-4 flex items-center justify-center">
              <div className={`transition-all duration-500 transform flex items-center justify-center gap-1.5 truncate ${isFading ? "opacity-0 -translate-y-2" : "opacity-100 translate-y-0"}`}>
                <span className="text-[#D4AF37] flex-shrink-0">✦</span>
                <span className="truncate">{announcements[currentAnnouncementIndex]}</span>
                <span className="text-[#D4AF37] flex-shrink-0">✦</span>
              </div>
            </div>

            {/* Right: Cart, Search, Help Links */}
            <div className="hidden md:flex items-center gap-4 text-[9px] sm:text-[10px] tracking-[0.25em] uppercase font-light flex-shrink-0">
              <Link href="/cart" className="hover:text-[#D4AF37] transition-colors">Cart</Link>
              <button onClick={() => setIsSearchOpen(true)} className="hover:text-[#D4AF37] transition-colors uppercase tracking-[0.25em]">Search</button>
              <Link href="/contact" className="hover:text-[#D4AF37] transition-colors">Help</Link>
            </div>
          </div>
        </div>

        {/* ── MAIN HEADER NAVBAR ── */}
        <div className="border-b bg-transparent" style={{ borderColor: "#E9E2D5" }}>
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="relative flex items-center justify-between h-24 md:h-28 gap-3 sm:gap-4 py-2">

              {/* Left Side: Logo */}
              <div className="flex items-center flex-shrink-0">
                <Link href="/" className="flex items-center gap-2">
                  <img
                    src="/logo.png"
                    alt="Inaayika Logo"
                    className="h-16 sm:h-20 md:h-24 w-auto object-contain transition-transform duration-300 hover:scale-105"
                  />
                </Link>
              </div>

              {/* Center: Desktop Navigation Menu */}
              <div className="hidden lg:flex items-center justify-center gap-8 xl:gap-10 mx-auto">
                <Link href="/" className="luxe-link text-neutral-800 hover:text-[#003E29] transition-colors">
                  Home
                </Link>

                <Link href="/products" className="luxe-link text-neutral-800 hover:text-[#003E29] transition-colors">
                  Shop
                </Link>

                <Link href="/categories" className="luxe-link text-neutral-800 hover:text-[#003E29] transition-colors">
                  Collections
                </Link>

                <div className="relative group" onMouseEnter={() => setActiveDropdown("pages")} onMouseLeave={() => setActiveDropdown(null)}>
                  <span className="flex items-center gap-1.5 text-xs uppercase font-medium tracking-[0.28em] text-neutral-800 hover:text-[#003E29] transition-colors cursor-pointer">
                    Maison <FiChevronDown className="h-3 w-3" />
                  </span>
                  {activeDropdown === "pages" && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 z-50">
                      <div className="bg-white border py-3 min-w-[230px]" style={{ borderColor: "#E9E2D5", boxShadow: "0 24px 50px -20px rgba(0,34,22,0.18)" }}>
                        <Link href="/about" className="block px-6 py-2.5 text-[11px] tracking-[0.22em] uppercase text-neutral-600 hover:text-[#003E29] hover:bg-[#F7F3EB] transition-colors">About Us</Link>
                        <Link href="/contact" className="block px-6 py-2.5 text-[11px] tracking-[0.22em] uppercase text-neutral-600 hover:text-[#003E29] hover:bg-[#F7F3EB] transition-colors">Contact Us</Link>
                        <Link href="/why-us" className="block px-6 py-2.5 text-[11px] tracking-[0.22em] uppercase text-neutral-600 hover:text-[#003E29] hover:bg-[#F7F3EB] transition-colors">Why Choose Us</Link>
                        <Link href="/product-care" className="block px-6 py-2.5 text-[11px] tracking-[0.22em] uppercase text-neutral-600 hover:text-[#003E29] hover:bg-[#F7F3EB] transition-colors">Product Care Guide</Link>
                        <Link href="/shipping-policy" className="block px-6 py-2.5 text-[11px] tracking-[0.22em] uppercase text-neutral-600 hover:text-[#003E29] hover:bg-[#F7F3EB] transition-colors">Shipping Policy</Link>
                        <Link href="/return-policy" className="block px-6 py-2.5 text-[11px] tracking-[0.22em] uppercase text-neutral-600 hover:text-[#003E29] hover:bg-[#F7F3EB] transition-colors">Return Policy</Link>
                        <Link href="/cancellation-policy" className="block px-6 py-2.5 text-[11px] tracking-[0.22em] uppercase text-neutral-600 hover:text-[#003E29] hover:bg-[#F7F3EB] transition-colors">Order Cancellation</Link>
                        <Link href="/privacy-policy" className="block px-6 py-2.5 text-[11px] tracking-[0.22em] uppercase text-neutral-600 hover:text-[#003E29] hover:bg-[#F7F3EB] transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="block px-6 py-2.5 text-[11px] tracking-[0.22em] uppercase text-neutral-600 hover:text-[#003E29] hover:bg-[#F7F3EB] transition-colors">Terms &amp; Conditions</Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side: Tabler Action Icons & Cart Badge */}
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                {/* Search */}
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-neutral-800 hover:text-[#003E29] transition-colors flex items-center justify-center"
                  aria-label="Search"
                >
                  <TbSearch className="h-6 w-6 stroke-[1.75]" />
                </button>

                {/* Cart with Fixed Badge */}
                <ClientOnly>
                  <Link
                    href="/cart"
                    className="p-2 text-neutral-800 hover:text-[#003E29] transition-colors relative flex items-center justify-center animate-fade-in"
                    aria-label="Cart"
                  >
                    <TbShoppingBag className="h-6 w-6 stroke-[1.75]" />
                    {cartCount > 0 && (
                      <span
                        className="absolute -top-1 -right-1 text-white text-[10px] font-extrabold rounded-full min-w-[19px] h-[19px] px-1 flex items-center justify-center border-2 border-white shadow-md pointer-events-none"
                        style={{ background: "#003E29" }}
                      >
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </ClientOnly>

                {/* Wishlist */}
                <Link
                  href="/wishlist"
                  className="p-2 text-neutral-800 hover:text-[#003E29] transition-colors relative flex items-center justify-center"
                  aria-label="Wishlist"
                >
                  <TbHeart className="h-6 w-6 stroke-[1.75]" />
                </Link>

                {/* Account */}
                <AccountDropdown
                  user={user}
                  isAuthenticated={isAuthenticated}
                  activeDropdown={activeDropdown}
                  setActiveDropdown={setActiveDropdown}
                  handleLogout={handleLogout}
                />

                {/* Hamburger (Mobile Menu) */}
                <button
                  onClick={() => setIsMenuOpen(true)}
                  className="lg:hidden p-2 text-black hover:opacity-75 transition-opacity ml-1"
                  aria-label="Menu"
                >
                  <TbMenu2 className="h-7 w-7 stroke-[2]" />
                </button>
              </div>

            </div>
          </div>
        </div>
      </header>

      {/* Search Dialog */}
      <SearchDialog
        open={isSearchOpen}
        onOpenChange={setIsSearchOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        searchInputRef={searchInputRef}
        categories={categories}
      />

      {/* Mobile Drawer */}
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        user={user}
        isAuthenticated={isAuthenticated}
        categories={categories}
        cartCount={cartCount}
        handleLogout={handleLogout}
        pathname={pathname}
      />

      {/* Mobile Bottom Nav */}
      <BottomNav
        pathname={pathname}
        isAuthenticated={isAuthenticated}
        cartCount={cartCount}
        onMenuOpen={() => setIsMenuOpen(true)}
      />
    </>
  );
}

/* ── Categories Dropdown ────────────────────── */
function CategoriesDropdown({ categories, activeDropdown, setActiveDropdown, pathname }) {
  return (
    <div
      className="relative"
      onMouseEnter={() => setActiveDropdown("categories")}
      onMouseLeave={() => setActiveDropdown(null)}
    >
      <button
        className={cn(
          "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all",
          activeDropdown === "categories"
            ? "text-primary bg-green-50"
            : "text-gray-600 hover:text-primary hover:bg-green-50"
        )}
      >
        <Sparkles className="h-4 w-4" />
        Categories
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", activeDropdown === "categories" && "rotate-180")} />
      </button>

      {activeDropdown === "categories" && (
        <div className="absolute left-0 top-full pt-2 z-50">
          <div
            className="bg-white rounded-2xl shadow-2xl border py-3 min-w-[240px] animate-in fade-in slide-in-from-top-2 duration-150"
            style={{ borderColor: "#E5E7EB", boxShadow: "0 20px 60px rgba(0,62,41,0.15)" }}
          >
            {categories.length > 0 ? (
              <>
                {categories.slice(0, 15).map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:text-primary hover:bg-green-50/70 transition-colors"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: "#D4AF37" }}
                    />
                    {cat.name}
                  </Link>
                ))}
                <div className="border-t mt-2 pt-2 px-3" style={{ borderColor: "#E5E7EB" }}>
                  <Link
                    href="/categories"
                    className="flex items-center gap-2 px-2 py-2 text-sm font-semibold rounded-lg transition-colors hover:bg-green-50"
                    style={{ color: "#003E29" }}
                  >
                    View All Categories
                    <FiChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </>
            ) : (
              <div className="px-4 py-6 text-center text-sm text-gray-400">Loading categories...</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Account Dropdown ───────────────────────── */
function AccountDropdown({ user, isAuthenticated, activeDropdown, setActiveDropdown, handleLogout }) {
  const open = activeDropdown === "account";

  return (
    <div
      className="relative hidden sm:block"
      onMouseEnter={() => setActiveDropdown("account")}
      onMouseLeave={() => setActiveDropdown(null)}
    >
      <ClientOnly>
        <button
          className={cn(
            "flex items-center gap-1.5 p-2.5 transition-all",
            open ? "text-[#003E29]" : "text-neutral-800 hover:text-[#B08D57]"
          )}
        >
          {isAuthenticated ? (
            <AvatarCircle name={user?.name} />
          ) : (
            <>
              <TbUser className="h-6 w-6 stroke-[1.75]" />
              <TbChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
            </>
          )}
        </button>

        {open && (
          <div className="absolute right-0 top-full pt-2 z-50">
            <div
              className="bg-white border w-72 animate-in fade-in slide-in-from-top-2 duration-150 overflow-hidden"
              style={{ borderColor: "#E9E2D5", boxShadow: "0 24px 60px -20px rgba(0,34,22,0.25)" }}
            >
              {isAuthenticated ? (
                <>
                  <div
                    className="p-4 border-b"
                    style={{ background: "#F7F3EB", borderColor: "#E9E2D5" }}
                  >
                    <div className="flex items-center gap-3">
                      <AvatarCircle name={user?.name} size="lg" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{user?.name || "User"}</p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-2">
                    {[
                      { href: "/account", icon: User, label: "My Profile" },
                      { href: "/account/orders", icon: Package, label: "My Orders" },
                      { href: "/account/addresses", icon: MapPin, label: "Addresses" },
                      { href: "/wishlist", icon: Heart, label: "Wishlist" },
                    ].map(({ href, icon: Icon, label }) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-center gap-3 px-5 py-2.5 text-sm tracking-wide text-gray-700 hover:text-[#003E29] hover:bg-[#F7F3EB] transition-colors"
                      >
                        <Icon className="h-4 w-4 text-[#B08D57]" />
                        {label}
                      </Link>
                    ))}
                  </div>
                  <div className="border-t py-2" style={{ borderColor: "#E5E7EB" }}>
                    <button
                      onClick={() => { handleLogout(); setActiveDropdown(null); }}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-6">
                  <div className="text-center mb-5">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 border"
                      style={{ background: "#F7F3EB", borderColor: "#E9E2D5" }}
                    >
                      <User className="h-6 w-6 stroke-[1.5]" style={{ color: "#B08D57" }} />
                    </div>
                    <h3 className="font-display text-xl text-gray-900">Welcome</h3>
                    <p className="text-xs text-gray-500 mt-1 tracking-wide">Sign in to track your orders</p>
                  </div>
                  <div className="space-y-2.5">
                    <Link href="/auth" onClick={() => setActiveDropdown(null)}>
                      <button className="btn-luxe w-full">Sign In</button>
                    </Link>
                    <Link href="/auth?tab=register" onClick={() => setActiveDropdown(null)}>
                      <button className="btn-luxe-outline w-full mt-2.5">Create Account</button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </ClientOnly>
    </div>
  );
}

/* ── Search Dialog ──────────────────────────── */
function SearchDialog({ open, onOpenChange, searchQuery, setSearchQuery, handleSearch, searchInputRef, categories }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[580px] bg-white p-0 overflow-hidden border shadow-2xl rounded-none" style={{ borderColor: "#E9E2D5" }}>
        <DialogHeader className="px-8 pt-7 pb-5 border-b" style={{ borderColor: "#E9E2D5" }}>
          <DialogTitle className="text-center">
            <span className="luxe-eyebrow block mb-2">Inaayika</span>
            <span className="font-display text-2xl font-medium text-gray-900 block">Search the Collection</span>
          </DialogTitle>
        </DialogHeader>

        <div className="px-8 py-6">
          <form onSubmit={handleSearch} className="relative">
            <FiSearch className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#B08D57" }} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Necklaces, earrings, bracelets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-8 pr-28 text-sm bg-transparent border-0 border-b focus:outline-none focus:ring-0 transition-all placeholder:text-gray-400 tracking-wide"
              style={{ borderColor: "#B08D57", borderBottomWidth: "1px" }}
              autoComplete="off"
            />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="p-1.5 text-gray-400 hover:text-gray-600"
                >
                  <FiX className="h-4 w-4" />
                </button>
              )}
              <button
                type="submit"
                className="h-9 px-5 text-white text-[10px] uppercase tracking-[0.25em] transition-colors hover:bg-[#002216]"
                style={{ background: "#003E29" }}
              >
                Search
              </button>
            </div>
          </form>

          {categories.length > 0 && (
            <div className="mt-7">
              <p className="text-[10px] uppercase tracking-[0.3em] mb-3" style={{ color: "#B08D57" }}>Browse Categories</p>
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 15).map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    onClick={() => onOpenChange(false)}
                    className="px-4 py-1.5 text-[11px] tracking-[0.15em] uppercase border transition-all"
                    style={{ borderColor: "#E9E2D5", color: "#003E29", background: "#FDFBF7" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#003E29"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#003E29"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#FDFBF7"; e.currentTarget.style.color = "#003E29"; e.currentTarget.style.borderColor = "#E9E2D5"; }}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-7 pt-4 border-t flex justify-between text-gray-400 text-[11px]" style={{ borderColor: "#E9E2D5" }}>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 border bg-[#FDFBF7] text-gray-500 text-[10px]" style={{ borderColor: "#E9E2D5" }}>ESC</kbd>
              close
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 border bg-[#FDFBF7] text-gray-500 text-[10px]" style={{ borderColor: "#E9E2D5" }}>ENTER</kbd>
              search
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ── Mobile Drawer ──────────────────────────── */
function MobileMenu({ isOpen, onClose, user, isAuthenticated, categories, cartCount, handleLogout, pathname }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="absolute left-0 top-0 bottom-0 w-[85%] max-w-[340px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">

        {/* Drawer Header */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
          style={{ borderColor: "#E9E2D5", background: "#F7F3EB" }}
        >
          <img src="/logo.png" alt="Inaayika Logo" className="h-14 w-auto object-contain" />
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 transition-all rounded-full hover:bg-gray-200/50"
          >
            <TbX className="h-6 w-6 stroke-[2]" />
          </button>
        </div>

        {/* User section */}
        <ClientOnly>
          <div
            className="px-4 py-3 border-b flex-shrink-0"
            style={{ borderColor: "#E9E2D5", background: "#FDFBF7" }}
          >
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <AvatarCircle name={user?.name} size="lg" />
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate text-sm">{user?.name || "User"}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link href="/auth" className="flex-1" onClick={onClose}>
                  <button className="btn-luxe w-full !py-2.5 text-[10px]">Sign In</button>
                </Link>
                <Link href="/auth?tab=register" className="flex-1" onClick={onClose}>
                  <button className="btn-luxe-outline w-full !py-2.5 text-[10px]">Register</button>
                </Link>
              </div>
            )}
          </div>
        </ClientOnly>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto py-2">
          <div className="px-2 space-y-0.5">
            <MobileNavItem href="/products" icon={TbShoppingBag} label="All Jewellery" onClick={onClose} />
            <MobileNavItem href="/categories" icon={TbLayoutGrid} label="Categories" onClick={onClose} />
            <MobileNavItem href="/wishlist" icon={TbHeart} label="Wishlist" onClick={onClose} />
            <MobileNavItem href="/cart" icon={TbShoppingBag} label="Cart" onClick={onClose} badge={cartCount} />
          </div>

          {categories.length > 0 && (
            <DrawerSection title="Jewellery Categories">
              {categories.slice(0, 15).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-[#003E29] hover:bg-[#F7F3EB] transition-all tracking-wide font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#B08D57" }} />
                  {cat.name}
                </Link>
              ))}
              <Link
                href="/categories"
                onClick={onClose}
                className="flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-[0.2em] font-medium transition-colors hover:bg-[#F7F3EB]"
                style={{ color: "#003E29" }}
              >
                View All <TbChevronRight className="h-4 w-4" />
              </Link>
            </DrawerSection>
          )}

          <ClientOnly>
            {isAuthenticated && (
              <DrawerSection title="Account">
                {[
                  { href: "/account", icon: TbUser, label: "Profile" },
                  { href: "/account/orders", icon: TbPackage, label: "My Orders" },
                  { href: "/account/addresses", icon: TbMapPin, label: "Addresses" },
                ].map(({ href, icon, label }) => (
                  <MobileNavItem key={href} href={href} icon={icon} label={label} onClick={onClose} />
                ))}
                <button
                  onClick={() => { handleLogout(); onClose(); }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all font-medium"
                >
                  <TbLogout className="h-5 w-5 flex-shrink-0 stroke-[1.75]" />
                  <span>Sign Out</span>
                </button>
              </DrawerSection>
            )}
          </ClientOnly>

          <DrawerSection title="More & Policies">
            {[
              { href: "/about", label: "About Us" },
              { href: "/contact", label: "Contact Us" },
              { href: "/why-us", label: "Why Choose Us" },
              { href: "/product-care", label: "Product Care Guide" },
              { href: "/shipping-policy", label: "Shipping Policy" },
              { href: "/return-policy", label: "Return Policy" },
              { href: "/cancellation-policy", label: "Cancellation Policy" },
              { href: "/privacy-policy", label: "Privacy Policy" },
              { href: "/terms", label: "Terms & Conditions" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-[#003E29] hover:bg-[#F7F3EB] transition-all tracking-wide"
              >
                {label}
              </Link>
            ))}
          </DrawerSection>

          {/* Contact block */}
          <div
            className="mx-3 mt-4 p-4 space-y-3 rounded-xl border"
            style={{ background: "#F7F3EB", borderColor: "#E9E2D5" }}
          >
            <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2.5 text-xs text-gray-600 hover:text-[#003E29] transition-colors">
              <TbMail className="h-4.5 w-4.5 flex-shrink-0 text-[#003E29]" />
              {CONTACT.email}
            </a>
            <a href={`tel:${CONTACT.phone}`} className="flex items-center gap-2.5 text-xs text-gray-600 hover:text-[#003E29] transition-colors">
              <TbPhone className="h-4.5 w-4.5 flex-shrink-0 text-[#003E29]" />
              {CONTACT.phone}
            </a>
            <a
              href={`https://wa.me/${CONTACT.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors pt-1 border-t border-gray-200"
            >
              <TbBrandWhatsapp className="h-5 w-5 flex-shrink-0 text-emerald-600" />
              Message us on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Mobile Bottom Nav ──────────────────────── */
function BottomNav({ pathname, isAuthenticated, cartCount, onMenuOpen }) {
  const navItems = [
    {
      href: "/",
      label: "Home",
      icon: TbHome,
      isActive: pathname === "/",
    },
    {
      href: "/products",
      label: "Shop",
      icon: TbLayoutGrid,
      isActive: pathname.startsWith("/products"),
    },
    {
      href: "/cart",
      label: "Cart",
      icon: TbShoppingBag,
      isCart: true,
      isActive: pathname === "/cart",
    },
    {
      href: isAuthenticated ? "/account" : "/auth",
      label: "Account",
      icon: TbUser,
      isActive: pathname.startsWith("/account") || pathname.startsWith("/auth"),
    },
    {
      label: "More",
      icon: TbMenu2,
      onClick: onMenuOpen,
      isActive: false,
    },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#FDFBF7]/95 backdrop-blur-md border-t z-50 shadow-[0_-6px_30px_rgba(0,34,22,0.08)]"
      style={{ borderColor: "#E9E2D5" }}
    >
      <div className="grid grid-cols-5 h-15 items-center px-1">
        {navItems.map((item, idx) => {
          const Icon = item.icon;

          if (item.isCart) {
            return (
              <Link
                key={idx}
                href={item.href}
                className="flex flex-col items-center justify-center relative active:scale-95 transition-transform"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center shadow-xl -mt-5 relative border-2 border-[#D4AF37] transition-all duration-300 hover:scale-105"
                  style={{ background: "#003E29" }}
                >
                  <Icon className="h-6 w-6 text-white stroke-[1.75]" />
                  <ClientOnly>
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-red-600 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center px-1 border-2 border-white shadow-md">
                        {cartCount}
                      </span>
                    )}
                  </ClientOnly>
                </div>
                <span
                  className={cn(
                    "text-[10px] font-semibold tracking-wider mt-0.5 transition-colors",
                    item.isActive ? "text-[#003E29]" : "text-gray-600"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          }

          if (item.onClick) {
            return (
              <button
                key={idx}
                onClick={item.onClick}
                className="flex flex-col items-center justify-center gap-0.5 text-gray-500 hover:text-[#003E29] active:scale-95 transition-all py-1"
              >
                <Icon className="h-5.5 w-5.5 stroke-[1.75]" />
                <span className="text-[10px] font-semibold tracking-wider">{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={idx}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 py-1 transition-all active:scale-95 relative",
                item.isActive ? "text-[#003E29]" : "text-gray-500 hover:text-neutral-800"
              )}
            >
              <Icon className="h-5.5 w-5.5 stroke-[1.75]" />
              <span className="text-[10px] font-semibold tracking-wider">{item.label}</span>
              {item.isActive && (
                <span className="w-1 h-1 rounded-full bg-[#D4AF37] absolute bottom-0" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default Navbar;
