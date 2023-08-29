import { isSameMonth, isToday } from "date-fns";
import { PlusIcon, Star } from "lucide-react";
import { useState } from "react";
import { useCurrentDate } from "~/lib/useCurrentDate";
import { cn } from "~/lib/utils";
import { ActionLineCalendar, type ActionFull } from "../action";
import ActionDialog from "../dialogs/action-dialog";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { AnimatePresence } from "framer-motion";

type CalendarDayType = { day: DayType; className?: string };

export default function CalendarDay({ day, className }: CalendarDayType) {
	const currentDate = useCurrentDate();
	const [open, setOpen] = useState(false);

	return (
		<div
			className={cn([
				`px-6 py-2 sm:p-1  sm:flex sm:flex-col relative justify-between group ${
					day.actions.length === 0 ? "max-sm:hidden" : ""
				}`,
				className,
			])}
		>
			<div className="flex flex-col relative ">
				<div className="flex justify-between">
					<div
						className={`text-xs w-6 h-6 -translate-x-1 mb-2 grid place-content-center ${
							isToday(day.date)
								? "bg-primary rounded-full font-bold"
								: !isSameMonth(currentDate, day.date)
								? "opacity-25"
								: ""
						}`}
					>
						{day.date.getDate()}
					</div>
					<div className="group-hover:opacity-100 opacity-0">
						<Popover open={open} onOpenChange={setOpen}>
							<PopoverTrigger asChild>
								<Button
									className="p-1 h-6 w-6 rounded"
									variant={"secondary"}
								>
									<PlusIcon size={12} />
								</Button>
							</PopoverTrigger>
							<PopoverContent
								className="w-[86vw] sm:w-[540px] bg-content m-2"
								align="end"
							>
								<ActionDialog
									closeDialog={() => setOpen(false)}
									date={day.date}
								/>
							</PopoverContent>
						</Popover>
					</div>
				</div>
				<AnimatePresence initial={false} mode="popLayout">
					{day.actions.map((action) => (
						<ActionLineCalendar
							action={action as ActionFull}
							key={action.id}
						/>
					))}
				</AnimatePresence>
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
