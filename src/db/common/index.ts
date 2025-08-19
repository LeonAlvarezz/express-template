import { customType, timestamp } from 'drizzle-orm/pg-core';

export const timestamps = {
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp().defaultNow(),
  deleted_at: timestamp(),
};

export const bytea = customType<{
  data: Uint8Array;
  notNull: false;
  default: false;
}>({
  dataType() {
    return 'bytea';
  },
});

export const tsvector = customType<{
  data: string;
}>({
  dataType() {
    return `tsvector`;
  },
});

export const dateOnly = customType<{ data: Date; driverData: string }>({
  dataType() {
    return 'text';
  },
  toDriver(value: Date): string {
    return value.toISOString().split('T')[0]; // 'YYYY-MM-DD'
  },
  fromDriver(value: string): Date {
    return new Date(value);
  },
});

export function enumToPgEnum<T extends Record<string, any>>(
  myEnum: T,
): [T[keyof T], ...T[keyof T][]] {
  return Object.values(myEnum).map((value: any) => `${value}`) as any;
}
