// pages/api/licenses/[id].js
import License from "@/lib/models/License";
import sequelize from "@/lib/db";

export default async function handler(req, res) {
  await sequelize.sync();

  const { key } = req.query;

  if (req.method === "GET") {
    return res.status(200).json({ key });
  }
  if (req.method !== "GET" && req.method !== "PUT" && req.method !== "DELETE") {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  console.log("License API Request:", key);

  try {
    const license = await License.findOne({ where: { key } });

    if (!license) {
      return res.status(404).json({
        success: false,
        message: "License not found",
      });
    }

    switch (method) {
      case "GET":
        return res.status(200).json({
          success: true,
          data: license, // 👈 wrap in "data"
        });

      case "PUT":
        await license.update(body);
        return res.status(200).json({
          success: true,
          message: "License updated",
          data: license,
        });

      case "DELETE":
        await license.destroy();
        return res.status(200).json({
          success: true,
          message: "License deleted",
        });

      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    console.error("License API error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
}
