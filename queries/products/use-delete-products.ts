import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.products)["delete-products"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.products)["delete-products"]["$post"]
>["json"];

export const useDeleteProducts = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.products["delete-products"]["$post"]({
        json,
      });
      return await res.json();
    },
    onSuccess: () => {
      toast.success("Produtos deletados!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {
      toast.error("Houve um erro ao deletar os produtos!");
    },
  });

  return mutation;
};
