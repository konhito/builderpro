export default function TermsPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-4xl font-bold text-slate-900 mb-6">Terms of Service</h1>
      
      <div className="prose prose-slate max-w-none bg-white rounded-lg border border-slate-200 p-8">
        <p className="text-slate-600 mb-6">Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
          <p className="text-slate-700">
            By accessing and using BuildPro&apos;s website and services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Account Registration</h2>
          <p className="text-slate-700 mb-4">
            To place orders, you must create an account. You agree to:
          </p>
          <ul className="list-disc pl-6 text-slate-700 space-y-2">
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Notify us immediately of any unauthorized access</li>
            <li>Be responsible for all activities under your account</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Orders and Pricing</h2>
          <p className="text-slate-700 mb-4">
            All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order. Prices are subject to change without notice. We will provide quotes for all orders before final confirmation.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Payment Terms</h2>
          <p className="text-slate-700">
            Payment must be made in full before dispatch unless credit terms have been agreed. We accept major credit cards, bank transfers, and PayPal. All prices are in GBP and exclude VAT unless stated otherwise.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Delivery</h2>
          <p className="text-slate-700">
            Delivery times are estimates and not guaranteed. We will make reasonable efforts to deliver within stated timeframes. Risk passes to you upon delivery. You are responsible for checking goods upon receipt.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Returns and Refunds</h2>
          <p className="text-slate-700">
            Goods may be returned within 30 days in original condition. Custom or special orders may not be returnable. Refunds will be processed within 14 days of receiving returned goods. Return shipping costs are the customer&apos;s responsibility unless goods are faulty.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Limitation of Liability</h2>
          <p className="text-slate-700">
            BuildPro shall not be liable for any indirect, consequential, or special damages arising from use of our products or services. Our liability is limited to the value of the goods purchased.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Contact Information</h2>
          <p className="text-slate-700">
            For questions about these Terms of Service:
          </p>
          <p className="text-blue-600 mt-2">
            Email: <a href="mailto:legal@buildpro.com" className="hover:text-blue-700">legal@buildpro.com</a><br />
            Phone: <a href="tel:+441234567890" className="hover:text-blue-700">+44 (0) 1234 567890</a>
          </p>
        </section>
      </div>
    </div>
  );
}

