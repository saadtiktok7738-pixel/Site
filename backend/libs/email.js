import nodemailer from "nodemailer";
import { logger } from "./logger.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendOrderEmail(order) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    logger.warn("Email credentials not configured — skipping order email");
    return;
  }

  const itemsHtml = order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;">${item.productName}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">Rs ${item.price.toLocaleString("en-PK")}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;font-weight:600;">Rs ${(item.price * item.quantity).toLocaleString("en-PK")}</td>
        </tr>`
    )
    .join("");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#222;">
      <div style="background:#111;padding:20px 24px;">
        <h1 style="color:#fff;margin:0;font-size:22px;letter-spacing:-0.5px;">Value Cart</h1>
      </div>
      <div style="padding:24px;">
        <h2 style="color:#111;margin-top:0;">🛒 New Order Received</h2>
        <p style="color:#555;font-size:14px;">A new order has been placed on your store.</p>

        <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:13px;">
          <tr><td style="padding:6px 0;color:#888;width:140px;">Order ID</td><td style="padding:6px 0;font-weight:700;font-family:monospace;color:#e63946;">#${order.orderId}</td></tr>
          <tr><td style="padding:6px 0;color:#888;">Customer</td><td style="padding:6px 0;">${order.customerName}</td></tr>
          <tr><td style="padding:6px 0;color:#888;">Email</td><td style="padding:6px 0;">${order.customerEmail || "—"}</td></tr>
          <tr><td style="padding:6px 0;color:#888;">Phone</td><td style="padding:6px 0;">${order.customerPhone}</td></tr>
          <tr><td style="padding:6px 0;color:#888;">Address</td><td style="padding:6px 0;">${order.customerAddress}, ${order.customerCity}</td></tr>
          <tr><td style="padding:6px 0;color:#888;">Payment</td><td style="padding:6px 0;text-transform:uppercase;font-weight:600;">${order.paymentMethod}</td></tr>
        </table>

        <h3 style="color:#111;font-size:14px;border-top:1px solid #eee;padding-top:16px;">Order Items</h3>
        <table style="width:100%;border-collapse:collapse;font-size:13px;">
          <thead>
            <tr style="background:#f5f5f5;">
              <th style="padding:8px 12px;text-align:left;">Product</th>
              <th style="padding:8px 12px;text-align:center;">Qty</th>
              <th style="padding:8px 12px;text-align:right;">Price</th>
              <th style="padding:8px 12px;text-align:right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>

        <div style="text-align:right;padding:12px 0;border-top:2px solid #111;margin-top:8px;">
          <span style="font-size:16px;font-weight:700;">Total: Rs ${order.total.toLocaleString("en-PK")}</span>
        </div>

        <p style="color:#888;font-size:12px;margin-top:24px;border-top:1px solid #eee;padding-top:16px;">
          This is an automated notification from your Value Cart ecommerce platform.
        </p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Value Cart Orders" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `New Order Placed — #${order.orderId}`,
      html,
    });
    logger.info({ orderId: order.orderId }, "Order email sent to admin");
  } catch (err) {
    logger.error({ err, orderId: order.orderId }, "Failed to send order email — continuing");
  }
}

export async function sendVerificationEmail(email, code) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    logger.warn("Email credentials not configured — skipping verification email");
    return;
  }

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;color:#222;">
      <div style="background:#111;padding:20px 24px;">
        <h1 style="color:#fff;margin:0;font-size:22px;letter-spacing:-0.5px;">Value Cart</h1>
      </div>
      <div style="padding:32px 24px;text-align:center;">
        <h2 style="color:#111;margin-top:0;">Your Verification Code</h2>
        <p style="color:#555;font-size:14px;margin-bottom:24px;">Use the code below to sign in to your account. It expires in <strong>10 minutes</strong>.</p>

        <div style="display:inline-block;background:#f5f5f5;border:2px dashed #ddd;padding:20px 40px;border-radius:8px;margin:8px 0;">
          <span style="font-size:40px;font-weight:900;letter-spacing:12px;font-family:monospace;color:#e63946;">${code}</span>
        </div>

        <p style="color:#888;font-size:13px;margin-top:24px;">If you didn't request this code, you can safely ignore this email.</p>
        <p style="color:#aaa;font-size:11px;margin-top:32px;border-top:1px solid #eee;padding-top:16px;">
          Value Cart — Pakistan's Premium Online Store
        </p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Value Cart" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Verification Code — Value Cart",
      html,
    });
    logger.info({ email }, "Verification email sent");
  } catch (err) {
    logger.error({ err, email }, "Failed to send verification email — continuing");
  }
}