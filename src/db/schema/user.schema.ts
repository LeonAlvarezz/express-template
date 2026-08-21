import { boolean, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { enumToPgEnum } from "../common";
import { USER_ROLE } from "@admin/types";
export const userRoleEnum = pgEnum("USER_ROLE", enumToPgEnum(USER_ROLE));

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  role: userRoleEnum("role").default(USER_ROLE.USER).notNull(),
  banned: boolean("banned"),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
});
