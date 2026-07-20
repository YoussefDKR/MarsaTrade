import { getSessionUser } from "@/lib/auth";
import { updateUserProfile } from "@/lib/store";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, company, email } = body;

  const result = await updateUserProfile(user.id, { name, company, email });
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    user: {
      id: result.id,
      email: result.email,
      name: result.name,
      company: result.company,
    },
  });
}
