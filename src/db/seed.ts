import { authUtil } from "@/utils";
import { db } from ".";
import { users, auths } from "./schema";
type SeedOptions = {
  user?: boolean;
  settings?: boolean;
};
function parseArgs(): SeedOptions {
  const args = process.argv.slice(2);
  const options: SeedOptions = {};

  if (args.includes("--users")) {
    options.user = true;
    options.settings = false;
  } else if (args.includes("--settings")) {
    options.user = false;
    options.settings = true;
  } else {
    options.user = true;
    options.settings = true;
  }

  return options;
}
async function seedDatabase(options: SeedOptions) {
  await db.transaction(async (tx) => {
    if (options.user) {
      const userPassword = await authUtil.hashPassword("12345678");
      const [userAuth] = await tx
        .insert(auths)
        .values({
          email: "user@test.com",
          password: userPassword,
        })
        .returning();
      if (!userAuth) return console.log("Failed to create User");
      const [user] = await tx
        .insert(users)
        .values({
          auth_id: userAuth.id,
          username: "user",
        })
        .returning();
      if (!users) return console.log("Failed to create Admin");
      console.log("✅ Admin user created successfully:", {
        email: userAuth.email,
        username: user.username,
      });
    }
  });
  process.exit(0);
}

async function main() {
  const options = parseArgs();
  await seedDatabase(options);
  process.exit(0);
}
main().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
