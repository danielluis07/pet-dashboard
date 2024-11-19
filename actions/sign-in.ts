"use server";

import { z } from "zod";
import { AuthError } from "next-auth";
import { db } from "@/db/drizzle";
import { users, loginUserSchema } from "@/db/schema";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { eq } from "drizzle-orm";

export const signin = async (values: z.infer<typeof loginUserSchema>) => {
  try {
    const validatedValues = loginUserSchema.safeParse(values);

    if (!validatedValues.success) {
      console.error("Validation Error: ", validatedValues.error);
      return { error: validatedValues.error };
    }

    const { email, password } = validatedValues.data;

    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (!existingUser || !existingUser.email || !existingUser.password) {
      return { success: false, message: "Email não cadastrado!" };
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return { success: false, message: "Senha incorreta!" };
    }

    await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    return { success: true };
  } catch (e) {
    console.error("SignIn Error: ", e);
    if (e instanceof AuthError) {
      switch (e.type) {
        case "CredentialsSignin":
          return { message: "Credenciais inválidas!" };
        default:
          return { message: "Algo deu errado!" };
      }
    }
    return { message: "Erro desconhecido!" };
  }
};
