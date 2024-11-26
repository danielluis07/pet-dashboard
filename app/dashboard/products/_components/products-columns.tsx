import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { ProductsCellAction } from "./products-cell-action";

export type ResponseType = InferResponseType<
  typeof client.api.products.$get,
  200
>["data"][0];

const formatCurrency = (value: string | number) => {
  const numericValue =
    typeof value === "string" ? parseFloat(value.replace(/\D/g, "")) : value;

  const formattedValue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericValue / 100);

  return formattedValue;
};

export const columns: ColumnDef<ResponseType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorFn: (row) => row.product.name, // Custom accessor for nested data
    id: "name", // Use an explicit `id` for column reference
    header: "Nome",
  },
  {
    accessorFn: (row) => row.product.price, // Custom accessor
    id: "price", // Explicit ID for referencing
    header: "Preço",
    cell: ({ row }) => formatCurrency(row.original.product.price.toString()),
  },
  {
    id: "actions",
    cell: ({ row }) => <ProductsCellAction id={row.original.product.id} />,
  },
];
