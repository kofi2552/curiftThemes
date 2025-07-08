import { NextResponse } from "next/server";
import License from "@/lib/models/License";
import sequelize from "@/lib/db";
import { withCORS, handlePreflight } from "@/lib/cors";

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
    const domain = searchParams.get("domain");

    console.log("Deactivate License Request:", { code, domain });

    if (!code) {
      response = NextResponse.json(
        {
          success: false,
          status: 400,
          message: "Missing license key",
        },
        { status: 400 }
      );
      return withCORS(response, origin);
    }

    await sequelize.sync();

    const license = await License.findOne({
      where: { key: code, domain },
    });

    if (!license) {
      response = NextResponse.json(
        {
          success: false,
          status: 401,
          message: "Invalid license key",
        },
        { status: 401 }
      );
    } else if (!license.isActive) {
      response = NextResponse.json(
        {
          success: false,
          status: 403,
          message: "Your licence is inactive. Contact support for assistance.",
        },
        { status: 403 }
      );
    } else {
      await license.update({
        isActive: false,
        activatedAt: null,
        deactivatedAt: new Date(),
      });

      response = NextResponse.json(
        {
          success: true,
          status: 200,
          message: "Deactivated successfully",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Deactivate License Error:", error);
    response = NextResponse.json(
      {
        success: false,
        status: 500,
        message: "Server error",
      },
      { status: 500 }
    );
  }

  return withCORS(response, origin);
}
