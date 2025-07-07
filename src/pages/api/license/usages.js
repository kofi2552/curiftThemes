import LicenseUsage from "@/lib/models/LicenseUsage";
import sequelize from "@/lib/db";
import cors from "@/lib/cors";

export default async function handler(req, res) {
  // Enable CORS
  await cors(req, res);

  // Optionally handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  await sequelize.sync();
  const licenses = await LicenseUsage.findAll({
    order: [["createdAt", "DESC"]],
  });
  return res.status(200).json(licenses);
}
