import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ResultSetHeader, RowDataPacket } from "mysql2";

interface RegisterInput {
  nama: string;
  email: string;
  password: string;
    role: "PASIEN" | "APOTEKER";
}

interface LoginInput {
  email: string;
  password: string;
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

  static async getAllUsers() {
    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT id, nama, email, role, createdAt FROM User ORDER BY createdAt DESC"
    );
    return rows;
  }

  static async login(data: LoginInput) {
    const { email, password } = data;

    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM User WHERE email = ?",
      [email]
    );

    const user = rows[0];
    if (!user) throw new Error("Email atau password salah");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Email atau password salah");

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    return {
      token,
      user: {
        id: user.id,
        nama: user.nama,
        role: user.role,
      },
    };
  }
}
