import Link from "next/link";

export default function CategoryGrid() {
  const categories = [
    {
      name: "Screws",
      count: "12,000+",
      href: "/search?category=Screws",
      icon: "🔩",
      color: "bg-blue-50 hover:bg-blue-100",
      textColor: "text-blue-700",
    },
    {
      name: "Fasteners & Fixings",
      count: "8,500+",
      href: "/search?category=Fasteners%20%26%20Fixings",
      icon: "🔧",
      color: "bg-orange-50 hover:bg-orange-100",
      textColor: "text-orange-700",
    },
    {
      name: "Nails",
      count: "5,200+",
      href: "/search?category=Nails",
      icon: "📌",
      color: "bg-green-50 hover:bg-green-100",
      textColor: "text-green-700",
    },
    {
      name: "Power Tools",
      count: "15,000+",
      href: "/search?category=Powertool%20Accessories",
      icon: "⚙️",
      color: "bg-purple-50 hover:bg-purple-100",
      textColor: "text-purple-700",
    },
    {
      name: "Hand Tools",
      count: "6,800+",
      href: "/search?category=Hand%20Tools",
      icon: "🔨",
      color: "bg-red-50 hover:bg-red-100",
      textColor: "text-red-700",
    },
    {
      name: "Workwear & PPE",
      count: "4,300+",
      href: "/search?category=Workwear%2C%20PPE%20%26%20Safety",
      icon: "🦺",
      color: "bg-yellow-50 hover:bg-yellow-100",
      textColor: "text-yellow-700",
    },
  ];

  return (
    <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
          Shop by Category
        </h2>
        <p className="text-lg text-slate-600">
          Find exactly what you need from our extensive range
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={category.href}
            className={`${category.color} rounded-xl p-6 transition-all duration-200 border border-transparent hover:border-slate-200 hover:shadow-md group`}
          >
            <div className="text-center">
              <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-200">
                {category.icon}
              </div>
              <h3 className={`font-semibold mb-1 ${category.textColor}`}>
                {category.name}
              </h3>
              <p className="text-sm text-slate-500">{category.count} items</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

