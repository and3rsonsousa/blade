import { useMatches, useNavigate, useOutletContext } from "@remix-run/react";
import { eachMonthOfInterval, endOfYear, format, startOfYear } from "date-fns";
import ptBR from "date-fns/locale/pt-BR/index.js";
import {
  CalendarDaysIcon,
  CalendarPlusIcon,
  FilePlusIcon,
  HeartHandshakeIcon,
} from "lucide-react";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { CategoryIcons } from "~/lib/icons";
import { OutletContextType } from "~/root";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "../ui/command";
import useDebounce from "~/lib/useDebounce";
import { getLoaderActions, removeTags } from "~/lib/utils";

export default function CommandBox({
  options,
}: {
  options: {
    action: {
      open: boolean;
      setOpen: Dispatch<SetStateAction<boolean>>;
    };
    celebration: {
      open: boolean;
      setOpen: Dispatch<SetStateAction<boolean>>;
    };
  };
}) {
  const matches = useMatches();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [actions, setActions] = useState<Action[] | null>();
  const { supabase } = useOutletContext<OutletContextType>();
  const { clients, states, categories } = matches[1].data as {
    clients: Client[];
    states: State[];
    categories: Category[];
  };

  useEffect(() => {
    function keyDown(event: KeyboardEvent) {
      if (event.key == "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((open) => !open);
      }
    }

    document.addEventListener("keydown", keyDown);
    return () => document.removeEventListener("keydown", keyDown);
  }, []);

  useEffect(() => {
    async function getActions() {
      const { data } = await supabase.from("actions").select("*");
      setActions(() => data);
    }
    getActions();
  }, []);
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput value={value} onValueChange={setValue} />
      <div className="h-[1px] bg-gradient-to-r from-transparent via-foreground/50"></div>
      <CommandList>
        <CommandEmpty>Sem resultados</CommandEmpty>
        <CommandGroup heading="Ações Rápidas">
          <CommandItem
            onSelect={() => {
              options.action.setOpen(true);
              setOpen(false);
            }}
          >
            <FilePlusIcon className="mr-2" />
            Criar uma nova Ação para hoje
            <CommandShortcut>⌘⇧A</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              options.celebration.setOpen(true);
              setOpen(false);
            }}
          >
            <CalendarPlusIcon className="mr-2" />
            Nova Data Comemorativa
            <CommandShortcut>⌘⇧E</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Views">
          <CommandItem>
            <CalendarDaysIcon className="mr-2" />
            Calendário
          </CommandItem>
        </CommandGroup>
        {value.length > 0 ? (
          <>
            <CommandGroup heading="Clientes">
              {(clients as Client[]).map((client) => (
                <CommandItem
                  key={client.id}
                  onSelect={() => {
                    navigate(`/dashboard/client/${client.slug}`);
                    setOpen(false);
                  }}
                >
                  <HeartHandshakeIcon className="mr-2" />
                  {client.title}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Meses">
              {eachMonthOfInterval({
                start: startOfYear(new Date()),
                end: endOfYear(new Date()),
              }).map((month) => (
                <CommandItem
                  key={month.getMonth()}
                  onSelect={() => {
                    navigate(`?date=${format(month, "YYYY-MM-dd")}`);
                    setOpen(false);
                  }}
                >
                  <span>Ver o mês de&nbsp; </span>
                  <span className="capitalize">
                    {format(month, "MMMM", { locale: ptBR })}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        ) : null}
        {actions && value && value !== " " && (
          <CommandGroup heading="Ações">
            {actions.map((action) => {
              const category = categories.find(
                (category) => category.id === action.category_id,
              );
              const client = clients.find(
                (client) => client.id === action.client_id,
              );
              const state = states.find(
                (state) => state.id === action.state_id,
              );
              return (
                <CommandItem
                  key={action.id}
                  onSelect={() => {
                    navigate(
                      `/dashboard/client/${client?.slug}/action/${action.id}`,
                    );
                    setOpen(false);
                  }}
                  className="justify-between"
                >
                  <div className="flex gap-2">
                    <CategoryIcons id={category?.slug} />
                    {removeTags(action.title)}
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <div className="text-[8px] font-bold uppercase tracking-widest">
                      {client?.short}
                    </div>
                    <div
                      className={`h-2 w-2 rounded-full border-2 border-${state?.slug}`}
                    ></div>
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
