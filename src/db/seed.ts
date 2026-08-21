import { db } from "@/db";
import { user } from "@/db/schema";
import { auth } from "@/lib";
import { USER_ROLE } from "@admin/types";
import { eq } from "drizzle-orm";

const SEED_USERS = [
  {
    name: "Super Admin",
    email: "superadmin@example.com",
    password: "12345678",
    role: USER_ROLE.SUPER_ADMIN,
  },
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "12345678",
    role: USER_ROLE.ADMIN,
  },
  {
    name: "Standard User",
    email: "user@example.com",
    password: "12345678",
    role: USER_ROLE.USER,
  },
];

async function seedDatabase() {
  console.log("🌱 Starting database seed...");

  for (const account of SEED_USERS) {
    const existing = await db
      .select()
      .from(user)
      .where(eq(user.email, account.email));

    if (existing.length === 0) {
      await auth.api.signUpEmail({
        body: {
          name: account.name,
          email: account.email,
          password: account.password,
        },
      });

      await db
        .update(user)
        .set({ role: account.role })
        .where(eq(user.email, account.email));

      console.log(`✅ Created account: ${account.email} (${account.role})`);
    } else {
      await db
        .update(user)
        .set({ role: account.role })
        .where(eq(user.email, account.email));

      console.log(
        `ℹ️ Account already exists, updated role: ${account.email} (${account.role})`,
      );
    }
  }

  console.log("\n🎉 Database seed completed successfully!");
  console.log("-----------------------------------------");
  for (const account of SEED_USERS) {
    console.log(
      `Role: ${account.role.padEnd(12)} | Email: ${account.email.padEnd(25)} | Password: ${account.password}`,
    );
  }
  console.log("-----------------------------------------");
}

seedDatabase()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  });
