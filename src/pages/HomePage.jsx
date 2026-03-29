import { useEffect, useState } from "react";
import { productService } from "../service/product.service";
import ProductSection from "../components/ProductSection";

const BRANDS = ["VERSACE", "ZARA", "GUCCI", "PRADA", "Calvin Klein"];

const REVIEWS = [
  { name: "Sarah M.", rating: 5, text: "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations." },
  { name: "Alex K.", rating: 5, text: "Finding clothes that align with my personal style used to be a challenge until I discovered Shopco. The range of options they offer is truly remarkable, catering to a variety of tastes." },
  { name: "James L.", rating: 5, text: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shopco. The selection is not only diverse but also on-point with the latest trends." },
];

const DRESS_STYLES = [
  { label: "Casual", img: "/casual.svg" },
  { label: "Formal", img: "/formal.svg" },
  { label: "Party",  img: "/party.svg"  },
  { label: "Gym",   img: "/gym.svg"    },
];

function Stars({ count }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(count)].map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 16 16" fill="#FFC633">
          <path d="M8 1l1.796 3.64L14 5.635l-3 2.924.708 4.13L8 10.5l-3.708 2.19L5 8.56 2 5.635l4.204-.995L8 1z"/>
        </svg>
      ))}
    </div>
  );
}

export default function HomePage() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [topSelling, setTopSelling] = useState([]);
  const [loadingNew, setLoadingNew] = useState(true);
  const [loadingTop, setLoadingTop] = useState(true);

  useEffect(() => {
    productService.getNewArrivals()
      .then(setNewArrivals)
      .catch(() => setNewArrivals([]))
      .finally(() => setLoadingNew(false));

    productService.getTopProducts()
      .then(setTopSelling)
      .catch(() => setTopSelling([]))
      .finally(() => setLoadingTop(false));
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="bg-[#F2F0F1] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center relative min-h-[500px]">
          
          {/* Left text */}
          <div className="z-10 pt-10 pb-10 md:pb-0 max-w-lg flex-shrink-0">
            <h1 className="text-4xl md:text-6xl font-black uppercase leading-none tracking-tight mb-5">
              Find Clothes<br/>That Matches<br/>Your Style
            </h1>
            <p className="text-gray-500 text-sm mb-7 leading-relaxed max-w-sm">
              Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.
            </p>
            <button className="bg-black text-white rounded-full px-10 py-3.5 font-medium text-sm hover:bg-gray-800 transition">
              Shop Now
            </button>

            <div className="flex gap-6 md:gap-10 mt-10 flex-wrap">
              <div>
                <div className="font-black text-2xl md:text-3xl">200+</div>
                <div className="text-gray-500 text-xs mt-0.5">International Brands</div>
              </div>
              <div className="border-l border-gray-300 pl-6 md:pl-10">
                <div className="font-black text-2xl md:text-3xl">2,000+</div>
                <div className="text-gray-500 text-xs mt-0.5">High-Quality Products</div>
              </div>
              <div className="border-l border-gray-300 pl-6 md:pl-10">
                <div className="font-black text-2xl md:text-3xl">30,000+</div>
                <div className="text-gray-500 text-xs mt-0.5">Happy Customers</div>
              </div>
            </div>
          </div>

          {/* Hero image */}
          <div className="flex-1 flex justify-center md:justify-end items-end h-full relative">
            <img
              src="/hero.jpg"
              alt="hero"
              className="h-[420px] md:h-[500px] object-contain object-bottom"
            />
            {/* Star decorations */}
            <img src="/star1.svg" alt="" className="absolute top-8 right-0 w-16 h-16 md:w-24 md:h-24" />
            <img src="/star2.svg" alt="" className="absolute bottom-32 left-0 w-8 h-8 md:w-12 md:h-12" />
          </div>
        </div>
      </section>

      {/* BRANDS */}
      <div className="bg-black py-5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-around flex-wrap gap-4">
          {BRANDS.map((b) => (
            <span key={b} className="text-white font-bold text-sm md:text-xl tracking-widest">{b}</span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* NEW ARRIVALS */}
        <div className="border-b border-gray-100">
          <ProductSection title="New Arrivals" products={newArrivals} loading={loadingNew} />
        </div>

        {/* TOP SELLING */}
        <div className="border-b border-gray-100">
          <ProductSection title="Top Selling" products={topSelling} loading={loadingTop} />
        </div>

        {/* BROWSE BY DRESS STYLE */}
        <section className="py-10">
          <div className="bg-[#F0F0F0] rounded-3xl p-6 md:p-10">
            <h2 className="text-2xl md:text-3xl font-black uppercase text-center mb-8 tracking-tight">
              Browse By Dress Style
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {DRESS_STYLES.map((style) => (
                <div
                  key={style.label}
                  className="rounded-2xl overflow-hidden relative cursor-pointer bg-white h-48 md:h-64"
                >
                  <img
                    src={style.img}
                    alt={style.label}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-4 left-4 font-bold text-lg md:text-xl text-black">
                    {style.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* OUR HAPPY CUSTOMERS */}
        <section className="py-8 mb-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
              Our Happy Customers
            </h2>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition text-sm">
                &#8592;
              </button>
              <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition text-sm">
                &#8594;
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {REVIEWS.map((r) => (
              <div key={r.name} className="border border-gray-200 rounded-2xl p-6">
                <Stars count={r.rating} />
                <div className="flex items-center gap-2 mt-3 mb-3">
                  <span className="font-bold text-sm">{r.name}</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="7" fill="#01AB31"/>
                    <path d="M4 7l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
