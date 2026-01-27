import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Package,
  MapPin,
  Calendar,
  Truck,
  CheckCircle,
  Clock,
  Download,
  Eye,
  ArrowLeft,
} from "lucide-react";

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState("all");

  /* ================= FETCH ORDERS ================= */

  const fetchUserOrders = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/orders/my-orders`,
        { withCredentials: true }
      );

      setOrders(res.data);
      setLoading(false);
    } catch (error) {
      console.error("ORDERS ERROR ", error.response?.data || error.message);

      if (error.response?.status === 401) {
        navigate("/login");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, []);

  /* ================= UI HELPERS ================= */

  const getStatusIcon = (status) => {
    switch (status) {
      case "Processing":
        return <Clock size={20} className="text-yellow-500" />;
      case "Shipped":
        return <Truck size={20} className="text-blue-500" />;
      case "Delivered":
        return <CheckCircle size={20} className="text-green-500" />;
      default:
        return <Package size={20} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "bg-yellow-100 text-yellow-700 border border-yellow-300";
      case "Shipped":
        return "bg-blue-100 text-blue-700 border border-blue-300";
      case "Delivered":
        return "bg-green-100 text-green-700 border border-green-300";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-300";
    }
  };

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((o) => o.status === filter);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <Package className="text-yellow-600 mx-auto" size={48} />
          </div>
          <p className="text-gray-700 font-semibold">
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-yellow-600 font-semibold mb-6"
          >
            <ArrowLeft size={20} /> Back to Home
          </button>
          <p className="text-gray-600">
            Total Orders:{" "}
            <span className="font-bold text-yellow-600">
              {orders.length}
            </span>
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {["all", "Processing", "Shipped", "Delivered"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-semibold ${
                filter === status
                  ? "bg-yellow-400 text-black"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Orders */}
        {filteredOrders.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Orders List */}
            <div className="lg:col-span-2 space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order._id}
                  onClick={() => setSelectedOrder(order)}
                  className={`bg-white p-6 rounded-lg shadow-md cursor-pointer border-l-4 ${
                    selectedOrder?._id === order._id
                      ? "border-yellow-400 bg-yellow-50"
                      : "border-gray-300"
                  }`}
                >
                  <div className="flex justify-between mb-4">
                    <div>
                      <h3 className="font-bold">{order._id}</h3>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <p className="font-bold text-yellow-600">
                    ₹{order.total.toLocaleString()}
                  </p>

                  <button className="mt-3 flex items-center gap-2 text-blue-600 font-semibold">
                    <Eye size={16} /> View Details
                  </button>
                </div>
              ))}
            </div>

            {/* Order Details */}
            <div>
              {selectedOrder ? (
                <div className="bg-white p-6 rounded-lg shadow-md sticky top-6">
                  <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Order ID:</strong> {selectedOrder._id}
                  </p>

                  <div className="border-t pt-3">
                    {selectedOrder.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between text-sm mb-2"
                      >
                        <span>{item.productName}</span>
                        <span>
                          ₹
                          {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t mt-4 pt-4">
                    <p>Subtotal: ₹{selectedOrder.subtotal}</p>
                    <p>Shipping: ₹{selectedOrder.shipping}</p>
                    <p>Tax: ₹{selectedOrder.tax}</p>
                    <p className="font-bold text-lg mt-2">
                      Total: ₹{selectedOrder.total}
                    </p>
                  </div>

                  <button
                    className="w-full mt-4 bg-green-500 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                  >
                    <Download size={18} /> Download Invoice
                  </button>
                </div>
              ) : (
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                  <Package size={48} className="mx-auto text-gray-300 mb-4" />
                  <p>Select an order to view details</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center p-12 bg-white shadow-md rounded-lg">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-bold mb-2">No Orders Found</h2>
            <button
              onClick={() => navigate("/products")}
              className="bg-yellow-400 px-6 py-3 rounded-lg font-bold"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
