import { db } from "@/db";
import { book } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { CreateBookDto } from "./dto/create-book.dto";
import type { UpdateBookDto } from "./dto/update-book.dto";

export class BookRepository {
  async findAll() {
    return await db.query.book.findMany();
  }
  async findById(id: string) {
    return await db.query.book.findFirst({
      where: eq(book.id, id),
    });
  }
  //   paginate() {}
  async create(payload: CreateBookDto) {
    const [result] = await db.insert(book).values(payload).returning();
    return result;
  }
  async update(id: string, payload: UpdateBookDto) {
    return await db.update(book).set(payload).where(eq(book.id, id));
  }
  async delete(id: string) {
    return await db.delete(book).where(eq(book.id, id));
  }
}
