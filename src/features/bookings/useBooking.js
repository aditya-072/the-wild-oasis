import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getBooking } from "../../services/apiBookings";

export function useBooking() {
  const { bookingId } = useParams();

  // isLoading, data and error will get returned by useQuery
  const {
    isLoading,
    data: booking, // data returned by api renamed as booking
    error,
  } = useQuery({
    queryKey: ["booking", bookingId], // data will get stored in booking (kind of variable)
    queryFn: () => getBooking(bookingId), // async function that will fetch data from the api
    retry: false, // if false it will not retry on fail, otherwise it will try to fetch 3 times
  });

  return { isLoading, error, booking }; // return the isLoading state, error and booking data from react-query
}
