"use client";

import { ProductsDataTable } from "./products-table";
import { columns } from "./products-columns";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useGetProducts } from "@/queries/products/use-get-products";
import { useDeleteProducts } from "@/queries/products/use-delete-products";

export const ProductsClient = () => {
  const productsQuery = useGetProducts();
  const products = productsQuery.data || [];
  const deleteProducts = useDeleteProducts();
  const disabled = deleteProducts.isPending;

  if (productsQuery.isLoading) {
    return (
      <Card className="size-full px-2 pt-2">
        <div className="space-y-3">
          <Skeleton className="w-32 h-5" />
          <Skeleton className="w-[420px] h-12" />
        </div>
        <div className="mt-8 rounded-lg p-3">
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
      <ProductsDataTable
        columns={columns}
        data={products}
        disabled={disabled}
        onDelete={(row) => {
          const ids = row.map((r) => r.original.id);
          deleteProducts.mutate({ ids });
        }}
        searchKey="name"
      />
    </Card>
  );
};
