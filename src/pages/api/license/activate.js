import License from "@/lib/models/License";
import sequelize from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { key, domain } = req.body;
  if (!key || !domain) {
    return res.status(400).json({ message: "Missing key or domain" });
  }

  try {
    await sequelize.sync();

    const license = await License.findOne({ where: { key } });

    if (!license) {
      return res.status(404).json({ message: "License not found" });
    }

    if (license.isActive) {
      return res.status(400).json({ message: "License already active" });
    }

    await license.update({
      isActive: true,
      domain,
      activatedAt: new Date(),
    });

    return res.status(200).json({ message: "License activated" });
  } catch (error) {
    console.error("Activate License Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
