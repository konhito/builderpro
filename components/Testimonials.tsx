export default function Testimonials() {
  const testimonials = [
    {
      name: "James Wilson",
      role: "General Contractor",
      content: "BuildPro has been my go-to supplier for 3 years. Fast delivery, quality products, and their customer service is outstanding.",
      rating: 5,
    },
    {
      name: "Sarah Mitchell",
      role: "Interior Designer",
      content: "Excellent range of products at competitive prices. The website makes it easy to find exactly what I need for my projects.",
      rating: 5,
    },
    {
      name: "Michael Brown",
      role: "DIY Enthusiast",
      content: "As someone who does home projects on weekends, I appreciate the detailed product information and helpful support team.",
      rating: 5,
    },
  ];

  return (
    <section className="bg-slate-900 text-white py-16">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Trusted by Professionals
          </h2>
          <p className="text-slate-400 text-lg">
            See what our customers have to say
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-slate-800 rounded-xl p-6 border border-slate-700"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-orange-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-slate-300 mb-6 leading-relaxed">
                &ldquo;{testimonial.content}&rdquo;
              </p>
              <div>
                <div className="font-semibold text-white">{testimonial.name}</div>
                <div className="text-sm text-slate-400">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

