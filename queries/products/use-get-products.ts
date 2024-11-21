import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetProducts = () => {
  const query = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await client.api.products.$get();

      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      const { data } = await res.json();
      return data;
    },
  });
  return query;
};
