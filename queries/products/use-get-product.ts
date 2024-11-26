import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetProduct = (id?: string) => {
  const query = useQuery({
    enabled: !!id, // the query will only be executed if we have the id
    queryKey: ["product", { id }],
    queryFn: async () => {
      const res = await client.api.products["only-product"][":id"].$get({
        param: { id },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch product");
      }

      const { data } = await res.json();
      return data;
    },
  });
  return query;
};
