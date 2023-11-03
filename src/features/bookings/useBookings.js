import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBookings } from "../../services/apiBookings";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../../utils/constants";

export function useBookings() {
  const queryClient = useQueryClient(); // used for prefetching, query client from reqct-query
  const [searchParams] = useSearchParams(); // gives the search params from the url

  // FILTER
  const filterValue = searchParams.get("status"); // if there is not filter value then it will fetch all data
  const filter =
    !filterValue || filterValue === "all"
      ? null
      : { field: "status", value: filterValue };
  // { field: "totalPrice", value: 5000, method: "gte" };

  // SORT
  const sortByRaw = searchParams.get("sortBy") || "startDate-desc";
  const [field, direction] = sortByRaw.split("-");
  const sortBy = { field, direction };

  // PAGINATION
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page")); // if there is not any page params in url then it will fetch for page 1 otherwise for that page

  // QUERY
  const {
    isLoading,
    data: { data: bookings, count } = {}, // data returned by api, destructured {data, count} here only, initially empty object that will get updated after fetch
    error,
  } = useQuery({
    queryKey: ["bookings", filter, sortBy, page], // kind of dependency array, if any of dependency changes then the reqct-query will fetch data again from api
    queryFn: () => getBookings({ filter, sortBy, page }), // async query function to fetch data from api
  });

  // PRE-FETCHING
  const pageCount = Math.ceil(count / PAGE_SIZE); // count of pages based on data size and data in one page

  if (page < pageCount) // if page is less than pageCount then prefetch the next page data
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sortBy, page + 1],
      queryFn: () => getBookings({ filter, sortBy, page: page + 1 }),
    });

  if (page > 1) // if page is not the first page then prefetch previous page also
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sortBy, page - 1],
      queryFn: () => getBookings({ filter, sortBy, page: page - 1 }),
    });

  return { isLoading, error, bookings, count }; // returns the isLoading state, error and bookings data from the reqct-query
}
