import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { timestamps } from "../common";
import { auths } from "./auths.schema";

export const users = pgTable("users", {
  id: uuid().defaultRandom().primaryKey(),
  username: varchar({ length: 255 }).notNull(),
  auth_id: uuid()
    .notNull()
    .references(() => auths.id, { onDelete: "cascade" }),
  ...timestamps,
});

export const userRelation = relations(users, ({ one, many }) => ({
  auth: one(auths, {
    fields: [users.auth_id],
    references: [auths.id],
  }),
}));
