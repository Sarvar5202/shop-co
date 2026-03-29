import axiosInstance from "../config/axios.config";

const normalizeProduct = (p) => ({
  id: p._id,
  name: p.name,
  description: p.description,
  price: p.price,
  discount_percent: p.discount || 0,
  rating: p.rank || 0,
  image: p.pictures?.[0] || "",
  images: p.pictures || [],
  colors: p.colors || [],
  size: p.size,
  type: p.type,
  dressStyle: p.dressStyle,
});

const normalizeReview = (r) => ({
  id: r._id,
  reviewerName: r.reviewerName,
  user: { name: r.reviewerName },
  rating: r.stars,
  comment: r.comment,
  product: r.productId ? {
    id: r.productId._id,
    name: r.productId.name,
    image: r.productId.pictures?.[0],
  } : null,
  createdAt: new Date().toISOString(),
});

const normalizeOrder = (o) => {
  const statusMap = {
    "ON_THE_WAY": "on_the_way",
  };
  return {
    id: o._id,
    user: { 
      name: `${o.firstName} ${o.lastName}`,
      email: o.email,
    },
    items: o.items || [],
    total: o.items?.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0) || 0,
    status: statusMap[o.status] || o.status?.toLowerCase() || "pending",
    createdAt: new Date().toISOString(),
    shippingAddress: `${o.apartment || ""}, ${o.city || ""}, ${o.country || ""}`.trim(),
    phone: o.phoneNumber,
    notes: o.notes,
    city: o.city,
    country: o.country,
  };
};

export const adminService = {
  getProducts: async () => {
    const res = await axiosInstance.get("/products", { params: { limit: 100 } });
    const data = res.data;
    const products = data.products || data.data || [];
    return products.map(normalizeProduct);
  },

  getProductById: async (id) => {
    const res = await axiosInstance.get(`/products/${id}`);
    const raw = res.data?.product || res.data?.data || res.data;
    return normalizeProduct(raw);
  },

  createProduct: async (product) => {
    const payload = {
      name: product.name,
      description: product.description,
      price: Number(product.price),
      discount: Number(product.discount_percent) || 0,
      colors: product.colors || [],
      size: product.size,
      type: product.type,
      dressStyle: product.dressStyle,
      pictures: product.image ? [product.image] : [],
    };
    const res = await axiosInstance.post("/products", payload);
    return normalizeProduct(res.data);
  },

  updateProduct: async (id, product) => {
    const payload = {
      name: product.name,
      description: product.description,
      price: Number(product.price),
      discount: Number(product.discount_percent) || 0,
      colors: product.colors || [],
      size: product.size,
      type: product.type,
      dressStyle: product.dressStyle,
      pictures: product.image ? [product.image] : [],
    };
    const res = await axiosInstance.put(`/products/${id}`, payload);
    const raw = res.data?.product || res.data?.data || res.data;
    return normalizeProduct(raw);
  },

  deleteProduct: async (id) => {
    const res = await axiosInstance.delete(`/products/${id}`);
    return res.data;
  },
};

export const reviewService = {
  getReviews: async () => {
    const res = await axiosInstance.get("/reviews", { params: { limit: 100 } });
    const data = res.data;
    const reviews = data.reviews || data.data || [];
    return reviews.map(normalizeReview);
  },

  deleteReview: async (id) => {
    const res = await axiosInstance.delete(`/reviews/${id}`);
    return res.data;
  },
};

export const orderService = {
  getOrders: async () => {
    const res = await axiosInstance.get("/orders", { params: { limit: 200 } });
    const data = res.data;
    const orders = data.orders || data.data || [];
    return orders.map(normalizeOrder);
  },

  getOrderById: async (id) => {
    const res = await axiosInstance.get(`/orders/${id}`);
    return normalizeOrder(res.data);
  },

  updateOrderStatus: async (id, status) => {
    const statusMap = {
      pending: "PENDING",
      processing: "PROCESSING",
      shipped: "SHIPPED",
      on_the_way: "ON_THE_WAY",
      delivered: "DELIVERED",
      cancelled: "CANCELLED",
    };
    const res = await axiosInstance.patch(`/orders/${id}`, { 
      status: statusMap[status] || status.toUpperCase() 
    });
    return normalizeOrder(res.data);
  },
};
