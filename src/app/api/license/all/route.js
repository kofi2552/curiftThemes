import { NextResponse } from "next/server";
import License from "@/lib/models/License";
import sequelize from "@/lib/db";

export async function GET() {
  try {
    await sequelize.sync();

    const licenses = await License.findAll({
      order: [["createdAt", "DESC"]],
    });

    return NextResponse.json(licenses, { status: 200 });
  } catch (err) {
    console.error("Error fetching licenses:", err.message);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch licenses",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
