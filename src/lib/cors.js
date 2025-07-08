import { NextResponse } from "next/server";

const allowedOrigins = [
  "http://localhost",
  "http://127.0.0.1",
  "http://127.0.0.1:3000",
  "http://localhost:3000",
  "http://localhost/wordpress",
  "http://localhost/wordpress/wp-admin/",
  "https://curift-themes.vercel.app",
];

// Add CORS headers to a response
export function withCORS(res, origin = "") {
  const allowed = allowedOrigins.includes(origin);
  res.headers.set(
    "Access-Control-Allow-Origin",
    allowed ? origin : allowedOrigins[0]
  );
  res.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  return res;
}

// Preflight (OPTIONS) handler
export function handlePreflight(req) {
  const origin = req.headers.get("origin") || "";
  const res = new NextResponse(null, { status: 204 });
  return withCORS(res, origin);
}
