import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetPets = () => {
  const query = useQuery({
    queryKey: ["pets"],
    queryFn: async () => {
      const res = await client.api.pets.$get();

      if (!res.ok) {
        throw new Error("Failed to fetch pets");
      }

      const { data } = await res.json();
      return data;
    },
  });
  return query;
};
