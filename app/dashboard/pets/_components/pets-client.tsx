"use client";

import { PetsDataTable } from "./pets-table";
import { columns } from "./pets-columns";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useGetPets } from "@/queries/pets/use-get-pets";
import { useDeletePets } from "@/queries/pets/use-delete-pets";

export const PetsClient = () => {
  const petsQuery = useGetPets();
  const pets = petsQuery.data || [];
  const deletePets = useDeletePets();
  const disabled = deletePets.isPending;

  if (petsQuery.isLoading) {
    return (
      <Card className="size-full px-2 pt-2">
        <div className="space-y-3">
          <Skeleton className="w-32 h-5" />
          <Skeleton className="w-[420px] h-12" />
        </div>
        <div className="mt-8 border border-gray-300 rounded-lg p-3">
          <div className="flex border-b pb-2">
            <Skeleton className="size-5 rounded-md" />
            <Skeleton className="w-24 h-5 ml-32" />
          </div>
          <div className="mt-8 space-y-5">
            <div className="flex border-b pb-4">
              <Skeleton className="size-5 rounded-md" />
              <Skeleton className="w-32 h-5 ml-32" />
            </div>
            <div className="flex border-b pb-4">
              <Skeleton className="size-5 rounded-md" />
              <Skeleton className="w-32 h-5 ml-32" />
            </div>
            <div className="flex border-b pb-4">
              <Skeleton className="size-5 rounded-md" />
              <Skeleton className="w-32 h-5 ml-32" />
            </div>
            <div className="flex border-b pb-4">
              <Skeleton className="size-5 rounded-md" />
              <Skeleton className="w-32 h-5 ml-32" />
            </div>
            <div className="flex border-b pb-4">
              <Skeleton className="size-5 rounded-md" />
              <Skeleton className="w-32 h-5 ml-32" />
            </div>
            <div className="flex pb-2">
              <Skeleton className="size-5 rounded-md" />
              <Skeleton className="w-32 h-5 ml-32" />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="size-full px-2 pt-2">
      <h1 className="text-xl font-bold">Categorias</h1>
      <PetsDataTable
        columns={columns}
        data={pets}
        disabled={disabled}
        onDelete={(row) => {
          const ids = row.map((r) => r.original.id);
          deletePets.mutate({ ids });
        }}
        searchKey="name"
      />
    </Card>
  );
};
