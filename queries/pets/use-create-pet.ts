import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.pets.$post>;
type RequestType = InferRequestType<typeof client.api.pets.$post>["json"];

export const useCreatePet = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.pets.$post({ json });
      return await res.json();
    },
    onSuccess: () => {
      toast.success("Pet criado!");
      queryClient.invalidateQueries({ queryKey: ["pets"] });
    },
    onError: () => {
      toast.error("Houve um erro ao criar o pet!");
    },
  });

  return mutation;
};
