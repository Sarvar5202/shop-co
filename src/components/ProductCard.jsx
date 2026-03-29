import { Link } from "react-router-dom";

function Stars({ rating }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M7 1l1.545 3.13L12 4.635l-2.5 2.435.59 3.44L7 8.885l-3.09 1.625L4.5 7.07 2 4.635l3.455-.505L7 1z"
            fill={s <= full ? "#FFC633" : s === full + 1 && half ? "url(#half)" : "#E5E7EB"}
            stroke={s <= full || (s === full + 1 && half) ? "#FFC633" : "#E5E7EB"}
            strokeWidth="0.5"
          />
          {s === full + 1 && half && (
            <defs>
              <linearGradient id="half">
                <stop offset="50%" stopColor="#FFC633"/>
                <stop offset="50%" stopColor="#E5E7EB"/>
              </linearGradient>
            </defs>
          )}
        </svg>
      ))}
      <span className="text-xs text-gray-500 ml-1">{rating}/5</span>
    </div>
  );
}

export default function ProductCard({ product }) {
  const hasDiscount = product?.discount_percent > 0;
  const finalPrice = hasDiscount
    ? (product.price - (product.price * product.discount_percent) / 100).toFixed(0)
    : product?.price;

  return (
    <Link to={`/product/${product?.id}`} className="group block">
      <div className="bg-[#F0EEED] rounded-2xl overflow-hidden aspect-square mb-3 relative">
        {product?.image ? (
          <img
            src={product.image}
            alt={product?.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
        {hasDiscount && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            -{product.discount_percent}%
          </span>
        )}
      </div>
      <h3 className="font-semibold text-sm text-gray-900 leading-tight mb-1">{product?.name}</h3>
      <Stars rating={product?.rating || 0} />
      <div className="flex items-center gap-2 mt-1">
        <span className="font-bold text-base">${finalPrice}</span>
        {hasDiscount && (
          <>
            <span className="text-gray-400 line-through text-sm">${product.price}</span>
            <span className="text-red-500 text-xs font-semibold bg-red-50 px-1.5 py-0.5 rounded-full">
              -{product.discount_percent}%
            </span>
          </>
        )}
      </div>
    </Link>
  );
}
