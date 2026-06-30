"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { fetchApi, cn, sortCategories } from "@/lib/utils";
import { ClientOnly } from "@/components/client-only";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast, Toaster } from "sonner";
import {
  FiShoppingCart, FiUser, FiMenu, FiX, FiSearch,
  FiHeart, FiChevronDown, FiChevronRight, FiPackage,
  FiLogOut, FiMapPin, FiMail, FiPhone,
  FiInstagram, FiYoutube, FiShoppingBag,
} from "react-icons/fi";
import {
  User, Package, MapPin, Heart, LogOut,
  ChevronDown, Sparkles,
} from "lucide-react";

/* ── Constants ─────────────────────────────── */
const CONTACT = {
  email: "Inaayikabypoojakhan@gmail.com",
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
      className={`${dim} rounded-full flex items-center justify-center text-white   shadow-md flex-shrink-0`}
      style={{ background: "linear-gradient(135deg, #003E29, #D4AF37)" }}
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
      className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:text-primary hover:bg-blue-50/60 transition-all duration-200"
    >
      <Icon className="h-5 w-5 text-gray-400 flex-shrink-0" />
      <span className="text-sm font-medium">{label}</span>
      {badge > 0 && (
        <span className="ml-auto bg-primary text-white text-[10px]   px-2 py-0.5 rounded-full min-w-[20px] text-center">
          {badge}
        </span>
      )}
    </Link>
  );
}

