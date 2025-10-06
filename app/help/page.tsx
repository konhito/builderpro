import Link from "next/link";

export default function HelpCenterPage() {
  const helpTopics = [
    {
      icon: "📦",
      title: "Orders & Shipping",
      description: "Track orders, delivery times, and shipping options",
      link: "/help/shipping",
    },
    {
      icon: "💳",
      title: "Payment & Pricing",
      description: "Payment methods, invoicing, and pricing information",
      link: "/help/payment",
    },
    {
      icon: "🔄",
      title: "Returns & Refunds",
      description: "Return policy, refund process, and exchanges",
      link: "/help/returns",
    },
    {
      icon: "👤",
      title: "Account Management",
      description: "Update details, reset password, manage preferences",
      link: "/help/account",
    },
    {
      icon: "🛠️",
      title: "Product Information",
      description: "Specifications, availability, and product guides",
      link: "/help/products",
    },
    {
      icon: "📞",
      title: "Contact Support",
      description: "Get in touch with our customer service team",
      link: "/contact",
    },
  ];

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Help Center</h1>
        <p className="text-lg text-slate-600">
          Find answers to common questions and get the help you need
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {helpTopics.map((topic, index) => (
          <Link
            key={index}
            href={topic.link}
            className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all group"
          >
            <div className="text-5xl mb-4">{topic.icon}</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
              {topic.title}
            </h3>
            <p className="text-slate-600">{topic.description}</p>
          </Link>
        ))}
      </div>

      <div className="bg-blue-50 rounded-lg border border-blue-100 p-8 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Still Need Help?</h2>
        <p className="text-slate-700 mb-6">
          Our customer support team is here to assist you Monday - Friday, 8:00 AM - 6:00 PM
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact Us
          </Link>
          <Link
            href="/faqs"
            className="inline-flex items-center justify-center gap-2 bg-white border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors"
          >
            View FAQs
          </Link>
        </div>
      </div>
    </div>
  );
}

