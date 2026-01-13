import { AuthService } from "@/services/AuthService";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await AuthService.login(body);

    return NextResponse.json(result, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Login gagal";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}