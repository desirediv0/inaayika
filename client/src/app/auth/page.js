"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Mail, Lock, User, Phone, ArrowRight,
  Eye, EyeOff, Loader2, ShieldCheck, Gift, BadgeCheck
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

const TRUST_POINTS = [
  { icon: BadgeCheck, text: "100% Handcrafted Jewellery" },
  { icon: Gift, text: "Beautiful Gift Packaging" },
  { icon: ShieldCheck, text: "Trusted Across India" },
];

/* ── Shared field style ── */
const inputCls = "w-full pl-11 pr-4 py-3.5 border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 transition-all";
const inputStyle = { borderColor: "#E5E7EB", background: "#FAFBF9" };
const inputFocus = "focus:ring-[#003E29]/20 focus:border-[#003E29]";

function AuthForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const tabFromUrl = searchParams.get("tab") || "login";
  const [activeTab, setActiveTab] = useState(tabFromUrl);

  useEffect(() => { setActiveTab(tabFromUrl); }, [tabFromUrl]);
  useEffect(() => { if (isAuthenticated) router.push("/"); }, [isAuthenticated, router]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    router.push(`/auth?tab=${tab}`, { scroll: false });
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#FAFBF9" }}>

      {/* ── Left panel — branding (desktop only) ── */}
      <div
        className="hidden lg:flex lg:w-[45%] xl:w-[40%] flex-col justify-between p-12 relative overflow-hidden flex-shrink-0"
        style={{ background: "linear-gradient(135deg, #002216 0%, #003E29 60%, #005a3c 100%)" }}
      >
        {/* Decorative circles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #D4AF37, transparent 70%)" }} />
          <div className="absolute bottom-20 -left-10 w-60 h-60 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #D4AF37, transparent 70%)" }} />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/">
            <Image src="/logo.png" alt="Inaayika" width={160} height={54} className="h-20 w-auto object-contain " />
          </Link>
        </div>

        {/* Center copy */}
        <div className="relative z-10">
          <h2 className="text-3xl xl:text-4xl   text-white leading-tight mb-4">
            Your Premium<br />
            <span style={{ color: "#D4AF37" }}>Jewellery Brand</span>
          </h2>
          <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-xs">
            Access genuine handcrafted jewellery, track orders, and get custom commissions — all in one place.
          </p>

          {/* Trust points */}
          <div className="space-y-3">
            {TRUST_POINTS.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(212,175,55,0.15)" }}>
                  <Icon className="h-4 w-4" style={{ color: "#D4AF37" }} />
                </div>
                <span className="text-white/75 text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="relative z-10">
          <p className="text-white/30 text-xs">
            Inaayikabypoojakhan@gmail.com &nbsp;·&nbsp; +91 87964 49692
          </p>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/">
              <Image src="/logo.png" alt="Inaayika" width={140} height={48} className="h-12 w-auto object-contain mx-auto" />
            </Link>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl card-shadow-lg border overflow-hidden" style={{ borderColor: "#E5E7EB" }}>

            {/* Tabs */}
            <div className="flex border-b" style={{ borderColor: "#E5E7EB" }}>
              {["login", "register"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className="flex-1 py-4 text-sm font-semibold transition-all capitalize"
                  style={activeTab === tab
                    ? { color: "#003E29", borderBottom: "3px solid #D4AF37", background: "rgba(0,62,41,0.03)" }
                    : { color: "#6b7280" }
                  }
                >
                  {tab === "login" ? "Sign In" : "Register"}
                </button>
              ))}
            </div>

            <div className="p-7 md:p-9">
              {activeTab === "login" && <LoginForm />}
              {activeTab === "register" && <RegisterForm />}
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-gray-600">Terms</Link>{" "}
            &amp;{" "}
            <Link href="/privacy-policy" className="underline hover:text-gray-600">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Email and password are required"); return; }
    setIsSubmitting(true);
    try {
      await login(email, password);
      sessionStorage.setItem("justLoggedIn", "true");
      toast.success("Login successful!");
      const returnUrl = searchParams.get("returnUrl") || searchParams.get("redirect");
      setTimeout(() => router.push(returnUrl ? decodeURIComponent(returnUrl) : "/"), 300);
    } catch (error) {
      const msg = error.message || "Login failed. Please check your credentials.";
      if (msg.toLowerCase().includes("verify") || msg.toLowerCase().includes("verification")) {
        toast.error(<div>{msg}{" "}<Link href="/resend-verification" className="font-medium underline text-black">Resend verification</Link></div>);
      } else {
        toast.error(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="mb-7">
        <h1 className="text-2xl   mb-1" style={{ color: "#002216" }}>Welcome Back</h1>
        <p className="text-gray-400 text-sm">Sign in to your Inaayika account</p>
      </div>

      {/* Email */}
      <div>
        <label className="block text-xs   uppercase tracking-wider mb-1.5" style={{ color: "#002216" }}>Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-400" style={{ width: 18, height: 18 }} />
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
            placeholder="you@example.com"
            className={`${inputCls} ${inputFocus}`} style={inputStyle}
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs   uppercase tracking-wider" style={{ color: "#002216" }}>Password</label>
          <Link href="/forgot-password" className="text-xs font-medium hover:underline" style={{ color: "#003E29" }}>Forgot password?</Link>
        </div>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" style={{ width: 18, height: 18 }} />
          <input
            type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required
            placeholder="••••••••"
            className={`${inputCls} pr-12 ${inputFocus}`} style={inputStyle}
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showPassword ? <EyeOff style={{ width: 18, height: 18 }} /> : <Eye style={{ width: 18, height: 18 }} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all hover:bg-[#002216] disabled:opacity-60 mt-2 border border-[#D4AF37]/30 shadow-md"
        style={{ background: "#003E29" }}
      >
        {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</> : <>Sign In <ArrowRight className="h-4 w-4 text-[#D4AF37]" /></>}
      </button>

      <p className="text-center text-sm text-gray-400">
        No account?{" "}
        <Link href="/auth?tab=register" className="font-semibold hover:underline" style={{ color: "#003E29" }}>Register here</Link>
      </p>
    </form>
  );
}

function RegisterForm() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (formData.name.trim().length < 3) { toast.error("Name should be at least 3 characters"); return false; }
    if (!formData.phone || formData.phone.length < 10) { toast.error("Please enter a valid phone number"); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { toast.error("Please enter a valid email address"); return false; }
    if (formData.password.length < 8) { toast.error("Password should be at least 8 characters"); return false; }
    if (formData.password !== formData.confirmPassword) { toast.error("Passwords do not match"); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const res = await register({ name: formData.name, email: formData.email, phone: formData.phone, password: formData.password });
      const payload = res?.data ?? res;
      const emailSent = payload?.emailSent !== false;
      if (payload?.debugOtp) {
        toast.success(`Verification code (dev): ${payload.debugOtp}`, { duration: 25000 });
      } else if (emailSent) {
        toast.success("Registration successful! Check your email for the OTP.", { duration: 4000 });
      } else {
        toast.warning(res?.message || "Account created but email could not be sent.");
      }
      localStorage.setItem("registeredEmail", formData.email);
      setTimeout(() => router.push(`/verify-otp?email=${encodeURIComponent(formData.email)}`), 600);
    } catch (error) {
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-6">
        <h1 className="text-2xl   mb-1" style={{ color: "#002216" }}>Create Account</h1>
        <p className="text-gray-400 text-sm">Join Inaayika today</p>
      </div>

      {[
        { label: "Full Name", name: "name", type: "text", icon: User, placeholder: "Your full name" },
        { label: "Email Address", name: "email", type: "email", icon: Mail, placeholder: "you@example.com" },
        { label: "Phone Number", name: "phone", type: "tel", icon: Phone, placeholder: "+91 9876543210" },
      ].map(({ label, name, type, icon: Icon, placeholder }) => (
        <div key={name}>
          <label className="block text-xs   uppercase tracking-wider mb-1.5" style={{ color: "#002216" }}>{label}</label>
          <div className="relative">
            <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" style={{ width: 18, height: 18 }} />
            <input
              type={type} name={name} value={formData[name]} onChange={handleChange} required placeholder={placeholder}
              className={`${inputCls} ${inputFocus}`} style={inputStyle}
            />
          </div>
        </div>
      ))}

      {/* Password */}
      <div>
        <label className="block text-xs   uppercase tracking-wider mb-1.5" style={{ color: "#002216" }}>Password</label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" style={{ width: 18, height: 18 }} />
          <input
            type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required
            placeholder="Min 8 characters"
            className={`${inputCls} pr-12 ${inputFocus}`} style={inputStyle}
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showPassword ? <EyeOff style={{ width: 18, height: 18 }} /> : <Eye style={{ width: 18, height: 18 }} />}
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-xs   uppercase tracking-wider mb-1.5" style={{ color: "#002216" }}>Confirm Password</label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" style={{ width: 18, height: 18 }} />
          <input
            type={showPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required
            placeholder="Confirm your password"
            className={`${inputCls} ${inputFocus}`} style={inputStyle}
          />
        </div>
      </div>

      <button
        type="submit" disabled={isSubmitting}
        className="w-full h-12 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all hover:bg-[#002216] disabled:opacity-60 mt-2 border border-[#D4AF37]/30 shadow-md"
        style={{ background: "#003E29" }}
      >
        {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating account...</> : <>Create Account <ArrowRight className="h-4 w-4 text-[#D4AF37]" /></>}
      </button>

      <p className="text-center text-sm text-gray-400">
        Already have an account?{" "}
        <Link href="/auth?tab=login" className="font-semibold hover:underline" style={{ color: "#003E29" }}>Sign In</Link>
      </p>
    </form>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FAFBF9" }}>
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#003E29" }} />
      </div>
    }>
      <AuthForm />
    </Suspense>
  );
}
