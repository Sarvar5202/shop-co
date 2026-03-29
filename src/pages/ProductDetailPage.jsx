import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { productService } from "../service/product.service";
import ProductCard from "../components/ProductCard";

const TABS = ["Product Details", "Rating & Reviews", "FAQs"];

const MOCK_REVIEWS = [
  { id: 1, name: "Samantha D.", rating: 4, text: "I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail.", date: "August 14, 2023" },
  { id: 2, name: "Alex M.", rating: 4, text: "The t-shirt exceeded my expectations! The colors are vibrant and the print quality is top-notch. Being a UI/UX designer myself, I'm quite picky about aesthetics.", date: "August 15, 2023" },
  { id: 3, name: "Ethan R.", rating: 3, text: "This t-shirt is a must-have for anyone who appreciates good design. The minimalistic yet stylish pattern caught my eye, and the fit is perfect.", date: "August 16, 2023" },
  { id: 4, name: "Olivia P.", rating: 4, text: "As a UI/UX enthusiast, I value simplicity and functionality. This t-shirt not only represents those principles but also feels great to wear.", date: "August 17, 2023" },
  { id: 5, name: "Liam K.", rating: 5, text: "This t-shirt is a fusion of comfort and creativity. The fabric is soft, and the design speaks volumes about the designer's skill.", date: "August 18, 2023" },
  { id: 6, name: "Ava H.", rating: 4, text: "I'm not just wearing a t-shirt; I'm wearing a piece of design philosophy. The intricate details and thoughtful layout make this shirt a conversation starter.", date: "August 19, 2023" },
];

