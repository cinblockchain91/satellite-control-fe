import { z } from "zod";

export const AccountSchema = z
  .object({
    id: z.string().uuid(),
    username: z.string().min(3).max(50),
    email: z.string().email(),
    role: z.enum(["admin", "viewer", "engineer"]),
    fullName: z.string().min(1),
    avatarUrl: z.string().url().optional(),
    lastLoginAt: z.string().datetime(),
    createdAt: z.string().datetime(),
  })
  .transform((data) => ({ ...data }));

export type AccountDTO = z.infer<typeof AccountSchema>;
