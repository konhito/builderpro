"use client";

import { useState } from "react";

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How do I place an order?",
      answer: "Browse our products, add items to your cart, and proceed to checkout. You'll need to create an account or sign in. Complete the shipping information and we'll contact you with a quote and payment details.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept major credit/debit cards, bank transfers, and PayPal. Credit accounts are available for approved businesses. All payments are processed securely.",
    },
    {
      question: "How long does delivery take?",
      answer: "Standard delivery is 3-5 working days. Next-day delivery is available for orders placed before 5pm. Delivery times may vary depending on your location and product availability.",
    },
    {
      question: "Can I return items?",
      answer: "Yes, items can be returned within 30 days in their original condition. Please contact our customer service team to arrange a return. Custom or special orders may not be returnable.",
    },
    {
      question: "Do you offer bulk discounts?",
      answer: "Yes, we offer competitive pricing for bulk orders. Contact our sales team for a quote on large quantities. Trade accounts receive additional discounts.",
    },
    {
      question: "How can I track my order?",
      answer: "Once your order is dispatched, you'll receive a tracking number via email. You can also view your order status in your account dashboard under 'My Orders'.",
    },
    {
      question: "Do you ship internationally?",
      answer: "Currently, we ship to the UK and Ireland. International shipping may be available for large orders - please contact us for more information.",
    },
    {
      question: "What if I receive a damaged item?",
      answer: "Please inspect items upon delivery. If you receive damaged goods, contact us within 48 hours with photos. We'll arrange a replacement or refund promptly.",
    },
    {
      question: "Do you have a physical store?",
      answer: "We operate primarily online to offer the best prices. However, collection can be arranged for local orders. Contact us to discuss collection options.",
    },
    {
      question: "How do I get technical product information?",
      answer: "Product specifications are available on each product page. For additional technical information or advice, our expert team is available via phone or email.",
    },
  ];

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-slate-600">
          Quick answers to questions you may have
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-slate-200 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
              >
                <span className="font-semibold text-slate-900 pr-4">
                  {faq.question}
                </span>
                <svg
                  className={`w-5 h-5 text-blue-600 flex-shrink-0 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-slate-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 rounded-lg border border-blue-100 p-6 text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Can&apos;t find what you&apos;re looking for?
          </h2>
          <p className="text-slate-700 mb-4">
            Our support team is ready to help you with any questions
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}

