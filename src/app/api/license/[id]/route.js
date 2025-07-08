// src/app/api/licenses/[key]/route.js

import License from "@/lib/models/License";
import sequelize from "@/lib/db";
import { NextResponse } from "next/server";

// Handle GET
export async function GET(req, { params }) {
  await sequelize.sync();
  const { id } = await params;

  try {
    const license = await License.findOne({ where: { key: id } });

    if (!license) {
      return NextResponse.json(
        { success: false, message: "License not found" },
        { status: 404 }
      );
    }

    // console.log("Fetched License:", license);

    return NextResponse.json({ success: true, data: license });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}

// Handle PUT
export async function PUT(req, { params }) {
  await sequelize.sync();
  const { id } = await params;
  const body = await req.json();

  console.log("update License:", id, body);

  try {
    const license = await License.findOne({ where: { key: id } });

    if (!license) {
      return NextResponse.json(
        { success: false, message: "License not found" },
        { status: 404 }
      );
    }

    await license.update(body);

    return NextResponse.json({
      success: true,
      message: "License updated",
      data: license,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}

// Handle DELETE
export async function DELETE(req, { params }) {
  await sequelize.sync();
  const { id } = await params;

  try {
    const license = await License.findOne({ where: { key: id } });

    if (!license) {
      return NextResponse.json(
        { success: false, message: "License not found" },
        { status: 404 }
      );
    }

    await license.destroy();

    return NextResponse.json({
      success: true,
      message: "License deleted",
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}
