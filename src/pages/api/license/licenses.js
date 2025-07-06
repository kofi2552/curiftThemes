import License from "@/lib/models/License";
import sequelize from "@/lib/db";
import cors from "@/lib/cors";

export default async function handler(req, res) {
  // Enable CORS
  await cors(req, res);

  // Optionally handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Sync DB and return licenses
  await sequelize.sync();
  const licenses = await License.findAll({ order: [["createdAt", "DESC"]] });
  res.status(200).json(licenses);
}

export const config = {
  api: {
    bodyParser: true,
    externalResolver: true,
  },
};
