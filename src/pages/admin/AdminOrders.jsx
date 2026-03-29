import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "../../service/admin.service";

const ORDER_STATUSES = ["pending", "processing", "shipped", "on_the_way", "delivered", "cancelled"];

export default function AdminOrders() {
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: orderService.getOrders,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => orderService.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-orders"]);
    },
  });

  const filteredOrders = orders.filter(
    (order) => statusFilter === "all" || order.status === statusFilter
  );

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700",
      processing: "bg-blue-100 text-blue-700",
      shipped: "bg-purple-100 text-purple-700",
      on_the_way: "bg-orange-100 text-orange-700",
      delivered: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status] || styles.pending}`}>
        {status?.replace("_", " ") || "pending"}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-gray-500">Manage customer orders</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              statusFilter === "all" ? "bg-black text-white" : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            All ({orders.length})
          </button>
          {ORDER_STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition ${
                statusFilter === status ? "bg-black text-white" : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {status} ({orders.filter((o) => o.status === status).length})
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 text-sm border-b">
                  <th className="pb-4 font-medium">Order ID</th>
                  <th className="pb-4 font-medium">Customer</th>
                  <th className="pb-4 font-medium">Total</th>
                  <th className="pb-4 font-medium">Status</th>
                  <th className="pb-4 font-medium">Date</th>
                  <th className="pb-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0">
                    <td className="py-4 font-mono text-sm">#{order.id?.slice(-6) || order.id}</td>
                    <td className="py-4">
                      <div>
                        <p className="font-medium">{order.user?.name || order.customerName || "Customer"}</p>
                        <p className="text-sm text-gray-500">{order.user?.email || order.customerEmail || ""}</p>
                      </div>
                    </td>
                    <td className="py-4 font-medium">${order.total || order.totalPrice || 0}</td>
                    <td className="py-4">{getStatusBadge(order.status)}</td>
                    <td className="py-4 text-gray-500 text-sm">
                      {order.createdAt?.slice(0, 10) || "N/A"}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <select
                          value={order.status}
                          onChange={(e) => {
                            updateStatusMutation.mutate({ id: order.id, status: e.target.value });
                          }}
                          className="px-3 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                        >
                          {ORDER_STATUSES.map((status) => (
                            <option key={status} value={status} className="capitalize">
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-500">No orders found</p>
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold">Order Details</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-mono font-medium">#{selectedOrder.id?.slice(-6) || selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="font-medium">{selectedOrder.user?.name || selectedOrder.customerName || "N/A"}</p>
                  <p className="text-sm text-gray-500">{selectedOrder.user?.email || selectedOrder.customerEmail || ""}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{selectedOrder.createdAt?.slice(0, 10) || "N/A"}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-3">Items</p>
                {selectedOrder.items.length > 0 ? (
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Product #{item.productId || "Unknown"}</p>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity || 1}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No items in order</p>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${(selectedOrder.total || 0).toFixed(2)}</span>
                </div>
              </div>

              {selectedOrder.shippingAddress && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Shipping Address</p>
                  <p className="text-gray-700">{selectedOrder.shippingAddress}</p>
                </div>
              )}

              {selectedOrder.phone && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Phone</p>
                  <p className="text-gray-700">{selectedOrder.phone}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