/* ── Section helper (mobile drawer) ────────── */
function DrawerSection({ title, children }) {
  return (
    <div className="mt-2 pt-2 border-t border-gray-100">
      <p className="px-4 py-1.5 text-[10px]   text-gray-400 uppercase tracking-widest">{title}</p>
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

  const searchInputRef = useRef(null);
  const navbarRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
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
          "sticky top-0 z-50 w-full transition-all duration-300 bg-white",
          isScrolled ? "shadow-md" : ""
        )}
      >
        <Toaster position="top-center" richColors />

        {/* ── TOP INFO BAR (Green Bar) ── */}
        <div className="text-white text-[11px] font-semibold tracking-wider py-2.5 px-4 border-b border-[#D4AF37]/20" style={{ background: "#003E29" }}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Left: Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/all_about_hair_accesories?igsh=MTJ6bXA2YnZ5M2k3Ng%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <FiInstagram className="h-4 w-4" />
              </a>
              <a
                href="https://www.youtube.com/@Inaayikabypoojakhan"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <FiYoutube className="h-4 w-4" />
              </a>
            </div>

            {/* Center: Promo Text */}
            <div className="text-center   tracking-widest text-[10px] sm:text-[11px] uppercase">
              NEWS: DELIVERY TO THE DOOR IS ACTIVE!
            </div>

            {/* Right: Cart, Search, Help Links */}
            <div className="flex items-center gap-4 text-[10px] sm:text-[11px]   tracking-widest uppercase">
              <Link href="/cart" className="hover:underline">CART</Link>
              <button onClick={() => setIsSearchOpen(true)} className="hover:underline">SEARCH</button>
              <Link href="/contact" className="hover:underline">HELP</Link>
            </div>
          </div>
        </div>

        {/* ── MAIN HEADER NAVBAR ── */}
        <div className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between h-20 gap-4">

              {/* Left Side: Desktop Menu Items */}
              <div className="hidden lg:flex items-center gap-8">
                <Link href="/" className="text-xs   tracking-widest text-gray-900 hover:text-brand-green transition-colors uppercase">
                  HOME
                </Link>

                <Link href="/products" className="text-xs   tracking-widest text-gray-900 hover:text-brand-green transition-colors uppercase">
                  SHOP
                </Link>

                <Link href="/products" className="text-xs   tracking-widest text-gray-900 hover:text-brand-green transition-colors uppercase">
                  PRODUCT
                </Link>

                <div className="relative group" onMouseEnter={() => setActiveDropdown("pages")} onMouseLeave={() => setActiveDropdown(null)}>
                  <span className="flex items-center gap-1 text-xs   tracking-widest text-gray-900 hover:text-brand-green transition-colors cursor-pointer uppercase">
                    PAGES <FiChevronDown className="h-3 w-3" />
                  </span>
                  {activeDropdown === "pages" && (
                    <div className="absolute left-0 top-full pt-2 z-50">
                      <div className="bg-white rounded-lg shadow-xl border p-2 min-w-[200px] border-gray-100">
                        <Link href="/about" className="block px-4 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-50 hover:text-black rounded uppercase">ABOUT US</Link>
                        <Link href="/contact" className="block px-4 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-50 hover:text-black rounded uppercase">CONTACT</Link>
                        <Link href="/shipping-policy" className="block px-4 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-50 hover:text-black rounded uppercase">SHIPPING POLICY</Link>
                        <Link href="/return-policy" className="block px-4 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-50 hover:text-black rounded uppercase">RETURN POLICY</Link>
                        <Link href="/privacy-policy" className="block px-4 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-50 hover:text-black rounded uppercase">PRIVACY POLICY</Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Center: Logo / Brand Title */}
              <div className="flex-1 lg:flex-none flex justify-center">
                <Link href="/" className="flex items-center justify-center  ">
                  <Image src="/logo.png" alt="Logo" width={80} height={80} />
                  {/* <div className="flex flex-col items-center justify-center">
                    <span className="font-display text-2xl md:text-3xl   tracking-[0.2em] uppercase" style={{ color: "#003E29" }}>
                      INAAYIKA
                    </span>
                    <span className="text-[7px] md:text-[9px] font-sans tracking-[0.4em] text-gray-400 mt-1 uppercase">
                      Handcrafted Jewellery
                    </span>
                  </div> */}
                </Link>
              </div>

              {/* Right Side: Icons / Action Elements */}
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Search */}
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-black hover:opacity-75 transition-opacity"
                  aria-label="Search"
                >
                  <FiSearch className="h-5 w-5 stroke-[2.5]" />
                </button>

                {/* Cart */}
                <ClientOnly>
                  <Link
                    href="/cart"
                    className="p-2 text-black hover:opacity-75 transition-opacity relative animate-fade-in"
                    aria-label="Cart"
                  >
                    <FiShoppingBag className="h-5 w-5 stroke-[2.5]" />
                    {cartCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[9px] font-black rounded-full w-4.5 h-4.5 flex items-center justify-center border border-white">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </ClientOnly>

                {/* Wishlist */}
                <Link
                  href="/wishlist"
                  className="p-2 text-black hover:opacity-75 transition-opacity relative"
                  aria-label="Wishlist"
                >
                  <FiHeart className="h-5 w-5 stroke-[2.5]" />
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
                  <FiMenu className="h-6 w-6 stroke-[2.5]" />
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
            "flex items-center gap-1.5 p-2.5 rounded-xl transition-all",
            open ? "text-primary bg-green-50" : "text-gray-600 hover:text-primary hover:bg-green-50"
          )}
        >
          {isAuthenticated ? (
            <AvatarCircle name={user?.name} />
          ) : (
            <>
              <FiUser className="h-5 w-5" />
              <FiChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
            </>
          )}
        </button>

        {open && (
          <div className="absolute right-0 top-full pt-2 z-50">
            <div
              className="bg-white rounded-2xl shadow-2xl border w-72 animate-in fade-in slide-in-from-top-2 duration-150 overflow-hidden"
              style={{ borderColor: "#E5E7EB", boxShadow: "0 20px 60px rgba(0,62,41,0.15)" }}
            >
              {isAuthenticated ? (
                <>
                  <div
                    className="p-4 border-b"
                    style={{ background: "linear-gradient(135deg, rgba(0,62,41,0.05), rgba(212,175,55,0.05))", borderColor: "#E5E7EB" }}
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
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:text-primary hover:bg-green-50/60 transition-colors"
                      >
                        <Icon className="h-4 w-4 text-gray-400" />
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
                <div className="p-5">
                  <div className="text-center mb-5">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
                      style={{ background: "rgba(0,62,41,0.08)" }}
                    >
                      <User className="h-7 w-7" style={{ color: "#003E29" }} />
                    </div>
                    <h3 className="  text-gray-900">Welcome!</h3>
                    <p className="text-xs text-gray-500 mt-1">Sign in to track your orders</p>
                  </div>
                  <div className="space-y-2">
                    <Link href="/auth" onClick={() => setActiveDropdown(null)}>
                      <Button
                        className="w-full h-10 font-semibold text-white"
                        style={{ background: "#003E29" }}
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth?tab=register" onClick={() => setActiveDropdown(null)}>
                      <Button variant="outline" className="w-full h-10 font-semibold border-2" style={{ borderColor: "#E5E7EB" }}>
                        Create Account
                      </Button>
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
      <DialogContent className="sm:max-w-[580px] bg-white p-0 overflow-hidden border shadow-2xl rounded-2xl" style={{ borderColor: "#E5E7EB" }}>
        <DialogHeader className="px-6 pt-5 pb-4 border-b" style={{ borderColor: "#E5E7EB" }}>
          <DialogTitle className="text-base   text-gray-900 flex items-center gap-2.5">
            <div className="p-2 rounded-xl" style={{ background: "rgba(0,62,41,0.08)" }}>
              <FiSearch className="h-4 w-4" style={{ color: "#003E29" }} />
            </div>
            Search Handcrafted Jewellery Collections
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-5">
          <form onSubmit={handleSearch} className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#003E29" }} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search necklaces, earrings, bracelets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-11 pr-28 text-sm rounded-xl border focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400"
              style={{ borderColor: "#E5E7EB", background: "#F9FAFB" }}
              autoComplete="off"
            />
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <FiX className="h-4 w-4" />
                </button>
              )}
              <button
                type="submit"
                className="h-9 px-4 rounded-lg text-white text-xs  "
                style={{ background: "#003E29" }}
              >
                Search
              </button>
            </div>
          </form>

          {categories.length > 0 && (
            <div className="mt-5">
              <p className="text-[10px]   text-gray-400 uppercase tracking-widest mb-3">Browse Categories</p>
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 15).map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    onClick={() => onOpenChange(false)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all hover:text-white"
                    style={{ borderColor: "#E5E7EB", color: "#003E29", background: "rgba(0,62,41,0.04)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#003E29"; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,62,41,0.04)"; e.currentTarget.style.color = "#003E29"; }}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5 pt-4 border-t flex justify-between text-gray-400 text-[11px]" style={{ borderColor: "#E5E7EB" }}>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 border rounded bg-gray-50 text-gray-500 text-[10px]" style={{ borderColor: "#E5E7EB" }}>ESC</kbd>
              close
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 border rounded bg-gray-50 text-gray-500 text-[10px]" style={{ borderColor: "#E5E7EB" }}>ENTER</kbd>
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
          style={{ borderColor: "#E5E7EB", background: "linear-gradient(135deg, rgba(0,62,41,0.03), rgba(212,175,55,0.04))" }}
        >
          <Image src="/logo.png" alt="Inaayika" width={130} height={44} className="h-10 w-auto object-contain" />
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* User section */}
        <ClientOnly>
          <div
            className="px-4 py-3 border-b flex-shrink-0"
            style={{ borderColor: "#E5E7EB", background: "rgba(0,62,41,0.02)" }}
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
                  <Button className="w-full h-9 text-sm font-semibold text-white" style={{ background: "#003E29" }}>
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth?tab=register" className="flex-1" onClick={onClose}>
                  <Button variant="outline" className="w-full h-9 text-sm font-semibold border-2" style={{ borderColor: "#E5E7EB" }}>
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </ClientOnly>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto py-2">
          <div className="px-2 space-y-0.5">
            <MobileNavItem href="/products" icon={FiPackage} label="All Jewellery" onClick={onClose} />
            <MobileNavItem href="/categories" icon={FiSearch} label="Categories" onClick={onClose} />
            <MobileNavItem href="/wishlist" icon={FiHeart} label="Wishlist" onClick={onClose} />
            <MobileNavItem href="/cart" icon={FiShoppingCart} label="Cart" onClick={onClose} badge={cartCount} />
          </div>

          {categories.length > 0 && (
            <DrawerSection title="Jewellery Categories">
              {categories.slice(0, 15).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-600 hover:text-primary hover:bg-green-50/60 transition-all"
                >
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#D4AF37" }} />
                  {cat.name}
                </Link>
              ))}
              <Link
                href="/categories"
                onClick={onClose}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-colors hover:bg-green-50"
                style={{ color: "#003E29" }}
              >
                View All <FiChevronRight className="h-4 w-4" />
              </Link>
            </DrawerSection>
          )}

          <ClientOnly>
            {isAuthenticated && (
              <DrawerSection title="Account">
                {[
                  { href: "/account", icon: FiUser, label: "Profile" },
                  { href: "/account/orders", icon: FiPackage, label: "My Orders" },
                  { href: "/account/addresses", icon: FiMapPin, label: "Addresses" },
                ].map(({ href, icon, label }) => (
                  <MobileNavItem key={href} href={href} icon={icon} label={label} onClick={onClose} />
                ))}
                <button
                  onClick={() => { handleLogout(); onClose(); }}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-all"
                >
                  <FiLogOut className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </DrawerSection>
            )}
          </ClientOnly>

          <DrawerSection title="More">
            {FOOTER_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-600 hover:text-primary hover:bg-green-50/60 transition-all"
              >
                {label}
              </Link>
            ))}
          </DrawerSection>

          {/* Contact block */}
          <div
            className="mx-3 mt-3 p-4 rounded-2xl space-y-2.5"
            style={{ background: "rgba(0,62,41,0.04)", border: "1px solid #E5E7EB" }}
          >
            <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2.5 text-xs text-gray-500 hover:text-primary transition-colors">
              <FiMail className="h-4 w-4 flex-shrink-0" style={{ color: "#003E29" }} />
              {CONTACT.email}
            </a>
            <a href={`tel:${CONTACT.phone}`} className="flex items-center gap-2.5 text-xs text-gray-500 hover:text-primary transition-colors">
              <FiPhone className="h-4 w-4 flex-shrink-0" style={{ color: "#003E29" }} />
              {CONTACT.phone}
            </a>
            <a
              href={`https://wa.me/${CONTACT.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-xs font-semibold text-green-600 hover:text-green-700 transition-colors"
            >
              <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
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
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50" style={{ borderColor: "#E5E7EB" }}>
      <div className="grid grid-cols-5 h-14">
        {/* Home */}
        <Link
          href="/"
          className={cn("flex flex-col items-center justify-center gap-0.5 transition-colors", pathname === "/" ? "text-primary" : "text-gray-400")}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-[9px] font-semibold">Home</span>
        </Link>

        {/* Collections */}
        <Link
          href="/products"
          className={cn("flex flex-col items-center justify-center gap-0.5 transition-colors", pathname.startsWith("/products") ? "text-primary" : "text-gray-400")}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          <span className="text-[9px] font-semibold">Collections</span>
        </Link>

        {/* Cart — center elevated */}
        <Link
          href="/cart"
          className="flex flex-col items-center justify-center gap-0.5 relative"
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg -mt-4 relative"
            style={{ background: "linear-gradient(135deg, #003E29, #D4AF37)" }}
          >
            <FiShoppingCart className="h-5 w-5 text-white" />
            <ClientOnly>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center px-1">
                  {cartCount}
                </span>
              )}
            </ClientOnly>
          </div>
          <span className="text-[9px] font-semibold text-gray-400 mt-0.5">Cart</span>
        </Link>

        {/* Account */}
        <Link
          href={isAuthenticated ? "/account" : "/auth"}
          className={cn("flex flex-col items-center justify-center gap-0.5 transition-colors", pathname.startsWith("/account") || pathname === "/auth" ? "text-primary" : "text-gray-400")}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
          </svg>
          <span className="text-[9px] font-semibold">Account</span>
        </Link>

        {/* More */}
        <button
          onClick={onMenuOpen}
          className="flex flex-col items-center justify-center gap-0.5 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="text-[9px] font-semibold">More</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
