import { Link, useMatches, useNavigate } from "@remix-run/react";
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
  parseISO,
  setMonth,
  setYear,
  startOfMonth,
  startOfWeek,
  startOfYear,
  sub,
  toDate,
} from "date-fns";
import ptBR from "date-fns/locale/pt-BR/index.js";
import { useSpring } from "framer-motion";
import {
  AlignJustifyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FilterIcon,
  ListTreeIcon,
  StarIcon,
  StarOffIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { CategoryIcons } from "~/lib/icons";

import {
  getActionsByResponsible,
  getFilteredActions,
  getOrderedActions,
} from "~/lib/utils";
import { type ActionFull } from "../atoms/action";
import Statistics from "../atoms/statistics";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";
import { Toggle } from "../ui/toggle";
import CalendarDay from "./calendar-day";
import { getCurrentDate } from "~/lib/getCurrentDate";
import { AvatarPerson } from "../dialogs/action-dialog";

type CalendarType = { actions: Action[]; celebrations: Celebration[] };

export default function CalendarView({ actions, celebrations }: CalendarType) {
  const currentDate = getCurrentDate();
  const navigate = useNavigate();
  const matches = useMatches();

  const { categories, states, people } = matches[1].data as {
    categories: Category[];
    states: State[];
    people: Person[];
  };

  const [filter, setFilter] = useState({ category: "all", state: "" });
  const [isGrouped, setGrouped] = useState(true);
  const [isCelebrationsVisible, setCelebrationsVisible] = useState(true);
  const [responsibles, setResponsibles] = useState<Person[]>(people);
  const [dropAction, setDropAction] = useState<Action | ActionFull>();

  const start = startOfWeek(startOfMonth(currentDate));
  const end = endOfWeek(endOfMonth(currentDate));

  const days = eachDayOfInterval({ start, end });
  const calendar: DaysType = [];

  const filteredActions =
    filter.category !== "all"
      ? getFilteredActions(actions as ActionFull[], filter.category)
      : (actions as ActionFull[]);

  const orderedActions = getOrderedActions(
    getActionsByResponsible(filteredActions, responsibles),
  );

  days.forEach((day) => {
    calendar.push({
      date: day,
      actions: orderedActions?.filter((action) => {
        const date = toDate(parseISO(action.date));
        if (format(date, "Y-MM-dd") === format(day, "Y-MM-dd")) {
          return true;
        }
        return false;
      }) as Action[],
      celebrations: celebrations.filter((celebration) => {
        const date = toDate(parseISO(celebration.date));
        if (format(date, "Y-MM-dd") === format(day, "Y-MM-dd")) {
          return true;
        }
        return false;
      }),
    });
  });

  const spring = useSpring(0, {
    stiffness: 200,
    damping: 30,
  });

  useEffect(() => {
    if (window) {
      const el = document.querySelector<HTMLElement>(
        `[data-date="${format(new Date(), "Y-MM-dd")}"]`,
      );
      el?.scrollIntoView({
        block: "start",
        behavior: "smooth",
      });
    }
  }, [spring]);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="flex shrink items-center justify-between gap-2 border-b p-2">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-1 text-xl font-bold">
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
                            setMonth(currentDate, Number(month.getMonth())),
                            "Y-MM-dd",
                          )}`,
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
                      value={year.getFullYear().toString()}
                      key={year.getFullYear()}
                      className={`text-sm ${
                        isSameYear(currentDate, year) ? "bg-foreground/10" : ""
                      }`}
                      onSelect={() => {
                        navigate(
                          `?date=${format(
                            setYear(currentDate, Number(year.getFullYear())),
                            "Y-MM-dd",
                          )}`,
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
              <Button variant={"ghost"} size={"sm"} className="px-2" asChild>
                <Link
                  to={`?date=${format(
                    sub(currentDate, { months: 1 }),
                    "Y-MM-dd",
                  )}`}
                >
                  <ChevronLeftIcon size={16} />
                </Link>
              </Button>
              <Button variant={"ghost"} size={"sm"} className="px-2" asChild>
                <Link
                  to={`?date=${format(
                    add(currentDate, { months: 1 }),
                    "Y-MM-dd",
                  )}`}
                >
                  <ChevronRightIcon size={16} />
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2 lg:gap-4">
            <Statistics
              data={states.map((state) => ({
                title: state.title,
                slug: state.slug,
                id: state.id,
                count: actions.filter(
                  (action) => (action as ActionFull).states.slug === state.slug,
                ).length,
              }))}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex cursor-pointer pl-2">
                  {responsibles.map((person) => (
                    <AvatarPerson
                      key={person?.id}
                      person={person}
                      className="-ml-2 h-8 w-8 border-4 border-background"
                    />
                  ))}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-content">
                {people.map((person) => (
                  <DropdownMenuCheckboxItem
                    key={person.id}
                    className="menu-item gap-2"
                    checked={
                      responsibles.find(
                        (responsible) => responsible.id === person.id,
                      ) !== undefined
                    }
                    onCheckedChange={(checked) => {
                      let _responsibles = responsibles;
                      if (checked) {
                        _responsibles = [...responsibles, person];
                        setResponsibles(_responsibles);
                      } else {
                        if (responsibles.length > 1) {
                          _responsibles = responsibles.filter(
                            (r) => person.id !== r.id,
                          );
                          setResponsibles(_responsibles);
                        } else {
                          alert(
                            "É necessário ter pelo menos uma pessoa respons;ável para ver as ações",
                          );
                        }
                      }
                    }}
                  >
                    <AvatarPerson person={person} className="h-6 w-6" />
                    {person.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex gap-1">
              <Toggle
                variant={"default"}
                size={"xs"}
                pressed={isCelebrationsVisible}
                onPressedChange={setCelebrationsVisible}
              >
                {isCelebrationsVisible ? (
                  <StarIcon size={16} />
                ) : (
                  <StarOffIcon size={16} />
                )}
              </Toggle>
              <Toggle
                variant={"default"}
                size={"xs"}
                pressed={isGrouped}
                onPressedChange={setGrouped}
              >
                {isGrouped ? (
                  <ListTreeIcon size={16} />
                ) : (
                  <AlignJustifyIcon size={16} />
                )}
              </Toggle>
            </div>
            {/* Filtro */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  className={`text-xs ${
                    filter.category !== "all" ? "bg-accent" : ""
                  }`}
                >
                  {filter.category === "all" ? (
                    <FilterIcon size={16} />
                  ) : (
                    <CategoryIcons id={filter.category} className="h-4 w-4" />
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
                  <DropdownMenuRadioItem className="menu-item" value="all">
                    <div className="flex items-center gap-2">
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
                      <div className="flex items-center gap-2">
                        <CategoryIcons id={category.slug} className="h-3 w-3" />

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
      {/* Dias do Calendário */}
      <div className="grid grid-cols-7 border-b text-center text-xs font-bold uppercase tracking-wider">
        {eachDayOfInterval({
          start: startOfWeek(currentDate),
          end: endOfWeek(currentDate),
        }).map((day) => (
          <div key={day.getDate()} className="p-1">
            {format(day, "eeeeee", { locale: ptBR })}
          </div>
        ))}
      </div>
      <ScrollArea className="flex h-full">
        <div
          className={`h-full shrink-0 grow grid-cols-7 sm:grid sm:overflow-hidden`}
        >
          {calendar.map((day: DayType, i: number) => (
            <CalendarDay
              day={day}
              key={i}
              isGrouped={isGrouped}
              dropAction={dropAction}
              setDropAction={(action) => setDropAction(action)}
              isCelebrationsVisible={isCelebrationsVisible}
            />
          ))}
        </div>
        <div className="mt-4 h-24 border-t"></div>
      </ScrollArea>
    </div>
  );
}
