import License from "@/lib/models/License";
import sequelize from "@/lib/db";
import cors from "@/lib/cors";

export default async function handler(req, res) {
  await cors(req, res); // ✅ Apply CORS headers

  if (req.method === "OPTIONS") {
    return res.status(200).end(); // ✅ Respond to preflight
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  const { code, domain } = req.query;

  console.log("Deactivate License Request:", { code, domain });

  if (!code)
    return res.status(400).json({
      success: false,
      status: 400,
      message: "Missing license key",
    });

  try {
    await sequelize.sync();

    const license = await License.findOne({
      where: {
        key: code,
        domain,
      },
    });

    if (!license) {
      return res.status(401).json({
        success: false,
        status: 401,
        message: "Invalid license key",
      });
    }
    if (!license.isActive) {
      return res.status(403).json({
        success: false,
        status: 403,
        message: "Your licence is inactive. Contact support for assistance.",
      });
    }

    await license.update({
      isActive: false,
      domain: license.domain,
      activatedAt: null,
      deactivatedAt: new Date(),
    });

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Deactivated successfully",
    });
  } catch (error) {
    console.error("Deactivate License Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
