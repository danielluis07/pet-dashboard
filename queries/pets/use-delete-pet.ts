import { InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.pets)[":id"]["$delete"]
>;

export const useDeletePet = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const res = await client.api.pets[":id"]["$delete"]({
        param: { id },
      });
      return await res.json();
    },
    onSuccess: () => {
      toast.success("Pet deletado!");
      queryClient.invalidateQueries({ queryKey: ["pet", { id }] });
      queryClient.invalidateQueries({ queryKey: ["pets"] });
    },
    onError: () => {
      toast.error("Houve um erro ao deletar o pet!");
    },
  });

  return mutation;
};
