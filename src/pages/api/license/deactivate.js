import License from "@/lib/models/License";
import sequelize from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { key } = req.body;
  if (!key) return res.status(400).json({ message: "Missing license key" });

  try {
    await sequelize.sync();

    const license = await License.findOne({ where: { key } });

    if (!license || !license.isActive) {
      return res.status(400).json({ message: "Invalid or inactive license" });
    }

    await license.update({
      isActive: false,
      domain: null,
      activatedAt: null,
    });

    return res.status(200).json({ message: "License deactivated" });
  } catch (error) {
    console.error("Deactivate License Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
