import { countNewsToday, getNewsFeed } from "@/lib/news";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const items = await getNewsFeed();
    return NextResponse.json({
      items,
      countToday: countNewsToday(items),
      live: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch news", detail: String(error) },
      { status: 502 }
    );
  }
}
