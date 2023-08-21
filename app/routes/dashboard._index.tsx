import { type LoaderArgs } from "@remix-run/node";
import {
	eachDayOfInterval,
	endOfMonth,
	endOfWeek,
	startOfMonth,
	startOfWeek,
	toDate,
} from "date-fns";
import supabaseServer from "~/lib/supabase.server";

export async function loader({ request }: LoaderArgs) {
	const response = new Response();
	const supabase = supabaseServer({
		request,
		response,
	});
	const { data } = await supabase
		.from("actions")
		.select("*, category(*), state(*)");

	return { data };
}

export default function DashboardIndex() {
	// const data = useLoaderData();
	const date = toDate(Date.now());
	const start = startOfWeek(startOfMonth(date));
	const end = endOfWeek(endOfMonth(date));
	const days = eachDayOfInterval({ start, end });
	return (
		<div className="grid grid-cols-7 grow">
			{days.map((day, i) => (
				<div key={i} className="">
					<div
						className={`p-2 text-sm ${
							day.getMonth() !== date.getMonth()
								? "opacity-25"
								: ""
						}`}
					>
						{day.getDate()}
					</div>
				</div>
			))}
		</div>
	);
}
