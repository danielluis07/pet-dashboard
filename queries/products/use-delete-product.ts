import { InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.products)[":id"]["$delete"]
>;

export const useDeleteProduct = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const res = await client.api.products[":id"]["$delete"]({
        param: { id },
      });
      return await res.json();
    },
    onSuccess: () => {
      toast.success("Produto deletado!");
      queryClient.invalidateQueries({ queryKey: ["product", { id }] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {
      toast.error("Houve um erro ao deletar o produto!");
    },
  });

  return mutation;
};
