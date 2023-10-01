import { useFetcher, useMatches } from "@remix-run/react";
import { format, formatISO, isSameMonth, isToday, parseISO } from "date-fns";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { getCurrentDate } from "~/lib/getCurrentDate";
import { cn, getGroupedActions } from "~/lib/utils";
import { ActionLineCalendar, type ActionFull } from "../atoms/action";
import CelebrationLine from "../atoms/celebration";
import ActionDialog from "../dialogs/action-dialog";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type CalendarDayType = {
  day: DayType;
  className?: string;
  isGrouped?: boolean;
  isCelebrationsVisible?: boolean;
  dropAction?: Action | ActionFull;
  setDropAction: (action?: Action | ActionFull) => void;
  set_actions: (action: Action | ActionFull) => void;
};

export default function CalendarDay({
  day,
  className,
  isGrouped,
  isCelebrationsVisible,
  dropAction,
  set_actions,
  setDropAction,
}: CalendarDayType) {
  const currentDate = getCurrentDate();
  const matches = useMatches();
  const fetcher = useFetcher();

  const { categories } = matches[1].data as { categories: Category[] };
  const [open, setOpen] = useState(false);
  const [drag, setDrag] = useState(false);

  return (
    <div
      className={cn([
        `group relative justify-between px-6 py-2 transition-colors sm:flex sm:flex-col sm:p-1 ${
          day.actions.length === 0 ? "max-sm:hidden" : ""
        } rounded-sm ${drag ? "bg-popover" : ""}`,
        className,
      ])}
      data-date={format(day.date, "Y-MM-dd")}
      onDragOver={(event) => {
        event.preventDefault();
        setDrag(true);
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        setDrag(false);
      }}
      onDrop={async (event) => {
        setDrag(false);
        const dateAttribute = (
          event.currentTarget as HTMLDivElement
        ).attributes.getNamedItem("data-date")?.value as string;

        if (dropAction && dateAttribute) {
          let targetDate = parseISO(dateAttribute);

          const currentActionDate = parseISO(dropAction.date);
          targetDate.setHours(
            currentActionDate.getHours(),
            currentActionDate.getMinutes(),
          );

          set_actions({
            ...dropAction,
            date: formatISO(targetDate),
          });

          await fetcher.submit(
            {
              action: "update-action",
              id: dropAction.id,
              date: formatISO(targetDate),
            },
            { action: "/handle-action", method: "post" },
          );
        }
      }}
    >
      <div className={`relative flex flex-col`}>
        <div className="flex justify-between">
          <div
            className={`mb-2 grid h-6 w-6 -translate-x-1 place-content-center text-xs ${
              isToday(day.date)
                ? "rounded-full bg-primary font-bold"
                : !isSameMonth(currentDate, day.date)
                ? "opacity-25"
                : ""
            }`}
          >
            {day.date.getDate()}
          </div>
          <div className="opacity-0 group-hover:opacity-100">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button className="h-6 w-6 rounded p-1" variant={"secondary"}>
                  <PlusIcon size={12} />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="bg-content m-2 w-[86vw] sm:w-[540px]"
                align="end"
              >
                <ActionDialog
                  closeDialog={() => setOpen(false)}
                  date={(() => {
                    let date = day.date;
                    date.setHours(11, 12);
                    return date;
                  })()}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        {/* <AnimatePresence initial={false} mode="popLayout"> */}
        {isGrouped
          ? getGroupedActions(day.actions as ActionFull[], categories).map(
              ({ category, actions }) =>
                actions.length > 0 && (
                  <div key={category.id} className="mb-2">
                    <div
                      className={`mb-1 text-[8px] font-bold uppercase tracking-wider`}
                    >
                      {category.title}
                    </div>
                    {actions.map((action) => (
                      <ActionLineCalendar
                        action={action as ActionFull}
                        key={action.id}
                        setDropAction={setDropAction}
                      />
                    ))}
                  </div>
                ),
            )
          : day.actions.map((action) => (
              <ActionLineCalendar
                action={action as ActionFull}
                key={action.id}
                setDropAction={setDropAction}
              />
            ))}
        {/* </AnimatePresence> */}
      </div>

      <div>
        {isCelebrationsVisible &&
          day.celebrations.length > 0 &&
          day.celebrations.map((celebration) => (
            <CelebrationLine celebration={celebration} key={celebration.id} />
          ))}
      </div>
    </div>
  );
}
