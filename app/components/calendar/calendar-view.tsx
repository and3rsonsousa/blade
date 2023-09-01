import { useMatches, useNavigate } from "@remix-run/react";
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
import { ChevronLeftIcon, ChevronRightIcon, FilterIcon } from "lucide-react";
import { useState } from "react";
import { CategoryIcons } from "~/lib/icons";
import { useCurrentDate } from "~/lib/useCurrentDate";
import {
	getFilterdActions,
	getGroupedActions,
	getOrderedActions,
} from "~/lib/utils";
import { type ActionFull } from "../atoms/action";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";
import CalendarDay from "./calendar-day";

type CalendarType = { actions: Action[] };

export default function Calendar({ actions }: CalendarType) {
	const currentDate = useCurrentDate();
	const navigate = useNavigate();
	const matches = useMatches();

	const [filter, setFilter] = useState({ category: "all", state: "" });

	const { categories }: { categories: Category[] } = matches[1].data;

	const start = startOfWeek(startOfMonth(currentDate));
	const end = endOfWeek(endOfMonth(currentDate));
	const days = eachDayOfInterval({ start, end });
	const calendar: DaysType = [];

	const filteredActions =
		filter.category !== "all"
			? getFilterdActions(actions as ActionFull[], filter.category)
			: (actions as ActionFull[]);

	const orderedActions = getOrderedActions(filteredActions);
	const groupedActions = getGroupedActions(
		actions as ActionFull[],
		categories
	);
	groupedActions.filter((i) => true);

	days.forEach((day) => {
		calendar.push({
			date: day,
			actions: orderedActions?.filter((action) => {
				const date = toDate(new Date(action.date));
				if (format(date, "y-M-d") === format(day, "y-M-d")) {
					return true;
				}
				return false;
			}) as Action[],
		});
	});

	return (
		<div className="flex flex-col w-full h-full overflow-hidden">
			<div className="flex shrink border-b items-center gap-2 justify-between p-2">
				<div className="flex justify-between items-center w-full">
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
															Number(
																month.getMonth()
															)
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

						<div>
							<Button
								variant={"ghost"}
								size={"sm"}
								className="px-2"
								onClick={() => {
									navigate(
										`?date=${format(
											sub(currentDate, { months: 1 }),
											"Y-M-d"
										)}`
									);
								}}
							>
								<ChevronLeftIcon size={16} />
							</Button>
							<Button
								variant={"ghost"}
								size={"sm"}
								className="px-2"
								onClick={() => {
									navigate(
										`?date=${format(
											add(currentDate, { months: 1 }),
											"Y-M-d"
										)}`
									);
								}}
							>
								<ChevronRightIcon size={16} />
							</Button>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant={"ghost"}
									size={"sm"}
									className="text-xs"
								>
									{filter.category === "all" ? (
										<FilterIcon size={16} />
									) : (
										<CategoryIcons
											id={filter.category}
											className="w-4 h-4"
										/>
									)}
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="bg-content">
								<DropdownMenuRadioGroup
									value={filter.category}
									onValueChange={(value) =>
										setFilter({
											...filter,
											category: value,
										})
									}
								>
									<DropdownMenuRadioItem
										className="menu-item"
										value="all"
									>
										<div className="flex gap-2 items-center">
											<FilterIcon size={12} />
											Todos
										</div>
									</DropdownMenuRadioItem>

									{categories.map((category) => (
										<DropdownMenuRadioItem
											key={category.id}
											className="menu-item"
											value={category.slug}
										>
											<div className="flex gap-2 items-center">
												<CategoryIcons
													id={category.slug}
													className="w-3 h-3"
												/>

												{category.title}
											</div>
										</DropdownMenuRadioItem>
									))}
								</DropdownMenuRadioGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</div>
			<div className="grid grid-cols-7 text-xs border-b font-bold uppercase tracking-wider">
				{eachDayOfInterval({
					start: startOfWeek(currentDate),
					end: endOfWeek(currentDate),
				}).map((day) => (
					<div key={day.getDate()} className="p-1">
						{format(day, "eeeeee", { locale: ptBR })}
					</div>
				))}
			</div>
			<ScrollArea className="h-full flex">
				<div
					className={`sm:grid grid-cols-7 h-full grow shrink-0 sm:overflow-hidden`}
				>
					{calendar.map((day: DayType, i: number) => (
						<CalendarDay day={day} key={i} />
					))}
				</div>
			</ScrollArea>
		</div>
	);
}
