import { toDate } from "date-fns";
import { Star } from "lucide-react";
import { cn } from "~/lib/utils";
import { ActionLineCalendar } from "../action";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

type CalendarDayType = { day: DayType; className?: string };

export default function CalendarDay({ day, className }: CalendarDayType) {
	const today = toDate(Date.now());

	return (
		<div
			className={cn([
				`px-6 py-2 sm:p-2 sm:flex sm:flex-col justify-between ${
					day.actions.length === 0 ? "max-sm:hidden" : ""
				}`,
				className,
			])}
		>
			<div className="flex flex-col overflow-hidden">
				<div
					className={`text-sm mb-2 ${
						day.date.getMonth() !== today.getMonth()
							? "opacity-25"
							: ""
					}`}
				>
					{day.date.getDate()}
				</div>
				<ScrollArea className="h-full">
					{day.actions.map((action) => (
						<ActionLineCalendar action={action} key={action.id} />
					))}
					<ScrollBar />
				</ScrollArea>
			</div>
			<div className="flex gap-1 shrink-0 grow-0 text-[10px] text-slate-600 items-center mt-2">
				<Star size={12} /> <div>Feriado</div>
			</div>
		</div>
	);
}
