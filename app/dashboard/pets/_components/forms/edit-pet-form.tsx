"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormControl, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { insertPetSchema } from "@/db/schema";

type FormValues = z.input<typeof formSchema>;

type PetFormProps = {
  onSubmit: (values: FormValues) => void;
  defaultValues: {
    name: string;
  };
  onDelete: () => void;
  disabled: boolean;
};

const formSchema = insertPetSchema.pick({
  name: true,
});

export const EditPetForm = ({
  onSubmit,
  defaultValues,
  onDelete,
  disabled,
}: PetFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || { name: "" },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="space-y-1">
          <Button type="submit" disabled={disabled} className="w-full">
            Editar
          </Button>
          <Button
            className="w-full"
            type="button"
            variant="destructive"
            disabled={disabled}
            onClick={onDelete}>
            Deletar
          </Button>
        </div>
      </form>
    </Form>
  );
};
