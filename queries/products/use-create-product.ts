import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.products.$post>;
type RequestType = InferRequestType<typeof client.api.products.$post>["json"];

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.products.$post({ json });
      return await res.json();
    },
    onSuccess: () => {
      toast.success("Produto criado!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {
      toast.error("Houve um erro ao criar o produto!");
    },
  });

  return mutation;
};
