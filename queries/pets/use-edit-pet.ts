import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.pets)[":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.pets)[":id"]["$patch"]
>["json"];

export const useEditPet = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.pets[":id"]["$patch"]({
        param: { id },
        json,
      });
      return await res.json();
    },
    onSuccess: () => {
      toast.success("Pet editado!");
      queryClient.invalidateQueries({ queryKey: ["pet", { id }] });
      queryClient.invalidateQueries({ queryKey: ["pets"] });
    },
    onError: () => {
      toast.error("Houve um erro editar o pet!");
    },
  });

  return mutation;
};
