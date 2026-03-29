import ProductCard from "./ProductCard";

export default function ProductSection({ title, products = [], loading = false }) {
  return (
    <section className="py-8">
      <h2 className="text-2xl md:text-3xl font-black text-center uppercase tracking-tight mb-8">
        {title}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {loading
          ? [1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-2xl aspect-square mb-3" />
                <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
                <div className="h-3 bg-gray-200 rounded mb-2 w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
              </div>
            ))
          : products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
      <div className="flex justify-center mt-8">
        <button className="border border-gray-300 rounded-full px-10 py-3 text-sm font-medium hover:bg-black hover:text-white transition">
          View All
        </button>
      </div>
    </section>
  );
}
