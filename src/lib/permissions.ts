import { createAccessControl } from "better-auth/plugins/access";

export const statement = {
  product: ["view", "create", "share", "update", "delete"], // <-- Permissions available for created roles
  user: ["ban"],
} as const;

export const ac = createAccessControl(statement);

export const user = ac.newRole({
  product: ["view"],
});

export const admin = ac.newRole({
  product: ["view", "create", "update"],
});

export const super_admin = ac.newRole({
  product: ["create", "update", "delete"],
  user: ["ban"],
});
