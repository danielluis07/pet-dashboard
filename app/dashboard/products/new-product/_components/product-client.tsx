"use client";

import { useGetCategories } from "@/queries/categories/use-get-categories";
import { useGetPets } from "@/queries/pets/use-get-pets";
import { CreateProductForm } from "./create-product-form";
import { FormSkeleton } from "@/components/skeletons/form-skeleton";

export const ProductClient = () => {
  const petsQuery = useGetPets();
  const categoriesQuery = useGetCategories();

  if (petsQuery.isLoading || categoriesQuery.isLoading) {
    return <FormSkeleton />;
  }

  if (!petsQuery.data || !categoriesQuery.data) {
    return <div>Error...</div>;
  }
  return (
    <CreateProductForm
      pets={petsQuery.data}
      categories={categoriesQuery.data}
    />
  );
};
