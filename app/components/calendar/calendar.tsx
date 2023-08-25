import { PopoverTrigger } from "@radix-ui/react-popover";
import {
	eachDayOfInterval,
	endOfMonth,
	endOfWeek,
	format,
	startOfMonth,
	startOfWeek,
	toDate,
} from "date-fns";
import { Plus } from "lucide-react";
import ActionDialog from "../dialogs/action-dialog";
import { Button } from "../ui/button";
import { Popover, PopoverContent } from "../ui/popover";
import CalendarDay from "./calendar-day";

type CalendarType = { actions: Action[] };

export default function Calendar({ actions }: CalendarType) {
	const today = toDate(Date.now());
	const start = startOfWeek(startOfMonth(today));
	const end = endOfWeek(endOfMonth(today));
	const days = eachDayOfInterval({ start, end });
	const calendar: DaysType = [];

	days.forEach((day) => {
		calendar.push({
			date: day,
			actions: actions?.filter((action) => {
				const date = toDate(new Date(action.date));
				if (format(date, "y-M-d") === format(day, "y-M-d")) {
					return true;
				}
				return false;
			}) as Action[],
		});
	});

	return (
		<>
			<div
				className={`sm:grid grid-cols-7 ${
					calendar.length === 35 ? "grid-rows-5" : "grid-rows-6"
				} grow sm:overflow-hidden`}
			>
				{calendar.map((day: DayType, i: number) => (
					<CalendarDay day={day} key={i} />
				))}
			</div>
			<div className="fixed bottom-6 right-4">
				<Popover>
					<PopoverTrigger asChild>
						<Button size={"icon"} className="rounded-full">
							<Plus />
						</Button>
					</PopoverTrigger>
					<PopoverContent
						className="w-[86vw] sm:w-[540px] bg-foreground/5 border-foreground/10"
						align="end"
						sideOffset={16}
						alignOffset={0}
					>
						<ActionDialog />
					</PopoverContent>
				</Popover>
			</div>
		</>
	);
}
