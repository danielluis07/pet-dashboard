"use client";

import { z } from "zod";
import { CreatePetForm } from "../forms/create-pet-form";
import { insertPetSchema } from "@/db/schema";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useNewPet } from "@/hooks/use-new-pet";
import { useCreatePet } from "@/queries/pets/use-create-pet";

const formSchema = insertPetSchema.pick({
  name: true,
});

type FormValues = z.input<typeof formSchema>;

export const NewPetSheet = () => {
  const { isOpen, onClose } = useNewPet();
  const mutation = useCreatePet();

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Adicione um pet</SheetTitle>
          <SheetDescription>Insira o nome do pet</SheetDescription>
        </SheetHeader>
        <div className="mt-3">
          <CreatePetForm onSubmit={onSubmit} disabled={mutation.isPending} />
        </div>
      </SheetContent>
    </Sheet>
  );
};
