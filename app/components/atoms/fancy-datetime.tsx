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
      Number(minuteRef.current?.value),
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
          className={cn("justify-start px-2 text-left text-xs font-normal")}
        >
          <span className="whitespace-nowrap sm:hidden">
            {_date
              ? format(
                  _date,
                  _date.getMinutes() === 0
                    ? "d 'de' MMMM 'de' Y 'às' H'h'"
                    : "d 'de' MMMM 'de' Y 'às' H'h'm",
                  {
                    locale: ptBR,
                  },
                )
              : ""}
          </span>
          <span className="whitespace-nowrap max-sm:hidden">
            {_date
              ? format(
                  _date,
                  _date.getMinutes() === 0
                    ? "d/MMM 'às' H'h'"
                    : "d/MMM 'às' H'h'm",
                  {
                    locale: ptBR,
                  },
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

        <div className="overflow-hidden border-t border-foreground/10 p-2  pb-2 text-sm">
          <div className="mx-auto flex w-20 items-center justify-center rounded-sm p-2 ring-primary focus-within:ring-2">
            <input
              ref={hourRef}
              value={format(date, "H")}
              className="w-10 bg-transparent text-right text-foreground outline-none focus:ring-0"
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
              className="w-10 bg-transparent text-foreground outline-none focus:ring-0"
              onChange={() => updateDate()}
              min={0}
              max={59}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
