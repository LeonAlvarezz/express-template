import { pgTable, uuid, boolean, timestamp, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { auths } from "./auths.schema";

export const sessions = pgTable("sessions", {
  id: text().primaryKey(),
  two_factor_verified: boolean().default(false),
  expires_at: timestamp().notNull(),
  auth_id: uuid()
    .references(() => auths.id, { onDelete: "cascade" })
    .notNull(),
  ip: text(),
  device_type: text(),
});

export const sessionRelations = relations(sessions, ({ one }) => ({
  auth: one(auths, {
    fields: [sessions.auth_id],
    references: [auths.id],
  }),
}));
