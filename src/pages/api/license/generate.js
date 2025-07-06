import { nanoid } from "nanoid";
import License from "@/lib/models/License";
import sequelize from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    await sequelize.sync();

    const { customer, email } = req.body;
    const key = `ct-${nanoid(20).toUpperCase()}`;

    const license = await License.create({
      key,
      customer: customer || null,
      email: email || null,
    });

    return res.status(200).json({ key: license.key });
  } catch (error) {
    console.error("Generate License Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
