import OrderItem from "./orderItem";
import OrderPaymentMethod from "./orderPaymentMethod";
import OrderStatus from "./orderStatus";

// Example object shape for reference
const Order = {
  id: 0,
  orderId: "",
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  customerAddress: "",
  customerCity: "",
  items: [],                     // array of OrderItem objects
  total: 0,
  status: OrderStatus,           // use OrderStatus object
  paymentMethod: OrderPaymentMethod, // use OrderPaymentMethod object
  notes: null,                   // optional
  createdAt: ""                  // ISO string
};

export default Order;