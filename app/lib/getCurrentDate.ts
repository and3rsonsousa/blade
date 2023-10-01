import { useSearchParams } from "@remix-run/react";
import { parseISO, toDate } from "date-fns";

export function getCurrentDate(request?: Request) {
	const today = toDate(Date.now());
	let date = null

	if (request) {
		const params = new URL(request.url).searchParams
		date = params.get("date")
	} else {
		const [params] = useSearchParams();
		date = params.get("date");
	}

	const currentDate = date ? parseISO(date) : today;
	return currentDate;
}
