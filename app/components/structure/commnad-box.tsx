import {
  CalendarDaysIcon,
  CalendarIcon,
  CalendarPlusIcon,
  FilePlusIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "../ui/command";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMatches } from "@remix-run/react";

export default function CommandBox() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const matches = useMatches();
  const { clients } = matches[1].data;

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
          <CommandItem>
            <FilePlusIcon className="mr-2" />
            Nova Ação
            <CommandShortcut>⌘⇧A</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <CalendarPlusIcon className="mr-2" />
            Nova Data Comemorativa
            <CommandShortcut>⌘⇧D</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <CalendarIcon className="mr-2" />
            Ver o dia de Hoje
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
              <CommandItem key={client.id}>{client.title}</CommandItem>
            ))}
          </CommandGroup>
        ) : null}
      </CommandList>
    </CommandDialog>
  );
}
