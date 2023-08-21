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
				return false;
			}) as Action[],
		});
	});

	return (
		<div
			className={`grid grid-cols-7 ${
				calendar.length === 35 ? "grid-rows-5" : "grid-rows-6"
			} grow overflow-hidden`}
		>
			{calendar.map((c: DayType, i: number) => (
				<div key={i} className="p-2 flex flex-col overflow-hidden">
					<div
						className={`text-sm mb-2 ${
							c.day.getMonth() !== date.getMonth()
								? "opacity-25"
								: ""
						}`}
					>
						{c.day.getDate()}
					</div>
					<ScrollArea className="max-h-full grow shrink-0 pb-4">
						{c.actions.map((action) => (
							<div
								key={action.id}
								className="mb-1 pl-2 border-l-4 border-orange-900 rounded-[4px] hover:border-orange-700 py-1 text-sm hover:bg-orange-900 bg-card transition cursor-pointer"
							>
								{action.title}
							</div>
						))}
					</ScrollArea>
				</div>
			))}
		</div>
	);
}
