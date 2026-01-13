import { AuthService } from "@/services/AuthService";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await AuthService.register(body);
    return NextResponse.json(
      { message: "Registrasi Berhasil", user },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
