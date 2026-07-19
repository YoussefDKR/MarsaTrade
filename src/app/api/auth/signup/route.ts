import { NextRequest, NextResponse } from "next/server";
import { signup } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { email, password, name, company } = await request.json();
  if (!email || !password || !name || !company) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }
  const result = await signup({ email, password, name, company });
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ user: result.user });
}
