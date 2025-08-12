import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE_NAME = "favorites"; // JSON array of ids

async function getIdsFromCookie(): Promise<string[]> {
  const store = await cookies();
  const c = store.get(COOKIE_NAME)?.value;
  if (!c) return [];
  try {
    const parsed = JSON.parse(c);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export async function GET() {
  const ids = await getIdsFromCookie();
  const res = NextResponse.json({ ids });
  return res;
}

export async function PUT(req: Request) {
  const body = await req.json().catch(() => ({}));
  const ids = Array.isArray(body?.ids) ? body.ids.map(String) : [];
  const res = NextResponse.json({ ids });
  res.cookies.set(COOKIE_NAME, JSON.stringify(ids), {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return res;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const id = body?.id ? String(body.id) : undefined;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const currentSet = new Set(await getIdsFromCookie());
  currentSet.add(id);
  const ids = Array.from(currentSet);
  const res = NextResponse.json({ ids });
  res.cookies.set(COOKIE_NAME, JSON.stringify(ids), {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return res;
}

export async function DELETE(req: Request) {
  const body = await req.json().catch(() => ({}));
  const id = body?.id ? String(body.id) : undefined;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const currentSet = new Set(await getIdsFromCookie());
  currentSet.delete(id);
  const ids = Array.from(currentSet);
  const res = NextResponse.json({ ids });
  res.cookies.set(COOKIE_NAME, JSON.stringify(ids), {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return res;
}
