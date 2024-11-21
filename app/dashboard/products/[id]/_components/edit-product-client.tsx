"use client";

import { useGetCategories } from "@/queries/categories/use-get-categories";
import { useGetPets } from "@/queries/pets/use-get-pets";
import { useGetProduct } from "@/queries/products/use-get-product";
import { EditProductForm } from "./edit-product-form";
import { FormSkeleton } from "@/components/skeletons/form-skeleton";

export const EditProductClient = ({ id }: { id: string }) => {
  const productQuery = useGetProduct(id);
  const petsQuery = useGetPets();
  const categoriesQuery = useGetCategories();

  if (
    petsQuery.isLoading ||
    categoriesQuery.isLoading ||
    productQuery.isLoading
  ) {
    return <FormSkeleton />;
  }

  if (!petsQuery.data || !categoriesQuery.data || !productQuery.data || !id) {
    return <div>Error...</div>;
  }
  return (
    <EditProductForm
      id={id}
      product={productQuery.data}
      pets={petsQuery.data}
      categories={categoriesQuery.data}
    />
  );
};
