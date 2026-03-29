import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "../../service/admin.service";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const productSchema = Yup.object({
  name: Yup.string()
    .min(2, "Nomi kamida 2 ta belgi bo'lishi kerak")
    .max(100, "Nomi 100 ta belgidan oshmasligi kerak")
    .required("Mahsulot nomi majburiy"),
  price: Yup.number()
    .typeError("Narx raqam bo'lishi kerak")
    .positive("Narx musbat bo'lishi kerak")
    .required("Narx majburiy"),
  description: Yup.string()
    .max(500, "Tavsif 500 ta belgidan oshmasligi kerak"),
  discount_percent: Yup.number()
    .typeError("Chegirma raqam bo'lishi kerak")
    .min(0, "Chegirma 0 dan kam bo'lmasligi kerak")
    .max(100, "Chegirma 100 dan oshmasligi kerak")
    .nullable()
    .transform((value, originalValue) =>
      originalValue === "" ? null : value
    ),
  image: Yup.string()
    .url("To'g'ri URL manzil kiriting")
    .nullable()
    .transform((value, originalValue) =>
      originalValue === "" ? null : value
    ),
  size: Yup.string().max(50, "O'lcham 50 ta belgidan oshmasligi kerak"),
  type: Yup.string().max(50, "Tur 50 ta belgidan oshmasligi kerak"),
  dressStyle: Yup.string().max(50, "Uslub 50 ta belgidan oshmasligi kerak"),
});

const initialValues = {
  name: "",
  description: "",
  price: "",
  discount_percent: "",
  image: "",
  size: "",
  type: "",
  dressStyle: "",
};

export default function AdminProducts() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [search, setSearch] = useState("");

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: adminService.getProducts,
  });

  const createMutation = useMutation({
    mutationFn: adminService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-products"]);
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => adminService.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-products"]);
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-products"]);
    },
  });

  const openModal = (product = null) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      const data = {
        ...values,
        price: Number(values.price),
        discount_percent: values.discount_percent ? Number(values.discount_percent) : 0,
      };

      if (editingProduct) {
        await updateMutation.mutateAsync({ id: editingProduct.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
    } catch (err) {
      setStatus({ error: "Xatolik yuz berdi. Qayta urinib ko'ring." });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  const getEditInitialValues = (product) => ({
    name: product.name || "",
    description: product.description || "",
    price: product.price || "",
    discount_percent: product.discount_percent || "",
    image: product.image || "",
    size: product.size || "",
    type: product.type || "",
    dressStyle: product.dressStyle || "",
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Mahsulotlar</h1>
          <p className="text-gray-500">Mahsulotlarni boshqarish</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Mahsulot qo'shish
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-4">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Mahsulot qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-80 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 text-sm border-b">
                  <th className="pb-4 font-medium">Mahsulot</th>
                  <th className="pb-4 font-medium">Narx</th>
                  <th className="pb-4 font-medium">Chegirma</th>
                  <th className="pb-4 font-medium">Reyting</th>
                  <th className="pb-4 font-medium">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b last:border-0">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image || product.images?.[0]}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-xl"
                          onError={(e) => (e.target.src = "https://via.placeholder.com/48")}
                        />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500 truncate max-w-xs">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">${product.price}</td>
                    <td className="py-4">
                      {product.discount_percent ? (
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded-lg text-sm">
                          -{product.discount_percent}%
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {product.rating || 0}
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openModal(product)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Bu mahsulotni o'chirishni xohlaysizmi?")) {
                              deleteMutation.mutate(product.id);
                            }
                          }}
                          className="p-2 hover:bg-red-50 rounded-lg transition"
                        >
                          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editingProduct ? "Mahsulotni tahrirlash" : "Mahsulot qo'shish"}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <Formik
              initialValues={editingProduct ? getEditInitialValues(editingProduct) : initialValues}
              validationSchema={productSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ isSubmitting, touched, errors, status }) => (
                <Form className="p-6 space-y-4">
                  {status?.error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                      {status.error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nomi <span className="text-red-500">*</span>
                      </label>
                      <Field
                        name="name"
                        type="text"
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition ${
                          touched.name && errors.name
                            ? "border-red-400 bg-red-50"
                            : "border-gray-200"
                        }`}
                      />
                      <ErrorMessage name="name" component="p" className="mt-1 text-sm text-red-600" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Narx ($) <span className="text-red-500">*</span>
                      </label>
                      <Field
                        name="price"
                        type="number"
                        min="0"
                        step="0.01"
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition ${
                          touched.price && errors.price
                            ? "border-red-400 bg-red-50"
                            : "border-gray-200"
                        }`}
                      />
                      <ErrorMessage name="price" component="p" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tavsif</label>
                    <Field
                      as="textarea"
                      name="description"
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition ${
                        touched.description && errors.description
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200"
                      }`}
                    />
                    <ErrorMessage name="description" component="p" className="mt-1 text-sm text-red-600" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Chegirma (%)
                      </label>
                      <Field
                        name="discount_percent"
                        type="number"
                        min="0"
                        max="100"
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition ${
                          touched.discount_percent && errors.discount_percent
                            ? "border-red-400 bg-red-50"
                            : "border-gray-200"
                        }`}
                      />
                      <ErrorMessage name="discount_percent" component="p" className="mt-1 text-sm text-red-600" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rasm URL
                      </label>
                      <Field
                        name="image"
                        type="url"
                        placeholder="https://..."
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition ${
                          touched.image && errors.image
                            ? "border-red-400 bg-red-50"
                            : "border-gray-200"
                        }`}
                      />
                      <ErrorMessage name="image" component="p" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">O'lcham</label>
                      <Field
                        name="size"
                        type="text"
                        placeholder="S, M, L, XL"
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition ${
                          touched.size && errors.size
                            ? "border-red-400 bg-red-50"
                            : "border-gray-200"
                        }`}
                      />
                      <ErrorMessage name="size" component="p" className="mt-1 text-sm text-red-600" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tur</label>
                      <Field
                        name="type"
                        type="text"
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition ${
                          touched.type && errors.type
                            ? "border-red-400 bg-red-50"
                            : "border-gray-200"
                        }`}
                      />
                      <ErrorMessage name="type" component="p" className="mt-1 text-sm text-red-600" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Uslub</label>
                      <Field
                        name="dressStyle"
                        type="text"
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition ${
                          touched.dressStyle && errors.dressStyle
                            ? "border-red-400 bg-red-50"
                            : "border-gray-200"
                        }`}
                      />
                      <ErrorMessage name="dressStyle" component="p" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-6 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition"
                    >
                      Bekor qilish
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition disabled:opacity-50"
                    >
                      {isSubmitting
                        ? "Saqlanmoqda..."
                        : editingProduct
                        ? "Yangilash"
                        : "Yaratish"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
}
