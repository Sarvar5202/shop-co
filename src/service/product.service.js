import axiosInstance from "../config/axios.config";
import { extractProducts, normalizeProduct } from "./product.adapter";

export const productService = {
  getAllProducts: async () => {
    const res = await axiosInstance.get("/products");
    const data = res.data;
    const total = data.count || data.total || 0;
    const products = extractProducts(data);
    if (total <= products.length) return products;
    const pages = Math.ceil(total / (products.length || 10));
    const reqs = [];
    for (let page = 2; page <= pages; page++) {
      reqs.push(axiosInstance.get("/products", { params: { page, limit: products.length } }));
    }
    const rest = (await Promise.all(reqs)).flatMap((r) => extractProducts(r.data));
    return [...products, ...rest];
  },

  getProductById: async (id) => {
    const res = await axiosInstance.get(`/products/${id}`);
    const raw = res.data?.product || res.data?.data || res.data;
    return normalizeProduct(raw);
  },

  getNewArrivals: async () => {
    const all = await productService.getAllProducts();
    return all.slice(0, 4);
  },

  getTopProducts: async () => {
    const all = await productService.getAllProducts();
    return [...all].sort((a, b) => b.rating - a.rating).slice(0, 4);
  },

  getRelatedProducts: async (type) => {
    const all = await productService.getAllProducts();
    const related = all.filter((p) => p.type === type);
    return related.length >= 4 ? related.slice(0, 4) : all.slice(0, 4);
  },
};
