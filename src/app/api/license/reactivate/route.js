import { NextResponse } from "next/server";
import License from "@/lib/models/License";
import sequelize from "@/lib/db";
import dotenv from "dotenv";
import { withCORS, handlePreflight } from "@/lib/cors";

dotenv.config();

const apiUrl = process.env.TEST_PKEY_URL;
const token = process.env.TEST_PKEY_TOKEN;

// Handle OPTIONS (preflight)
export async function OPTIONS(req) {
  return handlePreflight(req);
}

// Handle GET (reactivation)
export async function GET(req) {
  const origin = req.headers.get("origin") || "";
  let response;

  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const domain = searchParams.get("domain");

  if (!code || !domain) {
    response = NextResponse.json(
      { success: false, status: 400, message: "Missing code or domain" },
      { status: 400 }
    );
    return withCORS(response, origin);
  }

  try {
    await sequelize.sync();
    const license = await License.findOne({ where: { key: code } });

    if (!license) {
      response = NextResponse.json(
        { success: false, status: 404, message: "License not found" },
        { status: 404 }
      );
    } else if (license.isActive) {
      response = NextResponse.json(
        { success: true, status: 200, message: "License already active" },
        { status: 200 }
      );
    } else {
      // Verify license with Envato
      const verification = await fetch(`${apiUrl}?code=${code}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "User-Agent": "Purchase code verification",
        },
      });

      if (verification.status !== 200) {
        response = NextResponse.json(
          { success: false, status: 403, message: "Invalid purchase code" },
          { status: 403 }
        );
      } else {
        const sale = await verification.json();

        if (license.Usages >= license.maxUsages) {
          response = NextResponse.json(
            {
              success: false,
              status: 403,
              message: "Usage limit reached for this license",
            },
            { status: 403 }
          );
        } else {
          license.Usages += 1;
          license.isActive = true;
          license.activatedAt = new Date();
          license.deactivatedAt = null;
          license.domain = domain;
          await license.save();

          response = NextResponse.json(
            {
              success: true,
              status: 200,
              message: "License reactivated successfully",
            },
            { status: 200 }
          );
        }
      }
    }
  } catch (error) {
    console.error("Reactivation error:", error.message);
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
