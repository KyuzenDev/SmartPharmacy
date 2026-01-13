import { AuthService } from "@/services/AuthService";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await AuthService.getAllUsers();
    return NextResponse.json(users, { status: 200 });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
