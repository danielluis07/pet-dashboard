"use client";

import { z } from "zod";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { insertUserWithConfirmPasswordSchema } from "@/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signUp } from "@/actions/sign-up";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

type FormData = z.infer<typeof insertUserWithConfirmPasswordSchema>;

export const SignUpForm = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(insertUserWithConfirmPasswordSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      confirm_password: "",
    },
  });

  const onSubmit = (values: FormData) => {
    startTransition(() => {
      signUp(values).then((response) => {
        if (response.error) {
          toast.error(response.error);
        } else {
          toast.success(response.message);
          router.push("/dashboard");
        }
      });
    });
  };

  const onInvalid = (errors: any) => {
    console.log(errors);
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="text-center">Crie sua Conta</CardTitle>
        <CardDescription className="text-center">
          Insira seus dados abaixo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onInvalid)}
            className="space-y-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Seu nome"
                      {...field}
                      disabled={isPending}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Seu e-mail"
                      type="email"
                      disabled={isPending}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="*****"
                      type="password"
                      disabled={isPending}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirme sua senha</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="*****"
                      type="password"
                      disabled={isPending}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              Cadastrar
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
