import { useSearchParams } from "@remix-run/react";
import { toDate } from "date-fns";

export function useCurrentDate() {
	const today = toDate(Date.now());
	const [params] = useSearchParams();
	const date = params.get("date");

	console.log(date);

	const currentDate = date ? new Date(date) : today;
	return currentDate;
}
