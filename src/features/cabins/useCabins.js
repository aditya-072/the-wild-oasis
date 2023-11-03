import { useQuery } from "@tanstack/react-query";
import { getCabins } from "../../services/apiCabins";

export function useCabins() {
  const {
    isLoading,
    data: cabins, // data returned from the api renamed as cabins
    error,
  } = useQuery({
    queryKey: ["cabins"], // cabins data fetched from api
    queryFn: getCabins,
  });

  return { isLoading, error, cabins }; // returns cabins data, isLoading state and error from the reqct-query
}
