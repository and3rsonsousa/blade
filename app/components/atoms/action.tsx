import { type ContextMenuItemProps } from "@radix-ui/react-context-menu";
import { Link, useFetcher, useMatches, useNavigate } from "@remix-run/react";
import { add, format, formatISO, parseISO } from "date-fns";
import {
  ClockIcon,
  CopyIcon,
  Loader2Icon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { CategoryIcons, PriorityIcons } from "~/lib/icons";
import { removeTags } from "~/lib/utils";
import { Button } from "../ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "../ui/context-menu";

export type ActionFull = Action & {
  clients: Client;
  categories: Category;
  states: State;
  priority: Priority;
  loading?: boolean;
};

export function ActionLineCalendar({
  action,
  setDropAction,
  showCategory,
}: {
  action: ActionFull;
  setDropAction: (action: ActionFull | Action) => void;
  showCategory?: boolean;
}) {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const matches = useMatches();
  const [isHover, setHover] = useState(false);

  const busy = fetcher.state !== "idle";
  const {
    categories,
    states,
    priorities,
  }: { categories: Category[]; states: State[]; priorities: Priority[] } =
    matches[1].data as {
      categories: Category[];
      states: State[];
      priorities: Priority[];
    };

  async function updateAction(values: {}) {
    await fetcher.submit(
      { action: "update-action", ...values },
      {
        method: "post",
        action: "/handle-action",
      },
    );
  }

  async function deleteAction() {
    if (confirm("Deseja deletar essa ação?")) {
      await fetcher.submit(
        { action: "delete-action", id: action.id },
        {
          method: "post",
          action: "/handle-action",
        },
      );
    }
  }

  useEffect(() => {
    if (isHover) {
      const keyDown = async function (event: KeyboardEvent) {
        if (["i", "f", "z", "t", "a", "c"].find((k) => k === event.key)) {
          let state_id = 0;
          if (event.key === "i") {
            state_id = 1;
          }
          if (event.key === "f") {
            state_id = 2;
          }
          if (event.key === "z") {
            state_id = 3;
          }
          if (event.key === "a") {
            state_id = 4;
          }
          if (event.key === "t") {
            state_id = 5;
          }
          if (event.key === "c") {
            state_id = 6;
          }

          await fetcher.submit(
            {
              action: "update-action",
              id: action.id,
              state_id,
            },
            {
              method: "POST",
              action: "/handle-action",
            },
          );
        }

        if (event.key === "d") {
          fetcher.submit(
            { id: action.id, action: "duplicate-action" },
            { action: "/handle-action", method: "POST" },
          );
        }

        if (event.key === "x") {
          deleteAction();
        }
      };
      window.addEventListener("keydown", keyDown);

      return () => window.removeEventListener("keydown", keyDown);
    }
  }, [isHover, action, fetcher]);

  return (
    <div
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
      className="relative"
      draggable
      onDrag={(event) => {
        setDropAction(action);
      }}
    >
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            className={`mb-0.5 border-l-4 px-2 border-${
              action.states.slug
            }  group/action font relative flex w-full cursor-pointer gap-1 rounded bg-card py-1 text-xs text-slate-400 transition hover:bg-accent hover:text-foreground ${
              busy && "opacity-50"
            }`}
            onClick={() => {
              navigate(`/dashboard/action/${action.id}`);
            }}
            title={action.title}
          >
            {showCategory && (
              <CategoryIcons
                id={action.categories.slug}
                className="h-4 w-4 text-slate-500"
              />
            )}

            <div
              className="w-full shrink select-none overflow-hidden text-ellipsis whitespace-nowrap"
              dangerouslySetInnerHTML={{
                __html: removeTags(action.title),
              }}
            ></div>

            <div className="absolute right-2 top-1 w-7 text-right text-[10px] tracking-tighter opacity-0 group-hover/action:opacity-100">
              {format(
                parseISO(action.date),
                "H'h'".concat(
                  parseISO(action.date).getMinutes() !== 0 ? "mm" : "",
                ),
              )}
            </div>

            <div className="w-5 text-[8px] uppercase opacity-75 group-hover/action:opacity-0">
              <ShortName short={action.clients.short} />
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="bg-content mx-2">
          {action.states.slug !== "finished" && (
            <>
              <MenuItem
                onSelect={async () => {
                  await fetcher.submit(
                    {
                      action: "update-action",
                      id: action.id,
                      state_id: 6,
                    },
                    {
                      method: "POST",
                      action: "/handle-action",
                    },
                  );
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="border-finished h-2 w-2 rounded-full border-2"></div>
                  <div>Concluído</div>
                </div>
              </MenuItem>
              <ContextMenuSeparator />
            </>
          )}
          <MenuItem
            onSelect={() => {
              navigate(`/dashboard/action/${action.id}`);
            }}
          >
            <div className="flex items-center gap-2">
              <PencilIcon size={12} />
              <div>Editar</div>
            </div>
          </MenuItem>
          <MenuItem
            onSelect={() => {
              fetcher.submit(
                { id: action.id, action: "duplicate-action" },
                { action: "/handle-action", method: "POST" },
              );
            }}
          >
            <div className="flex items-center gap-2">
              <CopyIcon size={12} />
              <div>Duplicar</div>
            </div>
          </MenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger className="menu-item">
              <div className="flex items-center gap-2">
                <ClockIcon size={12} />
                <div>Adiar</div>
              </div>
            </ContextMenuSubTrigger>
            <ContextMenuPortal>
              <ContextMenuSubContent className="bg-content">
                {[
                  {
                    id: 1,
                    title: "Horas",
                    periods: [
                      {
                        title: "1 Hora",
                        id: 1,
                        values: { hours: 1 },
                      },
                      {
                        title: "3 Horas",
                        id: 2,
                        values: { hours: 3 },
                      },
                    ],
                  },
                  {
                    id: 2,
                    title: "Dias",
                    periods: [
                      {
                        title: "1 Dia",
                        id: 3,
                        values: { days: 1 },
                      },
                      {
                        title: "3 Dias",
                        id: 4,
                        values: { days: 3 },
                      },
                      {
                        title: "5 Dias",
                        id: 5,
                        values: { days: 5 },
                      },
                    ],
                  },
                  {
                    id: 3,
                    title: "Outros",
                    periods: [
                      {
                        title: "1 Semana",
                        id: 6,
                        values: { weeks: 1 },
                      },
                      {
                        title: "1 Mês",
                        id: 7,
                        values: { months: 1 },
                      },
                    ],
                  },
                ].map((group, i) => (
                  <ContextMenuGroup key={group.id}>
                    <ContextMenuLabel className="text-[10px] uppercase opacity-50">
                      {group.title}
                    </ContextMenuLabel>
                    {group.periods.map((period) => (
                      <ContextMenuItem
                        key={period.id}
                        className="menu-item"
                        onSelect={async () => {
                          await fetcher.submit(
                            {
                              action: "update-action",
                              id: action.id,
                              date: formatISO(
                                add(parseISO(action.date), period.values),
                              ),
                            },
                            {
                              action: "/handle-action",
                              method: "POST",
                            },
                          );
                        }}
                      >
                        {period.title}
                      </ContextMenuItem>
                    ))}
                    {i + 1 < group.periods.length && (
                      <hr className="border-foreground/10" />
                    )}
                  </ContextMenuGroup>
                ))}
              </ContextMenuSubContent>
            </ContextMenuPortal>
          </ContextMenuSub>

          <MenuItem
            onSelect={async () => {
              deleteAction();
            }}
          >
            <div className="flex items-center gap-2">
              <TrashIcon size={12} />
              <div>Deletar</div>
            </div>
          </MenuItem>
          <ContextMenuSeparator />
          <ContextMenuSub>
            <ContextMenuSubTrigger className="menu-item">
              <div className="flex items-center gap-2">
                <CategoryIcons
                  id={action.categories.slug}
                  className="h-3 w-3"
                />
                {action.categories.title}
              </div>
            </ContextMenuSubTrigger>
            <ContextMenuPortal>
              <ContextMenuSubContent className="bg-content">
                {categories.map((category) => (
                  <MenuItem
                    key={category.id}
                    onSelect={() => {
                      updateAction({
                        ...action,
                        category_id: category.id,
                        state_id: action.state_id,
                      });
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <CategoryIcons id={category.slug} className="h-3 w-3" />
                      {category.title}
                    </div>
                  </MenuItem>
                ))}
              </ContextMenuSubContent>
            </ContextMenuPortal>
          </ContextMenuSub>
          <ContextMenuSub>
            <ContextMenuSubTrigger className="menu-item">
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full border-2 border-${action.states.slug}`}
                ></div>
                {action.states.title}
              </div>
            </ContextMenuSubTrigger>
            <ContextMenuPortal>
              <ContextMenuSubContent className="bg-content">
                {states.map((state) => (
                  <MenuItem
                    key={state.id}
                    onSelect={() => {
                      updateAction({
                        ...action,
                        state_id: state.id,
                        category_id: action.category_id,
                      });
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full border-2 border-${state.slug}`}
                      ></div>
                      {state.title}
                    </div>
                  </MenuItem>
                ))}
              </ContextMenuSubContent>
            </ContextMenuPortal>
          </ContextMenuSub>
          <ContextMenuSub>
            <ContextMenuSubTrigger className="menu-item">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <PriorityIcons
                    id="base"
                    className="absolute left-0 top-0 h-3 w-3 opacity-20"
                  />
                  <PriorityIcons
                    id={action.priority.slug}
                    className="h-3 w-3"
                  />
                </div>
                {action.priority.title}
              </div>
            </ContextMenuSubTrigger>
            <ContextMenuPortal>
              <ContextMenuContent className="bg-content">
                {priorities.map((priority) => (
                  <ContextMenuItem
                    key={priority.id}
                    className="menu-item"
                    onSelect={() => {
                      fetcher.submit(
                        {
                          action: "update-action",
                          id: action.id,
                          priority_id: priority.id,
                        },
                        {
                          action: "/handle-action",
                          method: "POST",
                        },
                      );
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <PriorityIcons id={priority.slug} className="h-3 w-3" />
                      {priority.title}
                    </div>
                  </ContextMenuItem>
                ))}
              </ContextMenuContent>
            </ContextMenuPortal>
          </ContextMenuSub>
        </ContextMenuContent>
      </ContextMenu>

      {busy && (
        <div className="absolute inset-0 grid place-content-center">
          <Loader2Icon size={12} className="animate-spin text-primary" />
        </div>
      )}
    </div>
  );
}

const MenuItem = ({ ...props }: ContextMenuItemProps) => (
  <ContextMenuItem className="menu-item" {...props} />
);

export function ActionListItem({ action }: { action: ActionFull }) {
  return (
    <div
      className={`group flex cursor-pointer items-center justify-between rounded border-l-4 bg-card pl-3 pr-1 text-slate-400 transition hover:bg-accent hover:text-foreground border-${action.states.slug}`}
    >
      <div className="flex items-center gap-2 py-1">
        <CategoryIcons
          id={action.categories.slug}
          className="h-4 w-4 text-slate-500"
        />
        <div>{action.title}</div>
      </div>
      <div className="flex py-1 opacity-0 transition group-hover:opacity-100">
        <Button variant={"ghost"} className="h-8 w-8 p-0" asChild>
          <Link to={`/dashboard/action/${action.id}`}>
            <PencilIcon size={12} />
          </Link>
        </Button>
        <Button variant={"ghost"} className="h-8 w-8 p-0" onClick={() => {}}>
          <TrashIcon size={12} />
        </Button>
      </div>
    </div>
  );
}

export function ActionStatus({ action }: { action: ActionFull }) {
  return (
    <div
      className={`flex w-full cursor-pointer items-center justify-between overflow-hidden rounded border-l-4 bg-card px-2 text-slate-400 transition hover:bg-accent hover:text-foreground border-${action.states.slug}`}
    >
      <div className="flex items-center gap-2 py-1">
        <CategoryIcons
          id={action.categories.slug}
          className="h-4 w-4 text-slate-500"
        />
        <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap  text-xs">
          {action.title}
        </div>
      </div>
    </div>
  );
}
export function ActionPriority({ action }: { action: ActionFull }) {
  return (
    <div
      className={`flex w-full cursor-pointer items-center justify-between overflow-hidden rounded border-l-4 bg-card px-2 text-slate-400 transition hover:bg-accent hover:text-foreground border-${action.states.slug}`}
    >
      <div className="flex items-center gap-2 py-1">
        <CategoryIcons
          id={action.categories.slug}
          className="h-4 w-4 text-slate-500"
        />
        <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap  text-xs">
          {action.title}
        </div>
      </div>
    </div>
  );
}

export function ShortName({ short }: { short: string }) {
  return short.length > 3 ? (
    <div className="text-center leading-none">
      {short.substring(0, short.length > 4 ? 3 : 2)}
      <br />
      {short.substring(short.length > 4 ? 3 : 2)}
    </div>
  ) : (
    short
  );
}
