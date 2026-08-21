import { db } from "@/db";
import { product } from "@/db/schema";
import type { CreateProduct, UpdateProduct } from "@admin/types";
import { asc, count, desc, eq, ilike, or } from "drizzle-orm";

export interface FindAllProductsParams {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: "name" | "price" | "createdAt" | "stock";
  sortOrder?: "asc" | "desc";
}

export class ProductRepository {
  /**
   * Find all products with optional search filter and pagination
   */
  async findAll(params: FindAllProductsParams = {}) {
    const {
      search,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = params;

    const offset = (page - 1) * limit;

    const filter = search
      ? or(
          ilike(product.name, `%${search}%`),
          ilike(product.slug, `%${search}%`),
          ilike(product.description, `%${search}%`),
        )
      : undefined;

    const sortColumn = product[sortBy] ?? product.createdAt;
    const orderFn = sortOrder === "asc" ? asc : desc;

    const items = await db
      .select()
      .from(product)
      .where(filter)
      .orderBy(orderFn(sortColumn))
      .limit(limit)
      .offset(offset);

    const [{ total }] = await db
      .select({ total: count() })
      .from(product)
      .where(filter);

    return {
      items,
      total: Number(total),
      page,
      limit,
      totalPages: Math.ceil(Number(total) / limit),
    };
  }

  /**
   * Find a single product by ID
   */
  async findById(id: number) {
    const [item] = await db.select().from(product).where(eq(product.id, id));
    return item ?? null;
  }

  /**
   * Find a single product by Slug
   */
  async findBySlug(slug: string) {
    const [item] = await db.select().from(product).where(eq(product.slug, slug));
    return item ?? null;
  }

  /**
   * Create a new product
   */
  async create(data: CreateProduct) {
    const [newItem] = await db
      .insert(product)
      .values({
        name: data.name,
        slug: data.slug,
        description: data.description ?? null,
        price: String(data.price),
        stock: data.stock ?? 0,
        image: data.image ?? null,
      })
      .returning();

    return newItem;
  }

  /**
   * Update an existing product by ID
   */
  async update(id: number, data: UpdateProduct) {
    const updateData: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (data.name !== undefined) updateData.name = data.name;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = String(data.price);
    if (data.stock !== undefined) updateData.stock = data.stock;
    if (data.image !== undefined) updateData.image = data.image;

    const [updatedItem] = await db
      .update(product)
      .set(updateData)
      .where(eq(product.id, id))
      .returning();

    return updatedItem ?? null;
  }

  /**
   * Delete a product by ID
   */
  async delete(id: number) {
    const [deletedItem] = await db
      .delete(product)
      .where(eq(product.id, id))
      .returning();

    return deletedItem ?? null;
  }
}