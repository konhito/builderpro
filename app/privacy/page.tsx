export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-4xl font-bold text-slate-900 mb-6">Privacy Policy</h1>
      
      <div className="prose prose-slate max-w-none bg-white rounded-lg border border-slate-200 p-8">
        <p className="text-slate-600 mb-6">Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Information We Collect</h2>
          <p className="text-slate-700 mb-4">
            We collect information that you provide directly to us, including:
          </p>
          <ul className="list-disc pl-6 text-slate-700 space-y-2">
            <li>Name, email address, and contact information</li>
            <li>Shipping and billing addresses</li>
            <li>Payment information (processed securely through our payment providers)</li>
            <li>Order history and preferences</li>
            <li>Communications with our customer service team</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">2. How We Use Your Information</h2>
          <p className="text-slate-700 mb-4">We use the information we collect to:</p>
          <ul className="list-disc pl-6 text-slate-700 space-y-2">
            <li>Process and fulfill your orders</li>
            <li>Communicate with you about your orders and account</li>
            <li>Provide customer support</li>
            <li>Send you marketing communications (with your consent)</li>
            <li>Improve our website and services</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Data Security</h2>
          <p className="text-slate-700">
            We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. Your payment information is encrypted and processed securely through industry-standard payment gateways.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Your Rights</h2>
          <p className="text-slate-700 mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 text-slate-700 space-y-2">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to processing of your data</li>
            <li>Withdraw consent at any time</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Cookies</h2>
          <p className="text-slate-700">
            We use cookies and similar tracking technologies to improve your browsing experience, analyze site traffic, and personalize content. You can control cookies through your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Contact Us</h2>
          <p className="text-slate-700">
            If you have any questions about this Privacy Policy or our data practices, please contact us at:
          </p>
          <p className="text-blue-600 mt-2">
            Email: <a href="mailto:privacy@buildpro.com" className="hover:text-blue-700">privacy@buildpro.com</a><br />
            Phone: <a href="tel:+441234567890" className="hover:text-blue-700">+44 (0) 1234 567890</a>
          </p>
        </section>
      </div>
    </div>
  );
}

