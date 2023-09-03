import { type ContextMenuItemProps } from "@radix-ui/react-context-menu";
import { useFetcher, useMatches, useNavigate } from "@remix-run/react";
import { add, format, formatISO, parseISO } from "date-fns";
import { motion } from "framer-motion";
import {
  ClockIcon,
  CopyIcon,
  Loader2Icon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import { CategoryIcons } from "~/lib/icons";
import { removeTags } from "~/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuPortal,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "../ui/context-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";

export type ActionFull = Action & {
  clients: Client;
  categories: Category;
  states: State;
};

export function ActionLineCalendar({ action }: { action: ActionFull }) {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const busy = fetcher.state !== "idle";

  const matches = useMatches();
  const { categories, states }: { categories: Category[]; states: State[] } =
    matches[1].data;

  async function updateAction(values: {}) {
    await fetcher.submit(
      { action: "update-action", ...values },
      {
        method: "post",
        action: "/handle-action",
      },
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.4 }}
      className="relative"
    >
      <ContextMenu>
        <ContextMenuTrigger>
          <HoverCard>
            <HoverCardTrigger>
              <div
                className={`mb-0.5 border-l-4 px-2 border-${
                  action.states.slug
                }  relative flex w-full cursor-pointer gap-1 rounded bg-card py-1 text-xs text-slate-400 transition hover:bg-accent hover:text-foreground ${
                  busy && "opacity-50"
                }`}
                onClick={() => {
                  navigate(`/dashboard/action/${action.id}`);
                }}
              >
                {/* <div
                className={`bg-${
                  action.states.slug
                }-action relative flex w-full cursor-pointer gap-1 border-l-2 px-1 py-1.5  text-[11px] leading-none transition ${
                  busy && "opacity-50"
                }`}
                onClick={() => {
                  navigate(`/dashboard/action/${action.id}`);
                }}
              > */}
                <div
                  className="w-full shrink select-none overflow-hidden text-ellipsis whitespace-nowrap"
                  dangerouslySetInnerHTML={{
                    __html: removeTags(action.title),
                  }}
                ></div>
                {true ? (
                  <div className="text-[10px] tracking-tighter">
                    {format(parseISO(action.date), "H:m")}
                  </div>
                ) : (
                  <div className="w-5 text-[8px] uppercase opacity-75">
                    {action.clients.short.length > 3 ? (
                      <div className="text-center leading-[8px]">
                        {action.clients.short.substring(0, 2)}
                        <br />
                        {action.clients.short.substring(2)}
                      </div>
                    ) : (
                      action.clients.short
                    )}
                  </div>
                )}
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="bg-content">
              <div className="space-y-1 px-4 text-xs">
                <div className="text-sm font-medium">{action.title}</div>

                <div className="flex justify-between gap-2 text-[10px] uppercase">
                  <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                    {action.clients.title}
                  </div>
                  <div>{action.categories.title}</div>
                  <div className="whitespace-nowrap">
                    {format(
                      parseISO(action.date),
                      "d/M 'às' H'h'".concat(
                        parseISO(action.date).getMinutes() !== 0 ? "m" : "",
                      ),
                    )}
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
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
                    title: "1 Hora",
                    id: 1,
                    values: { hours: 1 },
                  },
                  {
                    title: "3 Horas",
                    id: 2,
                    values: { hours: 3 },
                  },
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
                ].map((period) => (
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
              </ContextMenuSubContent>
            </ContextMenuPortal>
          </ContextMenuSub>

          <MenuItem
            onSelect={async () => {
              if (confirm("Deseja deletar essa ação?")) {
                await fetcher.submit(
                  { action: "delete-action", id: action.id },
                  {
                    method: "post",
                    action: "/handle-action",
                  },
                );
              }
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
        </ContextMenuContent>
      </ContextMenu>

      {busy && (
        <div className="absolute inset-0 grid place-content-center">
          <Loader2Icon size={12} className="animate-spin text-primary" />
        </div>
      )}
    </motion.div>
  );
}

const MenuItem = ({ ...props }: ContextMenuItemProps) => (
  <ContextMenuItem className="menu-item" {...props} />
);
