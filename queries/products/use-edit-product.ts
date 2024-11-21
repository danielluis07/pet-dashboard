import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.products)[":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.products)[":id"]["$patch"]
>["json"];

export const useEditProduct = (id: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.products[":id"]["$patch"]({
        param: { id },
        json,
      });
      return await res.json();
    },
    onSuccess: () => {
      toast.success("Produto editado!");
      queryClient.invalidateQueries({ queryKey: ["product", { id }] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {
      toast.error("Houve um erro editar o produto!");
    },
  });

  return mutation;
};
