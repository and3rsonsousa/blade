import { useSearchParams } from "@remix-run/react";
import { parseISO, toDate } from "date-fns";

export function useCurrentDate() {
	const today = toDate(Date.now());


	const [params] = useSearchParams();
	console.log({ today, params });
	const date = params.get("date");



	const currentDate = date ? parseISO(date) : today;
	return currentDate;
}
