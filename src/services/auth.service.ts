import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db, DBUser } from "./db.service.js";
import { env } from "../config/env.js";
import { AppError } from "../middleware/error.middleware.js";

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  fullName: string;
  state?: string | null;
  district?: string | null;
}

export class AuthService {
  public static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  public static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  public static generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: "7d",
    });
  }

  public static verifyToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    } catch {
      throw new AppError(401, "Invalid or expired authorization token", "UNAUTHORIZED");
    }
  }

  public static async login(email: string, password?: string, roleOverride?: string) {
    let user = await db.findUserByEmail(email);

    if (!user) {
      const role = (roleOverride || "CITIZEN").toUpperCase();
      const hashedPassword = await this.hashPassword(password || "password123");
      user = await db.createUser({
        email: email.toLowerCase().trim(),
        password_hash: hashedPassword,
        full_name: email.split("@")[0].replace(".", " ").toUpperCase(),
        role: ["MINISTRY", "STATE_NODAL", "DISTRICT_AUTHORITY", "MP", "CITIZEN"].includes(role)
          ? role
          : "CITIZEN",
      });
    }

    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      fullName: user.full_name,
      state: user.state,
      district: user.district,
    };

    const token = this.generateToken(tokenPayload);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        state: user.state,
        district: user.district,
        constituency: user.constituency,
      },
    };
  }
}
