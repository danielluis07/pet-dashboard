import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetPet = (id?: string) => {
  const query = useQuery({
    enabled: !!id, // the query will only be executed if we have the id
    queryKey: ["pet", { id }],
    queryFn: async () => {
      const res = await client.api.pets[":id"].$get({
        param: { id },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch pet");
      }

      const { data } = await res.json();
      return data;
    },
  });
  return query;
};
