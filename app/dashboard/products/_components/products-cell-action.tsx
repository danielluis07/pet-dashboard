"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { Pencil, Trash2 } from "lucide-react";
import { Ellipsis } from "lucide-react";
import { useOpenCategory } from "@/hooks/use-open-category";
import { useDeleteProduct } from "@/queries/products/use-delete-product";
import { useRouter } from "next/navigation";

interface ProductsCellActionProps {
  id: string;
}
export const ProductsCellAction = ({ id }: ProductsCellActionProps) => {
  const deleteMutation = useDeleteProduct(id);
  const router = useRouter();

  const [ConfirmDialog, confirm] = useConfirm(
    "Tem certeza?",
    "Você está prestes a deletar o produto selecionado"
  );

  const onDelete = async () => {
    const ok = await confirm();

    if (ok) {
      deleteMutation.mutate();
    }
  };

  return (
    <>
      <ConfirmDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>
            <Ellipsis className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            disabled={deleteMutation.isPending}
            className="cursor-pointer"
            onClick={() => router.push(`/dashboard/products/${id}`)}>
            <Pencil />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={deleteMutation.isPending}
            className="cursor-pointer"
            onClick={onDelete}>
            <Trash2 className="text-red-500" />
            Deletar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
