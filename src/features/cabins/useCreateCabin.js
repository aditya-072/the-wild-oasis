import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { createEditCabin } from "../../services/apiCabins";

export function useCreateCabin() {
  const queryClient = useQueryClient(); // need confirmation whether operation is successful or not -> useQueryClient

  const { mutate: createCabin, isLoading: isCreating } = useMutation({
    mutationFn: createEditCabin,
    onSuccess: () => {
      toast.success("New cabin successfully created");
      queryClient.invalidateQueries({ queryKey: ["cabins"] }); // invalidate current cached data so fetch new data next time
    },
    onError: (err) => toast.error(err.message),
  });

  return { isCreating, createCabin };
}
