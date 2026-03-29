function fixUrl(url) {
  if (!url) return null;
  return url.replace(/([^:])\/\/+/g, "$1/");
}

export function normalizeProduct(raw) {
  if (!raw) return null;
  return {
    id: raw._id || raw.id,
    name: raw.name || "",
    description: raw.description || "",
    price: parseFloat(raw.price || 0),
    discount_percent: parseFloat(raw.discount || 0),
    rating: parseFloat(raw.rank || raw.rating || 0),
    image: fixUrl(raw.pictures?.[0]) || null,
    images: Array.isArray(raw.pictures) ? raw.pictures.map(fixUrl) : [],
    colors: Array.isArray(raw.colors) ? raw.colors : [],
    size: raw.size || "",
    type: raw.type || "",
    dressStyle: raw.dressStyle || "",
  };
}

export function extractProducts(data) {
  if (!data) return [];
  const arr =
    data.products ||
    data.results ||
    data.data ||
    data.items ||
    (Array.isArray(data) ? data : []);
  return arr.map(normalizeProduct).filter((p) => p && p.id);
}
