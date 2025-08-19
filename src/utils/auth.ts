import { sha256 } from "@oslojs/crypto/sha2";
import bcrypt from "bcrypt";
import crypto from "crypto";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { env } from "@/config";
export default {
  decodeToSessionId(token: string) {
    return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  },

  generateSessionToken(): string {
    const bytes = new Uint8Array(20);
    crypto.getRandomValues(bytes);
    const token = encodeBase32LowerCaseNoPadding(bytes);
    return token;
  },

  async hashPassword(password: string) {
    const saltRounds = env.PASSWORD_SALT;
    return await bcrypt.hash(password, Number(saltRounds));
  },

  async verifyPassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  },
};
