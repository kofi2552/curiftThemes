import License from "@/lib/models/License";
import sequelize from "@/lib/db";
import cors from "@/lib/cors";
import dotenv from "dotenv";

dotenv.config();

const apiUrl = process.env.TEST_PKEY_URL;
const token = process.env.TEST_PKEY_TOKEN;

export default async function handler(req, res) {
  await cors(req, res);

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET")
    return res
      .status(405)
      .json({ success: false, status: 405, message: "Only GET allowed" });

  const { code, domain } = req.query;

  if (!code || !domain) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "Missing code or domain",
    });
  }

  try {
    await sequelize.sync();

    let license = await License.findOne({ where: { key: code } });

    if (!license) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "License not found",
      });
    }

    if (license.isActive) {
      return res.status(200).json({
        success: true,
        status: 200,
        message: "License already active",
      });
    }

    // Verify with Envato
    const response = await fetch(`${apiUrl}?code=${code}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": "Purchase code verification",
      },
    });

    if (response.status !== 200) {
      return res.status(403).json({
        success: false,
        status: 403,
        message: "Invalid purchase code",
      });
    }

    const sale = await response.json();

    if (license.Usages >= license.maxUsages) {
      return res.status(403).json({
        success: false,
        status: 403,
        message: "Usage limit reached for this license",
      });
    }

    license.Usages += 1;
    license.isActive = true;
    license.deactivatedAt = null;
    license.activatedAt = new Date();
    license.domain = domain;
    await license.save();

    return res.status(200).json({
      success: true,
      status: 200,
      message: "License reactivated successfully",
    });
  } catch (error) {
    console.error("Reactivation error:", error.message);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Internal error",
      error: error.message,
    });
  }
}
