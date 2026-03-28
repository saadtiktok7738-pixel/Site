import React, { useState } from "react";
import { useListOrders, useUpdateOrderStatus, useDeleteOrder } from "../../apis/index.js";
import { useAuth } from "../../hooks/use-store.js";
import { formatPrice } from "../../libs/utils.js";
import { Trash2, Download } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { downloadInvoice } from "../../libs/invoice.js";

const STATUSES = ["pending", "confirmed", "shipping", "delivered", "cancelled"];

export default function AdminOrders() {
  const { adminToken } = useAuth();
  const queryClient = useQueryClient();
  const { data: orders } = useListOrders({ request: { headers: { Authorization: `Bearer ${adminToken}` } } });
  const { mutate: updateStatus } = useUpdateOrderStatus();
  const { mutate: deleteOrder } = useDeleteOrder();
  const [expandedId, setExpandedId] = useState(null);

  const authHeader = { Authorization: `Bearer ${adminToken}` };
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["/api/orders"] });

  const handleStatusChange = (id, status) => {
    updateStatus(
      { id, data: { status }, request: { headers: authHeader } },
      { onSuccess: invalidate }
    );
  };

  const handleDelete = (id) => {
    if (!confirm("Delete this order permanently?")) return;
    deleteOrder({ id, request: { headers: authHeader } }, { onSuccess: invalidate });
  };

  const statusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'shipping': return 'bg-violet-100 text-violet-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-border shadow-sm flex items-center justify-between">
        <h2 className="text-2xl font-bold">Orders Management</h2>
        <span className="text-sm text-muted-foreground">{orders?.length || 0} total orders</span>
      </div>

      <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-secondary/50 text-muted-foreground uppercase tracking-wider text-xs border-b border-border">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Date</th>
                <th className="p-4">Total</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders?.map(order => (
                <React.Fragment key={order.id}>
                  <tr
                    className="hover:bg-secondary/20 transition-colors cursor-pointer"
                    onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                  >
                    <td className="p-4 font-mono text-xs font-bold text-accent">{order.orderId}</td>
                    <td className="p-4">
                      <p className="font-semibold">{order.customerName}</p>
                      <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                    </td>
                    <td className="p-4 text-muted-foreground text-xs">
                      {new Date(order.createdAt).toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="p-4 font-bold">{formatPrice(order.total)}</td>
                    <td className="p-4">
                      <span className="uppercase text-xs font-bold">{order.paymentMethod}</span>
                    </td>
                    <td className="p-4" onClick={e => e.stopPropagation()}>
                      <select
                        value={order.status}
                        onChange={e => handleStatusChange(order.id, e.target.value)}
                        className={`text-xs font-bold px-2 py-1 border-0 outline-none cursor-pointer ${statusColor(order.status)}`}
                      >
                        {STATUSES.map(s => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <button
                          title="Download Invoice"
                          onClick={() => downloadInvoice({
                            orderId: order.orderId,
                            customerName: order.customerName,
                            customerEmail: order.customerEmail,
                            customerPhone: order.customerPhone,
                            customerAddress: order.customerAddress,
                            customerCity: order.customerCity,
                            items: order.items ?? [],
                            total: order.total,
                            paymentMethod: order.paymentMethod,
                            createdAt: order.createdAt,
                          })}
                          className="text-muted-foreground hover:text-accent transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(order.id)} className="text-destructive hover:opacity-70">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedId === order.id && (
                    <tr>
                      <td colSpan={7} className="p-4 bg-secondary/30">
                        <div className="space-y-2">
                          <p className="text-xs font-bold uppercase text-muted-foreground mb-2">Order Items</p>
                          {order.items?.map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <img src={item.imageUrl} alt={item.productName} className="w-10 h-10 object-cover bg-secondary" />
                              <div>
                                <p className="text-sm font-semibold">{item.productName}</p>
                                {item.color && (
                                  <div className="flex items-center gap-1 mt-0.5">
                                    <span className="w-3 h-3 rounded-full border border-border inline-block" style={{ backgroundColor: item.color }} />
                                    <span className="text-xs text-muted-foreground capitalize">{item.color}</span>
                                  </div>
                                )}
                                <p className="text-xs text-muted-foreground">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                              </div>
                            </div>
                          ))}
                          <div className="pt-2 text-xs text-muted-foreground border-t border-border mt-2">
                            <p><strong>Address:</strong> {order.customerAddress}, {order.customerCity}</p>
                            <p><strong>Phone:</strong> {order.customerPhone}</p>
                            {order.notes && <p><strong>Notes:</strong> {order.notes}</p>}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}