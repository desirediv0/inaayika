"use client";

import { useState } from "react";
import {
  Phone, Mail, Send, Loader2,
  ArrowRight, BadgeCheck, Clock, Sparkles, MapPin
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { fetchApi } from "@/lib/utils";
import { toast } from "sonner";

export default function ContactPage() {
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Custom Jewellery Commissions",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const response = await fetchApi("/content/contact", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      toast.success(response.data?.message || "Your design enquiry has been received successfully!");
      setFormData({ name: "", email: "", phone: "", subject: "Custom Jewellery Commissions", message: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.message || "Failed to submit enquiry. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans" style={{ background: "#F9FAFB" }}>

      {/* Hero */}
      <section
        className="relative py-16 md:py-20 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #002216 0%, #003E29 60%, #002216 100%)" }}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-16 right-0 w-80 h-80 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #D4AF37, transparent 70%)" }} />
          <div className="absolute bottom-0 left-10 w-60 h-60 rounded-full opacity-5" style={{ background: "radial-gradient(circle, #D4AF37, transparent 70%)" }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-5 border uppercase tracking-widest"
            style={{ background: "rgba(212,175,55,0.15)", borderColor: "rgba(212,175,55,0.3)", color: "#D4AF37" }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Artisan Custom Design Sourcing
          </div>
          <h1 className="text-4xl md:text-5xl tracking-tight text-white mb-4 leading-tight">
            Connect With <span style={{ color: "#D4AF37" }}>Our Design Team</span>
          </h1>
          <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            Collaborate on bespoke jewellery styling queries, custom sizing requests, or chat directly with our founder on WhatsApp.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-12 md:py-20 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-10 items-start">

          {/* Left Column: Essential Contacts & Quality Indicators */}
          <div className="lg:col-span-5 space-y-6">

            {/* Inaayika Info Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-base font-display text-gray-900 mb-3 flex items-center gap-2 uppercase tracking-wider">
                <Sparkles className="w-5 h-5 text-[#003E29]" />
                About Inaayika
              </h3>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed mb-4">
                At Inaayika, we believe in the beauty of handmade creations. Each of our hair accessories, jewellery sets, and custom-tailored designs is lovingly crafted to reflect artisan heritage, durability, and elegance.
              </p>
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-3">
                  <BadgeCheck className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-600 leading-normal">
                    We deliver beautifully packaged jewellery with our premium shipping partners worldwide, direct to your doorstep.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#003E29] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-600 leading-normal">
                    <span className="text-gray-800 font-semibold">Support Hours:</span> 9:00 AM to 6:00 PM (Monday to Saturday, Except public holidays)
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#003E29] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-600 leading-normal">
                    <span className="text-gray-800 font-semibold">Studio Address:</span> Delhi, India
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Contact Cards */}
            <div className="grid sm:grid-cols-2 gap-4">

              {/* WhatsApp Card */}
              <a
                href="https://wa.me/918796449692"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-2xl p-5 border border-gray-100 hover:border-[#D4AF37]/30 hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="w-11 h-11 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                  <FaWhatsapp className="h-5 w-5" />
                </div>
                <h4 className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">WhatsApp Chat</h4>
                <p className="text-xs text-gray-800 break-all mb-1">+91 87964 49692</p>
                <span className="text-[9px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 group-hover:bg-emerald-500/10">Click to Message</span>
              </a>

              {/* Call Card */}
              <a
                href="tel:+918796449692"
                className="group bg-white rounded-2xl p-5 border border-gray-100 hover:border-[#003E29]/30 hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="w-11 h-11 bg-green-50 text-[#003E29] border border-green-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-[#003E29] group-hover:text-white transition-all">
                  <Phone className="h-4.5 w-4.5" />
                </div>
                <h4 className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Call Styling Desk</h4>
                <p className="text-xs text-gray-800 break-all mb-1">+91 87964 49692</p>
                <span className="text-[9px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 group-hover:bg-[#003E29]/10">Click to Call</span>
              </a>

              {/* Email Card */}
              <a
                href="mailto:Inaayikabypoojakhan@gmail.com"
                className="group bg-white rounded-2xl p-5 border border-gray-100 hover:border-[#D4AF37]/30 hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center sm:col-span-2"
              >
                <div className="w-11 h-11 bg-amber-50 text-[#D4AF37] border border-amber-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-[#D4AF37] group-hover:text-white transition-all">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <h4 className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Corporate Email</h4>
                <p className="text-xs text-[#003E29] break-all">Inaayikabypoojakhan@gmail.com</p>
                <p className="text-[10px] text-gray-400 mt-1">Styling &amp; Custom order help within 24 hours</p>
              </a>

            </div>

          </div>

          {/* Right Column: Contact / Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
              <div className="mb-6">
                <span
                  className="inline-block px-3 py-1 text-[10px] uppercase tracking-wider rounded-full mb-3"
                  style={{ background: "rgba(0,62,41,0.06)", color: "#003E29" }}
                >
                  Custom Request Intake
                </span>
                <h2 className="text-xl md:text-2xl font-display text-gray-900 uppercase tracking-wide">
                  Submit Sourcing Request
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Complete this form to submit custom jewellery designs, hair accessories preferences, or order queries.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs text-gray-700 mb-1.5 uppercase tracking-wider">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Your name"
                      className="w-full px-4 py-3 border border-gray-100 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#003E29]/10 focus:border-[#003E29] focus:outline-none transition-all text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-700 mb-1.5 uppercase tracking-wider">Phone Number *</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. +91 87964 49692"
                      className="w-full px-4 py-3 border border-gray-100 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#003E29]/10 focus:border-[#003E29] focus:outline-none transition-all text-sm font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-700 mb-1.5 uppercase tracking-wider">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="email@example.com"
                    className="w-full px-4 py-3 border border-gray-100 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#003E29]/10 focus:border-[#003E29] focus:outline-none transition-all text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-700 mb-1.5 uppercase tracking-wider">Inquiry Category</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-100 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#003E29]/10 focus:border-[#003E29] focus:outline-none transition-all text-sm font-semibold text-gray-700"
                  >
                    <option>Custom Jewellery Commissions</option>
                    <option>Order Status &amp; Sizing Queries</option>
                    <option>Collaboration &amp; Partnership</option>
                    <option>Care &amp; Repair Enquiries</option>
                    <option>General Feedback / Questions</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-700 mb-1.5 uppercase tracking-wider">Request Details *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    placeholder="Please details your size specifications, color themes, or jewellery design inspirations."
                    className="w-full px-4 py-3 border border-gray-100 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#003E29]/10 focus:border-[#003E29] focus:outline-none transition-all text-sm font-semibold resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 rounded-xl font-semibold gap-2 border-0 shadow-md transition-all text-white hover:opacity-90"
                  style={{ background: "#003E29" }}
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <>
                      <Loader2 className="h-4.5 w-4.5 animate-spin" />
                      Submitting Request...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>

        </div>
      </section>

      {/* WhatsApp Banner */}
      <section className="py-12 px-6 sm:px-8 lg:px-12" style={{ background: "#002216" }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 20% 50%, rgba(212,175,55,0.08), transparent 60%)" }} />
          <div className="relative z-10 text-center md:text-left">
            <h3 className="text-lg text-white mb-1 flex items-center justify-center md:justify-start gap-2">
              <FaWhatsapp className="w-5 h-5 text-green-400" />
              Message us on WhatsApp to know more
            </h3>
            <p className="text-gray-400 text-sm">
              Send your reference designs directly to our styling desk for quick price quotes.
            </p>
          </div>
          <a
            href="https://wa.me/918796449692"
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 flex-shrink-0"
          >
            <Button
              size="lg"
              className="bg-green-500 hover:bg-green-600 text-white px-8 h-12 rounded-xl gap-2 border-0 shadow-lg"
            >
              Start WhatsApp Chat <ArrowRight className="w-4 h-4" />
            </Button>
          </a>
        </div>
      </section>

    </div>
  );
}
