import { toDate } from "date-fns";
import { cn } from "~/lib/utils";
import { ScrollArea } from "../ui/scroll-area";

type CalendarDayType = { day: DayType; className?: string };

export default function CalendarDay({ day, className }: CalendarDayType) {
	const today = toDate(Date.now());

	return (
		<div
			className={cn([
				`px-6 py-2 sm:p-2 sm:flex sm:flex-col sm:overflow-hidden ${
					day.actions.length === 0 ? "max-sm:hidden" : ""
				}`,
				className,
			])}
		>
			<div
				className={`text-sm mb-2 ${
					day.date.getMonth() !== today.getMonth() ? "opacity-25" : ""
				}`}
			>
				{day.date.getDate()}
			</div>
			<ScrollArea className="max-h-full pb-4">
				{day.actions.map((action) => (
					<div
						key={action.id}
						className="mb-1 pl-2 border-l-4 border-orange-700 hover:border-orange-600 py-0.5 max-sm:text-xs text-sm hover:bg-accent bg-card transition cursor-pointer text-slate-500 w-full hover:text-muted-foreground rounded-[4px]"
					>
						{action.title}
					</div>
				))}
			</ScrollArea>
		</div>
	);
}
