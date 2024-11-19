"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import { insertUserWithConfirmPasswordSchema } from "@/db/schema";
import { signIn } from "@/auth";

export const signUp = async (
  values: z.infer<typeof insertUserWithConfirmPasswordSchema>
) => {
  try {
    const validatedValues =
      insertUserWithConfirmPasswordSchema.safeParse(values);

    if (!validatedValues.success) {
      return { error: "Campos inválidos" };
    }

    const { password, email, name, confirm_password } = validatedValues.data;

    if (!password || !email || !name) {
      return { error: "Campos não definidos" };
    }

    if (password !== confirm_password) {
      return { error: "A senha e a confirmação da senha não coincidem" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser) {
      return { error: "Email já cadastrado" };
    }

    await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        role: "ADMIN",
      })
      .returning();

    await signIn("credentials", { redirect: false, email, password });
    return { success: true, message: "Usuário registrado com sucesso" };
  } catch (error) {
    console.error("Error during user sign-up:", error);
    return { error: "Erro interno no servidor. Tente novamente mais tarde." };
  }
};
