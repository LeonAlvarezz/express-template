import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { timestamps } from "../common";

export const book = pgTable("book", {
  id: uuid().defaultRandom().primaryKey(),
  title: text().notNull(),
  author: text().notNull(),
  description: text(),
  published_year: integer(),
  ...timestamps,
});
