"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function HomeFAQs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await fetchApi("/faqs");
        const data = res.data?.faqs || res.data || [];
        setFaqs(Array.isArray(data) ? data.slice(0, 6) : []);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  if (loading || faqs.length === 0) return null;

  return (
    <section className="py-16 md:py-24 relative" style={{ background: "#F7F3EB" }}>
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold" style={{ color: "#B08D57" }}>
            FAQ
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium mt-3 mb-4" style={{ color: "#002216" }}>
            Frequently Asked Questions
          </h2>
          <p className="text-sm max-w-xl mx-auto" style={{ color: "#6b7280" }}>
            Find answers to common questions about our products, ordering, shipping, and more.
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="rounded-xl overflow-hidden border"
              style={{ borderColor: "#E9E2D5", background: "#FDFBF7" }}
            >
              <AccordionTrigger
                className="px-6 py-4 text-left hover:no-underline font-medium text-sm md:text-base"
                style={{ color: "#002216" }}
              >
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-sm leading-relaxed" style={{ color: "#6b7280" }}>
                <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* View All Link */}
        <div className="text-center mt-8">
          <a
            href="/faqs"
            className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
            style={{ color: "#B08D57" }}
          >
            View All FAQs →
          </a>
        </div>
      </div>
    </section>
  );
}
