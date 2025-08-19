import type { BaseModel } from "@/common/model/base.model";

export type AuthModel = BaseModel & {
  email: string;
  password: string;
  totp_key?: string;
  last_login?: Date;
};
