import { Router } from "express";
import { Admin } from "../models/Admin.js";
import { User } from "../models/User.js";
import { VerificationCode } from "../models/VerificationCode.js";
import { LoginAdminBody, SendVerificationCodeBody, VerifyCodeBody } from "../src/api.js";
import crypto from "crypto";
import { sendVerificationEmail } from "../libs/email.js";

const router = Router();

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

router.post("/login", async (req, res) => {
  try {
    const body = LoginAdminBody.parse(req.body);
    const admin = await Admin.findOne({ email: body.email });
    if (!admin || admin.passwordHash !== hashPassword(body.password)) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const token = Buffer.from(`${admin._id}:${admin.email}:${Date.now()}`).toString("base64");
    res.json({ token, admin: { id: admin._id.toString(), email: admin.email } });
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Invalid input" });
  }
});

router.post("/send-code", async (req, res) => {
  try {
    const body = SendVerificationCodeBody.parse(req.body);
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await VerificationCode.create({
      email: body.email,
      code,
      expiresAt,
      used: false,
    });

    req.log.info({ email: body.email, code }, "Verification code generated");

    sendVerificationEmail(body.email, code).catch(() => {});

    res.json({
      message: `Verification code sent to ${body.email}`,
      devCode: process.env.NODE_ENV === "development" ? code : null,
    });
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Failed to send code" });
  }
});

router.post("/verify-code", async (req, res) => {
  try {
    const body = VerifyCodeBody.parse(req.body);

    const record = await VerificationCode.findOne({
      email: body.email,
      code: body.code,
      used: false,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (!record) {
      res.status(401).json({ error: "Invalid or expired code" });
      return;
    }

    await VerificationCode.findByIdAndUpdate(record._id, { used: true });

    let user = await User.findOne({ email: body.email });
    if (!user) {
      user = await User.create({ email: body.email, name: "", isAdmin: false });
    }

    const token = Buffer.from(`user:${user._id}:${user.email}:${user.isAdmin}:${Date.now()}`).toString("base64");

    res.json({
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt.toISOString(),
      },
    });
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Invalid input" });
  }
});

export default router;