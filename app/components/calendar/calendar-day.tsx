import { isSameMonth, isToday } from "date-fns";
import { Star } from "lucide-react";
import { useCurrentDate } from "~/lib/useCurrentDate";
import { cn } from "~/lib/utils";
import { ActionLineCalendar, type ActionFull } from "../action";

type CalendarDayType = { day: DayType; className?: string };

export default function CalendarDay({ day, className }: CalendarDayType) {
	const currentDate = useCurrentDate();

	return (
		<div
			className={cn([
				`px-6 py-2 sm:p-2 sm:flex sm:flex-col justify-between ${
					day.actions.length === 0 ? "max-sm:hidden" : ""
				}`,
				className,
			])}
		>
			<div className="flex flex-col overflow-hidden relative ">
				<div
					className={`text-xs w-6 h-6 mb-2 grid place-content-center ${
						isToday(day.date)
							? "bg-primary rounded-full font-bold"
							: !isSameMonth(currentDate, day.date)
							? "opacity-25"
							: ""
					}`}
				>
					{day.date.getDate()}
				</div>

				{/* <ScrollArea className="h-full"> */}
				{day.actions.map((action) => (
					<ActionLineCalendar
						action={action as ActionFull}
						key={action.id}
					/>
				))}
				{/* <ScrollBar />
				</ScrollArea> */}
			</div>
			<div>
				{false ? (
					<div className="flex gap-1 shrink-0 grow-0 text-[10px] text-slate-600 items-center mt-2">
						<Star size={12} /> <div>Feriado</div>
					</div>
				) : null}
			</div>
		</div>
	);
}
