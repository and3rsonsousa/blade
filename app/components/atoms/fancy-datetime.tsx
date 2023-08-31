import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useRef, useState } from "react";
import { cn } from "~/lib/utils";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export default function FancyDatetimePicker({
	date,
	onSelect,
}: {
	date: Date;
	onSelect: (value: Date) => void;
}) {
	const [_date, setDate] = useState(date);

	const hourRef = useRef<HTMLInputElement>(null);
	const minuteRef = useRef<HTMLInputElement>(null);
	function updateDate(value?: Date) {
		const tempDate = value || _date;

		tempDate.setHours(
			Number(hourRef.current?.value),
			Number(minuteRef.current?.value)
		);

		onSelect(tempDate);
		setDate(tempDate);
	}

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={"ghost"}
					size={"sm"}
					className={cn(
						"justify-start px-2 text-xs text-left font-normal"
					)}
				>
					<span className="sm:hidden">
						{_date
							? format(
									_date,
									_date.getMinutes() === 0
										? "d 'de' MMMM 'de' Y 'às' H'h'"
										: "d 'de' MMMM 'de' Y 'às' H'h'm",
									{
										locale: ptBR,
									}
							  )
							: ""}
					</span>
					<span className="max-sm:hidden">
						{_date
							? format(
									_date,
									_date.getMinutes() === 0
										? "d/MMM 'às' H'h'"
										: "d/MMM 'às' H'h'm",
									{
										locale: ptBR,
									}
							  )
							: ""}
					</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0">
				<Calendar
					mode="single"
					selected={_date}
					onSelect={(value) => {
						updateDate(value);
					}}
					initialFocus
				/>

				<div className="flex p-2 pb-2 border-t border-foreground/10 justify-center items-center text-sm  overflow-hidden">
					<input
						ref={hourRef}
						value={format(date, "H")}
						className="bg-transparent w-10 outline-none focus:ring-0 text-foreground text-right"
						onChange={() => updateDate()}
						type="number"
						min={0}
						max={23}
					/>
					<div>h</div>
					<input
						type="number"
						ref={minuteRef}
						value={format(date, "m")}
						className="bg-transparent w-10 outline-none focus:ring-0 text-foreground"
						onChange={() => updateDate()}
						min={0}
						max={59}
					/>
				</div>
			</PopoverContent>
		</Popover>
	);
}
