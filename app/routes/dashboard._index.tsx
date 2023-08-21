import { type LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
	eachDayOfInterval,
	endOfMonth,
	endOfWeek,
	format,
	startOfMonth,
	startOfWeek,
	toDate,
} from "date-fns";
import type { CalendarType } from "models";
import { ScrollArea } from "~/components/ui/scroll-area";
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
	const { data } = useLoaderData<typeof loader>();
	const date = toDate(Date.now());
	const start = startOfWeek(startOfMonth(date));
	const end = endOfWeek(endOfMonth(date));
	const days = eachDayOfInterval({ start, end });

	const calendar: CalendarType = [];

	days.forEach((day) => {
		calendar.push({
			day,
			actions: data?.filter((action) => {
				const date = toDate(new Date(action.date));
				if (format(date, "y-M-d") === format(day, "y-M-d")) {
					return true;
				}
			}),
		});
	});

	return (
		<div className="grid grid-cols-7 grow">
			{calendar.map((c, i) => (
				<div key={i} className="p-2 h-full">
					<div
						className={`text-sm ${
							c.day.getMonth() !== date.getMonth()
								? "opacity-25"
								: ""
						}`}
					>
						{c.day.getDate()}
					</div>
					<div>
						{c.actions.map((action) => (
							<div key={action.id} className="mb-2">
								{action.title}
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	);
}