const SIZES = ["Small", "Medium", "Large", "X-Large"];

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={`text-sm ${s <= Math.round(rating) ? "text-yellow-400" : "text-gray-200"}`}>
          &#9733;
        </span>
      ))}
      <span className="text-sm text-gray-500 ml-1">{rating}/5</span>
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState("Large");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("Rating & Reviews");

  useEffect(() => {
    setLoading(true);
    setError(null);
    window.scrollTo(0, 0);

    productService
      .getProductById(id)
      .then((p) => {
        setProduct(p);
        return productService.getRelatedProducts(p?.type);
      })
      .then(setRelated)
      .catch(() => setError("Mahsulot topilmadi"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 animate-pulse">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex gap-4 flex-1">
            <div className="flex flex-col gap-3 w-24">
              {[1, 2, 3].map((i) => <div key={i} className="bg-gray-200 rounded-xl aspect-square" />)}
            </div>
            <div className="flex-1 bg-gray-200 rounded-2xl aspect-square" />
          </div>
          <div className="flex-1 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-24 bg-gray-200 rounded" />
            <div className="h-12 bg-gray-200 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 text-center">
        <p className="text-gray-500 text-lg mb-4">{error}</p>
        <Link to="/" className="bg-black text-white rounded-full px-6 py-3 text-sm font-semibold">
          Bosh sahifaga qaytish
        </Link>
      </div>
    );
  }

  const images = product?.images?.length ? product.images : [];
  const hasDiscount = product?.discount_percent > 0;
  const finalPrice = hasDiscount
    ? (product.price - (product.price * product.discount_percent) / 100).toFixed(0)
    : product?.price;

  const colors = product?.colors || [];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to="/" className="hover:text-black">Home</Link>
        <span>&#8250;</span>
        <span className="cursor-pointer hover:text-black">Shop</span>
        <span>&#8250;</span>
        <span className="cursor-pointer hover:text-black">Men</span>
        <span>&#8250;</span>
        <span className="text-black font-medium">{product?.type || "T-shirts"}</span>
      </nav>

      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <div className="flex flex-col-reverse md:flex-row gap-3 flex-1 max-w-xl">
          <div className="hidden md:flex flex-col gap-3 w-24">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`bg-gray-100 rounded-xl overflow-hidden aspect-square border-2 transition ${selectedImage === i ? "border-black" : "border-transparent"}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          <div className="flex-1 bg-gray-100 rounded-2xl overflow-hidden aspect-square">
            {images[selectedImage] ? (
              <img src={images[selectedImage]} alt={product?.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-200" />
            )}
          </div>

          <div className="flex md:hidden gap-3 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`bg-gray-100 rounded-xl overflow-hidden w-20 h-20 border-2 flex-shrink-0 transition ${selectedImage === i ? "border-black" : "border-transparent"}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-black uppercase leading-tight mb-2">
            {product?.name}
          </h1>
          <Stars rating={product?.rating || 0} />

          <div className="flex items-center gap-3 mt-3 mb-4">
            <span className="text-2xl font-black">${finalPrice}</span>
            {hasDiscount && (
              <>
                <span className="text-gray-400 line-through text-xl">${product.price}</span>
                <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-0.5 rounded-full">
                  -{product.discount_percent}%
                </span>
              </>
            )}
          </div>

          <p className="text-gray-500 text-sm leading-relaxed border-b border-gray-100 pb-4 mb-4">
            {product?.description}
          </p>

          {colors.length > 0 && (
            <div className="mb-5">
              <p className="text-sm text-gray-500 mb-3">Select Colors</p>
              <div className="flex gap-3">
                {colors.map((hex, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(i)}
                    style={{ backgroundColor: `#${hex}` }}
                    className={`w-9 h-9 rounded-full border-4 transition ${selectedColor === i ? "border-black scale-110" : "border-gray-200"}`}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="mb-6 border-b border-gray-100 pb-5">
            <p className="text-sm text-gray-500 mb-3">Choose Size</p>
            <div className="flex gap-2 flex-wrap">
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                    selectedSize === size
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-3 gap-4">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="font-bold text-lg leading-none">&#8722;</button>
              <span className="font-semibold w-6 text-center">{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)} className="font-bold text-lg leading-none">&#43;</button>
            </div>
            <button className="flex-1 bg-black text-white rounded-full py-3 font-semibold text-sm hover:bg-gray-800 transition">
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 mb-8">
        <div className="flex gap-8 md:gap-16">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium transition border-b-2 ${
                activeTab === tab ? "border-black text-black" : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "Rating & Reviews" && (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg">
              All Reviews <span className="text-gray-400 font-normal text-base">(451)</span>
            </h3>
            <div className="flex items-center gap-3">
              <select className="border border-gray-200 rounded-full px-4 py-2 text-sm outline-none">
                <option>Latest</option>
                <option>Oldest</option>
                <option>Top rated</option>
              </select>
              <button className="bg-black text-white rounded-full px-5 py-2 text-sm font-medium hover:bg-gray-800 transition">
                Write a Review
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_REVIEWS.map((r) => (
              <div key={r.id} className="border border-gray-200 rounded-2xl p-5">
                <Stars rating={r.rating} />
                <div className="flex items-center gap-2 mt-2 mb-2">
                  <span className="font-bold text-sm">{r.name}</span>
                  <span className="text-green-500 text-xs">&#10003;</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{r.text}</p>
                <p className="text-gray-400 text-xs mt-3">Posted on {r.date}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <button className="border border-gray-300 rounded-full px-8 py-3 text-sm font-medium hover:bg-black hover:text-white transition">
              Load More Reviews
            </button>
          </div>
        </div>
      )}

      {activeTab === "Product Details" && (
        <div className="mb-12 text-gray-600 text-sm leading-relaxed max-w-2xl">
          <p>{product?.description}</p>
        </div>
      )}

      {activeTab === "FAQs" && (
        <div className="mb-12 text-gray-600 text-sm max-w-2xl">
          <p>Frequently asked questions about this product.</p>
        </div>
      )}

      <section className="py-4 mb-8">
        <h2 className="text-2xl md:text-3xl font-black uppercase text-center tracking-tight mb-8">
          You Might Also Like
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {related.length > 0
            ? related.map((p) => <ProductCard key={p.id} product={p} />)
            : [1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-2xl aspect-square mb-3" />
                  <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
        </div>
      </section>
    </div>
  );
}
