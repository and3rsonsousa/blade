import { PopoverTrigger } from "@radix-ui/react-popover";
import { useNavigate } from "@remix-run/react";
import {
	add,
	eachDayOfInterval,
	eachMonthOfInterval,
	eachYearOfInterval,
	endOfMonth,
	endOfWeek,
	endOfYear,
	format,
	isSameMonth,
	isSameYear,
	setMonth,
	setYear,
	startOfMonth,
	startOfWeek,
	startOfYear,
	sub,
	toDate,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { Plus } from "lucide-react";
import { useCurrentDate } from "~/lib/useCurrentDate";
import ActionDialog from "../dialogs/action-dialog";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Popover, PopoverContent } from "../ui/popover";
import CalendarDay from "./calendar-day";

type CalendarType = { actions: Action[] };

export default function Calendar({ actions }: CalendarType) {
	const currentDate = useCurrentDate();
	const navigate = useNavigate();

	const start = startOfWeek(startOfMonth(currentDate));
	const end = endOfWeek(endOfMonth(currentDate));
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
		<div className="flex flex-col w-full">
			<div className="flex shrink border-b items-center gap-2 justify-between p-2">
				<div className="flex items-center gap-1 text-xl font-semibold">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant={"ghost"} size={"sm"}>
								<span className="first-letter:capitalize">
									{format(currentDate, "MMMM", {
										locale: ptBR,
									})}
								</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="bg-content">
							<DropdownMenuRadioGroup
								value={currentDate.getMonth().toString()}
							>
								{eachMonthOfInterval({
									start: startOfYear(currentDate),
									end: endOfYear(currentDate),
								}).map((month) => (
									<DropdownMenuRadioItem
										value={month.getMonth().toString()}
										key={month.getMonth()}
										className={`text-sm ${
											isSameMonth(currentDate, month)
												? "bg-foreground/10"
												: ""
										}`}
										onSelect={() => {
											navigate(
												`?date=${format(
													setMonth(
														currentDate,
														Number(month.getMonth())
													),
													"Y-M-d"
												)}`
											);
										}}
									>
										<span className="first-letter:capitalize">
											{format(month, "MMMM", {
												locale: ptBR,
											})}
										</span>
									</DropdownMenuRadioItem>
								))}
							</DropdownMenuRadioGroup>
						</DropdownMenuContent>
					</DropdownMenu>

					<div>de</div>
					<div>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant={"ghost"} size={"sm"}>
									<span className="first-letter:capitalize">
										{format(currentDate, "Y")}
									</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="bg-content">
								<DropdownMenuRadioGroup
									value={currentDate.getFullYear().toString()}
								>
									{eachYearOfInterval({
										start: sub(currentDate, { years: 1 }),
										end: add(currentDate, { years: 1 }),
									}).map((year) => (
										<DropdownMenuRadioItem
											value={year
												.getFullYear()
												.toString()}
											key={year.getFullYear()}
											className={`text-sm ${
												isSameYear(currentDate, year)
													? "bg-foreground/10"
													: ""
											}`}
											onSelect={() => {
												navigate(
													`?date=${format(
														setYear(
															currentDate,
															Number(
																year.getFullYear()
															)
														),
														"Y-M-d"
													)}`
												);
											}}
										>
											<span className="first-letter:capitalize">
												{format(year, "Y", {
													locale: ptBR,
												})}
											</span>
										</DropdownMenuRadioItem>
									))}
								</DropdownMenuRadioGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</div>
			<div
				className={`sm:grid grid-cols-7 ${
					calendar.length === 35 ? "grid-rows-5" : "grid-rows-6"
				} grow shrink-0 sm:overflow-hidden`}
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
						className="w-[86vw] sm:w-[540px] bg-content"
						align="end"
						sideOffset={16}
						alignOffset={0}
					>
						<ActionDialog />
					</PopoverContent>
				</Popover>
			</div>
		</div>
	);
}
