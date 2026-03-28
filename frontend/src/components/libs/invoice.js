// utils/invoice.js
import React from "react";
function formatPrice(amount) {
  return `Rs ${amount.toLocaleString("en-PK")}`;
}

export function downloadInvoice(order) {
  const date = new Date(order.createdAt).toLocaleDateString("en-PK", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const itemsHtml = order.items
    .map(item => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;">${item.productName}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:right;">${formatPrice(item.price)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:right;font-weight:600;">${formatPrice(item.price * item.quantity)}</td>
      </tr>
    `)
    .join("");

  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Invoice ${order.orderId}</title>
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: 'Segoe UI', Arial, sans-serif; color: #222; background: #fff; }
      .page { max-width: 760px; margin: 0 auto; padding: 48px 40px; }
      .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 3px solid #111; padding-bottom: 24px; }
      .brand { font-size: 28px; font-weight: 800; letter-spacing: -1px; }
      .invoice-meta { text-align: right; }
      .invoice-meta h1 { font-size: 22px; font-weight: 700; color: #111; letter-spacing: 2px; margin-bottom: 6px; }
      .invoice-meta p { font-size: 13px; color: #666; }
      .invoice-meta .order-id { font-family: monospace; font-size: 15px; font-weight: 700; color: #e63946; background: #fff5f5; border: 1px solid #fecdca; padding: 4px 10px; display: inline-block; margin-top: 6px; }
      .section { margin-bottom: 28px; }
      .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #999; margin-bottom: 10px; }
      .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
      .detail-block p { font-size: 14px; line-height: 1.7; color: #444; }
      .detail-block strong { color: #111; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
      thead { background: #111; color: #fff; }
      thead th { padding: 12px; text-align: left; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
      thead th:last-child { text-align: right; }
      thead th:nth-child(2) { text-align: center; }
      thead th:nth-child(3) { text-align: right; }
      tbody tr:hover { background: #fafafa; }
      .total-row { background: #f9f9f9; }
      .total-row td { padding: 14px 12px; font-weight: 700; font-size: 16px; }
      .free-shipping { color: #16a34a; font-weight: 600; }
      .footer { margin-top: 48px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; font-size: 12px; color: #999; }
      @media print {
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .no-print { display: none; }
      }
    </style>
  </head>
  <body>
    <div class="page">
      <div class="header">
        <div>
          <div class="brand">Value Cart</div>
          <p style="font-size:13px;color:#666;margin-top:6px;">Pakistan's Premium Online Store</p>
        </div>
        <div class="invoice-meta">
          <h1>INVOICE</h1>
          <p>Date: ${date}</p>
          <div class="order-id">#${order.orderId}</div>
        </div>
      </div>

      <div class="details-grid section">
        <div class="detail-block">
          <div class="section-title">Bill To</div>
          <p><strong>${order.customerName}</strong></p>
          ${order.customerEmail ? `<p>${order.customerEmail}</p>` : ""}
          <p>${order.customerPhone}</p>
          <p>${order.customerAddress}</p>
          <p>${order.customerCity}</p>
        </div>
        <div class="detail-block">
          <div class="section-title">Order Details</div>
          <p><strong>Order ID:</strong> ${order.orderId}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Payment:</strong> ${order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod}</p>
          <p><strong>Status:</strong> Confirmed</p>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Items Ordered</div>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
            <tr>
              <td colspan="3" style="padding:10px 12px;border-bottom:1px solid #eee;text-align:right;color:#666;">Shipping</td>
              <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:right;" class="free-shipping">Free</td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="total-row">
              <td colspan="3" style="text-align:right;padding:14px 12px;">Grand Total</td>
              <td style="text-align:right;padding:14px 12px;color:#e63946;">${formatPrice(order.total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div class="footer">
        <p>Thank you for shopping with Value Cart — For support, visit our website or contact customer service.</p>
        <p style="margin-top:6px;">Free delivery all over Pakistan · 7-day easy returns · COD available nationwide</p>
      </div>
    </div>
    <script>window.onload = function() { window.print(); }</script>
  </body>
  </html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");
  if (win) win.onafterprint = () => URL.revokeObjectURL(url);
}