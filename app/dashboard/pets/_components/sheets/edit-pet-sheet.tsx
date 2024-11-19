"use client";

import { z } from "zod";
import { insertPetSchema } from "@/db/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { useConfirm } from "@/hooks/use-confirm";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useEditPet } from "@/queries/pets/use-edit-pet";
import { useGetPet } from "@/queries/pets/use-get-pet";
import { useDeletePet } from "@/queries/pets/use-delete-pet";
import { useOpenPet } from "@/hooks/use-open-pet";
import { EditPetForm } from "../forms/edit-pet-form";

const formSchema = insertPetSchema.pick({
  name: true,
});

type FormValues = z.input<typeof formSchema>;

export const EditPetSheet = () => {
  const { isOpen, onClose, id } = useOpenPet();

  const editMutation = useEditPet(id);

  const petQuery = useGetPet(id);

  const deleteMutation = useDeletePet(id);

  const [ConfirmDialog, confirm] = useConfirm(
    "Tem certeza?",
    "Você está prestes a deletar esse pet"
  );

  const onSubmit = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const onDelete = async () => {
    const ok = await confirm();

    if (ok)
      [
        deleteMutation.mutate(undefined, {
          onSuccess: () => {
            onClose();
          },
        }),
      ];
  };

  const defaultValues = petQuery.data
    ? {
        name: petQuery.data.name,
      }
    : {
        name: "",
      };

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent>
          {petQuery.isLoading ? (
            <div className="space-y-3">
              <Skeleton className="w-56 h-5" />
              <Skeleton className="w-60 h-5" />
              <Skeleton className="w-full h-10" />
              <Skeleton className="w-full h-10" />
              <Skeleton className="w-full h-10" />
            </div>
          ) : (
            <div>
              <SheetHeader>
                <SheetTitle>Editar Pet</SheetTitle>
                <SheetDescription>Escolha um novo título</SheetDescription>
              </SheetHeader>
              <div className="mt-3">
                <EditPetForm
                  onSubmit={onSubmit}
                  defaultValues={defaultValues}
                  onDelete={onDelete}
                  disabled={editMutation.isPending || deleteMutation.isPending}
                />
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
