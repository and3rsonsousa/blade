import { useMatches, useNavigate } from "@remix-run/react";
import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR/index.js";
import {
  CalendarDaysIcon,
  CalendarIcon,
  CalendarPlusIcon,
  FilePlusIcon,
} from "lucide-react";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "../ui/command";

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
  const { clients } = matches[1].data as { clients: Client[] };

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

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput value={value} onValueChange={setValue} />
      <CommandList>
        <CommandEmpty>Sem resultados</CommandEmpty>
        <CommandGroup heading="Ações">
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
            <CalendarIcon className="mr-2" />
            Calendário
          </CommandItem>
          <CommandItem>
            <CalendarDaysIcon className="mr-2" />
            Ver o mês atual (
            <span className="capitalize">
              {format(new Date(), "MMMM", { locale: ptBR })}
            </span>{" "}
            )
          </CommandItem>
        </CommandGroup>
        {value.length > 0 ? (
          <CommandGroup heading="Clientes">
            {(clients as Client[]).map((client) => (
              <CommandItem
                key={client.id}
                onSelect={() => {
                  navigate(`/dashboard/client/${client.slug}`);
                  setOpen(false);
                }}
              >
                {client.title}
              </CommandItem>
            ))}
          </CommandGroup>
        ) : null}
      </CommandList>
    </CommandDialog>
  );
}
