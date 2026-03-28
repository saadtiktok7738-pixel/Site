import React, { useState, useMemo } from "react";
import { useListOrders, useListProducts } from "../../apis/index.js";
import { formatPrice } from "../../libs/utils.js";
import { Package, ShoppingCart, DollarSign, TrendingUp, Calendar } from "lucide-react";
import { useAuth } from "../../hooks/use-store.js";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Input } from "../../ui/input.jsx";
import { Button } from "../../ui/button.jsx";

function toDateStr(d) {
  return d.toISOString().slice(0, 10);
}

export default function AdminDashboard() {
  const { adminToken } = useAuth();

  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const [fromDate, setFromDate] = useState(toDateStr(thirtyDaysAgo));
  const [toDate, setToDate] = useState(toDateStr(today));
  const [applied, setApplied] = useState({ from: toDateStr(thirtyDaysAgo), to: toDateStr(today) });

  const { data: orders } = useListOrders({ request: { headers: { Authorization: `Bearer ${adminToken}` } } });
  const { data: products } = useListProducts();

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    return orders.filter(o => {
      const d = o.createdAt.slice(0, 10);
      return d >= applied.from && d <= applied.to;
    });
  }, [orders, applied]);

  const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = filteredOrders.filter(o => o.status === "pending").length;

  const chartData = useMemo(() => {
    const map = {};
    filteredOrders.forEach(o => {
      const day = o.createdAt.slice(0, 10);
      map[day] = (map[day] || 0) + o.total;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, revenue]) => ({ name: name.slice(5), revenue }));
  }, [filteredOrders]);

  const handleApply = () => setApplied({ from: fromDate, to: toDate });
  const handleReset = () => {
    setFromDate(toDateStr(thirtyDaysAgo));
    setToDate(toDateStr(today));
    setApplied({ from: toDateStr(thirtyDaysAgo), to: toDateStr(today) });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Date Filter */}
      <div className="bg-white p-4 rounded-2xl border border-border shadow-sm flex flex-wrap items-end gap-3">
        <Calendar className="w-5 h-5 text-muted-foreground mt-auto mb-2 hidden sm:block" />
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1">From</label>
          <Input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="h-9 text-sm w-36" max={toDate} />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1">To</label>
          <Input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="h-9 text-sm w-36" min={fromDate} />
        </div>
        <Button size="sm" onClick={handleApply} className="h-9">Apply</Button>
        <Button size="sm" variant="outline" onClick={handleReset} className="h-9">Reset</Button>
        <span className="text-xs text-muted-foreground mt-auto mb-2">
          Showing {filteredOrders.length} orders from {applied.from} to {applied.to}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Revenue", value: formatPrice(totalRevenue), icon: DollarSign, color: "text-green-600", bg: "bg-green-100" },
          { title: "Orders", value: filteredOrders.length, icon: ShoppingCart, color: "text-blue-600", bg: "bg-blue-100" },
          { title: "Pending", value: pendingOrders, icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-100" },
          { title: "Products", value: products?.length || 0, icon: Package, color: "text-purple-600", bg: "bg-purple-100" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-border shadow-sm flex items-center gap-5">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-medium mb-0.5">{stat.title}</p>
              <h3 className="text-xl font-bold text-foreground">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Chart & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-border shadow-sm">
          <h3 className="text-base font-bold mb-5">Revenue Overview</h3>
          {chartData.length > 0 ? (
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} tickFormatter={v => `₨${(v/1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    formatter={(v) => [formatPrice(v), "Revenue"]}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="hsl(142 52% 50%)" strokeWidth={3} dot={{ r: 3, fill: 'hsl(142 52% 50%)', strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[260px] flex items-center justify-center text-muted-foreground text-sm">
              No orders in this date range
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col">
          <h3 className="text-base font-bold mb-5 flex-shrink-0">Recent Orders</h3>
          <div className="space-y-3 flex-1 overflow-y-auto">
            {filteredOrders.slice(0, 6).map(order => (
              <div key={order.id} className="flex justify-between items-center p-3 rounded-xl hover:bg-secondary transition-colors">
                <div>
                  <p className="font-semibold text-xs">{order.orderId || `#${order.id}`}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[120px]">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xs text-accent">{formatPrice(order.total)}</p>
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mt-0.5 ${order.status === 'pending' ? 'bg-amber-100 text-amber-700' : order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            {filteredOrders.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">No orders in range</p>}
          </div>
        </div>
      </div>
    </div>
  );
}