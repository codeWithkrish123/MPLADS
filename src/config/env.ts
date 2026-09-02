import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("5000").transform((v) => parseInt(v, 10)),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  ALLOWED_ORIGINS: z.string().default("http://localhost:5173,http://127.0.0.1:5173"),
  UPSTREAM_ML_URL: z.string().default("https://sih-2026-23oy.onrender.com"),
  ML_CONNECT_TIMEOUT_MS: z.string().default("3000").transform((v) => parseInt(v, 10)),
  ML_READ_TIMEOUT_MS: z.string().default("5000").transform((v) => parseInt(v, 10)),
  DATABASE_URL: z.string().default("postgresql://postgres:postgres@localhost:5432/mplads_db?schema=public"),
  JWT_SECRET: z.string().default("mplads_sentinel_super_secret_jwt_key_2026_gov_india_production"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  RATE_LIMIT_WINDOW_MS: z.string().default("60000").transform((v) => parseInt(v, 10)),
  RATE_LIMIT_MAX_REQUESTS: z.string().default("300").transform((v) => parseInt(v, 10)),
});

export const env = envSchema.parse(process.env);
