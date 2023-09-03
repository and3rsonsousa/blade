import { CommandInput, CommandEmpty, CommandGroup, CommandItem } from "cmdk";
import {
  ChevronsUpDownIcon,
  Command,
  FrownIcon,
  CheckCircle2Icon,
} from "lucide-react";
import { forwardRef, type ReactNode, useState } from "react";

import { cn } from "~/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";

const FancyCombobox = forwardRef<
  HTMLButtonElement,
  {
    placeholder?: string;
    items: GenericItem[];
    selectedValue?: string;
    itemContent?: (item: GenericItem) => ReactNode;
    onChange?: (value?: string) => void;
  }
>(({ placeholder, items, selectedValue, itemContent, onChange }, ref) => {
  const list = items.map((item) => ({
    id: item.id,
    value: item.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""),
    label: item.title,
  }));
  const [selected, setSelected] = useState(
    selectedValue
      ? list.filter((item) => item.id.toString() === selectedValue)[0].value
      : "",
  );
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant={"ghost"} size={"sm"} className="overflow-hidden">
          <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs">
            {selected
              ? list.find((item) => item.value === selected)?.label
              : placeholder || "Digite aqui..."}
          </div>

          <ChevronsUpDownIcon size={16} className="ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-content">
        <Command className="bg-transparent">
          <CommandInput
            placeholder="Digite a sua opção"
            className="bg-transparent"
          />

          <CommandEmpty className="flex items-center justify-center gap-2 text-left">
            <div>
              <FrownIcon size={24} />
            </div>
            <div>Nenhuma opção foi encontrada</div>
          </CommandEmpty>
          <CommandGroup className="p-0">
            {list.map((item) => (
              <CommandItem
                className="rounded-none bg-transparent aria-selected:bg-foreground/20"
                key={item.value}
                onSelect={(value) => {
                  if (value !== selected) {
                    setSelected(value);
                    if (onChange) onChange(item.id.toString());
                  }
                  setOpen(false);
                }}
                value={item.value}
              >
                <CheckCircle2Icon
                  className={cn(
                    "mr-2 h-4 w-4",
                    selected === item.value ? "opacity-100" : "opacity-0",
                  )}
                />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
});

FancyCombobox.displayName = "FancyCombobox";
export default FancyCombobox;
