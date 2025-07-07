import License from "@/lib/models/License";
import LicenseUsage from "@/lib/models/LicenseUsage";
import sequelize from "@/lib/db";
import cors from "@/lib/cors";
import { Client } from "envato";
import dotenv from "dotenv";

dotenv.config();

// const client = new Client(process.env.ENVATO_TOKEN);

// export default async function handler(req, res) {
//   await cors(req, res);
//   if (req.method === "OPTIONS") return res.status(200).end();
//   if (req.method !== "GET")
//     return res.status(405).json({ message: "Only GET allowed" });

//   const { code, domain, deviceId } = req.query;
//   if (!code || !domain || !deviceId)
//     return res
//       .status(400)
//       .json({ message: "Missing code, domain, or deviceId" });

//   try {
//     // 1️⃣ Verify with Envato
//     const sale = await client.private.getSale(code);
//     if (!sale || !sale.buyer) {
//       return res.status(403).json({ message: "Invalid purchase code" });
//     }

//     await sequelize.sync();

//     // 2️⃣ Lookup or Create license
//     let license = await License.findOne({ where: { key: code } });

//     if (!license) {
//       license = await License.create({
//         key: code,
//         customer: sale.buyer,
//         email: sale.license,
//         domain,
//         deviceId,
//         isActive: true,
//         activatedAt: new Date(),
//         Usages: 1, // first usage
//       });

//       // Also create first usage record
//       await LicenseUsage.create({
//         licenseId: license.id,
//         domain,
//         deviceId,
//         isActive: true,
//         activatedAt: new Date(),
//       });

//       return res.status(200).json("200");
//     }

//     // 3️⃣ Check max usages
//     if (license.Usages >= license.maxUsages) {
//       return res.status(403).json({
//         message: "Usage limit reached for this license",
//       });
//     }

//     // 4️⃣ Prevent double activation
//     const existingUsage = await LicenseUsage.findOne({
//       where: { licenseId: license.id, deviceId },
//     });

//     if (existingUsage && existingUsage.isActive) {
//       return res
//         .status(409)
//         .json({ message: "License already active on this device" });
//     }

//     // 5️⃣ Create usage record
//     await LicenseUsage.create({
//       licenseId: license.id,
//       domain,
//       deviceId,
//       isActive: true,
//       activatedAt: new Date(),
//     });

//     // 6️⃣ Update license
//     license.Usages += 1;
//     license.isActive = true;
//     license.activatedAt = new Date();
//     await license.save();

//     return res.status(200).json("200");
//   } catch (error) {
//     console.error("Activation error:", error.message);
//     return res
//       .status(500)
//       .json({ message: "Internal error", error: error.message });
//   }
// }

// --------------------------------------------TESTING

const apiUrl = process.env.TEST_PKEY_URL;
const token = process.env.TEST_PKEY_TOKEN;

export default async function handler(req, res) {
  await cors(req, res);

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")
    return res.status(405).json({ message: "Only POST allowed" });

  const { code, domain } = req.query;
  const decodedDomain = decodeURIComponent(domain || "");

  if (!code || !decodedDomain)
    return res
      .status(400)
      .json({ success: false, status: 400, message: "Missing code or domain" });

  try {
    await sequelize.sync();

    // ✅ Step 1: Check if license already exists and is active
    let license = await License.findOne({ where: { key: code } });

    if (license && license.isActive) {
      return res.status(401).json({
        success: false,
        status: 401,
        message:
          "License is already active!  Deactivate it first or Contact support for assistance.",
      });
    }

    // 🔄 Step 2: Verify with Envato only if not already activated
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

    // 🆕 Step 3: Create or update license record
    if (!license) {
      license = await License.create({
        key: code,
        customer: sale.buyer,
        type: sale.license,
        domain: decodedDomain,
        isActive: true,
        activatedAt: new Date(),
        deactivatedAt: null,
        Usages: 1,
      });

      return res.status(200).json({
        success: true,
        status: 200,
        message: "New License Activated Successfully",
      });
    }

    // ✅ Step 4: Check usage limit
    if (license.Usages >= license.maxUsages) {
      return res.status(403).json({
        success: false,
        status: 403,
        message:
          "Usage limit reached! You have exceeded number of activations allowed. Contact theme support",
      });
    }

    license.Usages += 1;
    license.isActive = true;
    license.activatedAt = new Date();
    await license.save();

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Activated successfully",
    });
  } catch (error) {
    console.error("Activation error:", error.message);
    return res
      .status(500)
      .json({ message: "Internal error", error: error.message });
  }
}
