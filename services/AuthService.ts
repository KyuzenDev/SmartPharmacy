// src/services/AuthService.ts
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { ResultSetHeader, RowDataPacket } from "mysql2";

interface RegisterInput {
  nama: string;
  email: string;
  password: string;
    role: "PASIEN" | "APOTEKER";
}

export class AuthService {
  static async register(data: RegisterInput) {
    const { nama, email, password, role } = data;

    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT id FROM User WHERE email = ?",
      [email]
    );

    if (rows.length > 0) {
      throw new Error("Email sudah terdaftar");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.execute<ResultSetHeader>(
      "INSERT INTO User (nama, email, password, role) VALUES (?, ?, ?, ?)",
      [nama, email, hashedPassword, role]
    );

    return {
      id: result.insertId,
      nama,
      email,
      role,
    };
  }
}
