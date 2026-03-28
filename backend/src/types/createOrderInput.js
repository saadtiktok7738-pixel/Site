import OrderItem from "./orderItem";
import CreateOrderInputPaymentMethod from "./createOrderInputPaymentMethod";

// Example object shape for reference
const CreateOrderInput = {
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  customerAddress: "",
  customerCity: "",
  items: [],                  // array of OrderItem objects
  total: 0,
  paymentMethod: CreateOrderInputPaymentMethod,
  notes: null                 // optional
};

export default CreateOrderInput;