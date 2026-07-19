import { getSessionUser } from "@/lib/auth";
import {
  getSpeciesData,
  getFreightData,
  getDataLastUpdated,
  updateSpeciesData,
  updateFreightData,
} from "@/lib/store";
import type { Species, FreightRoute } from "@/types";
import { NextRequest, NextResponse } from "next/server";

async function requireAdmin() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") return null;
  return user;
}

export async function GET() {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [species, freightRoutes, lastUpdated] = await Promise.all([
    getSpeciesData(),
    getFreightData(),
    getDataLastUpdated(),
  ]);

  return NextResponse.json({ species, freightRoutes, lastUpdated });
}

export async function PUT(request: NextRequest) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const updatedAt = new Date().toISOString().split("T")[0];

  if (body.type === "species" && Array.isArray(body.data)) {
    await updateSpeciesData(body.data as Species[], updatedAt);
    return NextResponse.json({ ok: true, lastUpdated: updatedAt });
  }

  if (body.type === "freight" && Array.isArray(body.data)) {
    await updateFreightData(body.data as FreightRoute[], updatedAt);
    return NextResponse.json({ ok: true, lastUpdated: updatedAt });
  }

  return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
}
