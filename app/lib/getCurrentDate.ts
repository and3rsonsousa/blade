import { useSearchParams } from "@remix-run/react";
import { toDate } from "date-fns-tz";

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

	const currentDate = date ? toDate(date) : today;

	return currentDate

}
