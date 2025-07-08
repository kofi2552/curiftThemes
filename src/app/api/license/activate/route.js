import { NextResponse } from "next/server";
import License from "@/lib/models/License";
import sequelize from "@/lib/db";
import dayjs from "dayjs";
import { withCORS, handlePreflight } from "@/lib/cors";

const apiUrl = process.env.ENVATO_API_URL || process.env.TEST_PKEY_URL;
const token =
  process.env.LIVE_PERSONAL_AUTH_TOKEN || process.env.TEST_PKEY_TOKEN;

// Handle preflight
export async function OPTIONS(req) {
  return handlePreflight(req);
}

export async function POST(req) {
  const origin = req.headers.get("origin") || "";
  let response;

  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const domain = decodeURIComponent(searchParams.get("domain") || "");

    if (!code || !domain) {
      response = NextResponse.json(
        { success: false, status: 400, message: "Missing code or domain" },
        { status: 400 }
      );
      return withCORS(response, origin);
    }

    await sequelize.sync();

    // Step 1: Check if license exists and is active
    let license = await License.findOne({ where: { key: code } });

    if (license && license.isActive) {
      response = NextResponse.json(
        {
          success: false,
          status: 401,
          message:
            "License is already active! Deactivate it first or contact support.",
        },
        { status: 401 }
      );
      return withCORS(response, origin);
    }

    // Step 2: Verify with Envato
    const envatoRes = await fetch(`${apiUrl}?code=${code}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": "Purchase code verification",
      },
    });

    if (envatoRes.status !== 200) {
      response = NextResponse.json(
        {
          success: false,
          status: 403,
          message: "Invalid purchase code",
        },
        { status: 403 }
      );
      return withCORS(response, origin);
    }

    const sale = await envatoRes.json();
    const formattedSupport = dayjs(sale.supportUntil).format(
      "DD MMMM YYYY, hh:mm A"
    );
    const formattedSold = dayjs(sale.sold_at).format("DD MMMM YYYY, hh:mm A");

    // Step 3: Create or update license
    if (!license) {
      await License.create({
        key: code,
        customer: sale.buyer,
        type: sale.license,
        itemID: sale.item.id,
        itemName: sale.item.name,
        domain,
        support: formattedSupport,
        soldAt: formattedSold,
        price: sale.amount,
        isActive: true,
        activatedAt: new Date(),
        deactivatedAt: null,
        Usages: 1,
      });

      response = NextResponse.json(
        {
          success: true,
          status: 200,
          message: "New License Activated Successfully",
        },
        { status: 200 }
      );
      return withCORS(response, origin);
    }

    // Step 4: Usage limit check
    if (license.Usages >= license.maxUsages) {
      response = NextResponse.json(
        {
          success: false,
          status: 403,
          message:
            "Usage limit reached! You have exceeded allowed activations. Contact support.",
        },
        { status: 403 }
      );
      return withCORS(response, origin);
    }

    // Step 5: Update license
    license.Usages += 1;
    license.isActive = true;
    license.activatedAt = new Date();
    await license.save();

    response = NextResponse.json(
      {
        success: true,
        status: 200,
        message: "Activated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Activation error:", error.message);
    response = NextResponse.json(
      {
        success: false,
        status: 500,
        message: "Internal error",
        error: error.message,
      },
      { status: 500 }
    );
  }

  return withCORS(response, origin);
}
