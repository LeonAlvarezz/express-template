import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { bytea, timestamps } from "../common";
import { relations } from "drizzle-orm";
import { users, sessions } from ".";

export const auths = pgTable("auths", {
  id: uuid().defaultRandom().notNull().primaryKey(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  totp_key: bytea(),
  last_login: timestamp(),
  ...timestamps,
});

export const authsRelations = relations(auths, ({ one, many }) => ({
  users: one(users, {
    fields: [auths.id],
    references: [users.auth_id],
  }),
  sessions: many(sessions),
}));
