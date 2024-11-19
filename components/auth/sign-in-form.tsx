"use client";

import { z } from "zod";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { loginUserSchema } from "@/db/schema";
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
import { signin } from "@/actions/sign-in";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

type FormData = z.infer<typeof loginUserSchema>;

export const SignInForm = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: FormData) => {
    startTransition(() => {
      signin(values).then((response) => {
        if (!response?.success) {
          toast.error(response?.message);
        }
        if (response?.success) {
          toast.success("Logado com sucesso!");
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
        <CardTitle className="text-center">Entre sua Conta</CardTitle>
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

            <Button type="submit" className="w-full" disabled={isPending}>
              Cadastrar
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
