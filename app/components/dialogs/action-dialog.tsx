import { useFetcher, useMatches, useParams } from "@remix-run/react";

import { format, formatISO, parseISO } from "date-fns";
import { Check, Loader2Icon, UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { CategoryIcons, PriorityIcons } from "~/lib/icons";
import { cn, removeTags } from "~/lib/utils";
import UpdatedTimeClock from "../atoms/update-time-clock";

import FancySelectInput from "~/components/atoms/fancy-select";
import CmdEnter from "../atoms/cmdenter";
import Editor from "../atoms/editor";
import FancyDatetimePicker from "../atoms/fancy-datetime";
import FancyInputText from "../atoms/fancy-input";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { SelectItem } from "../ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export type InternalAction = {
  title?: string;
  description?: string | null;
  client_id?: string;
  category_id?: string;
  state_id?: string;
  priority_id?: string;
  responsibles?: string[] | null;
  date: Date;
};

type ActionDialogType = {
  mode?: "page" | "popover";
  action?: Action;
  date?: Date;
  closeDialog?: () => void;
};

export default function ActionDialog({
  mode,
  action,
  date,
  closeDialog,
}: ActionDialogType) {
  const baseDate = date || new Date();
  const now = new Date();
  if (
    format(now, "Y-MM-dd") === format(baseDate, "Y-MM-dd") &&
    now.getHours() >= 11
  ) {
    baseDate.setHours(now.getHours() + 1, 12);
  } else {
    baseDate.setHours(11, 12);
  }
  const matches = useMatches();
  const fetcher = useFetcher();
  const { categories, clients, states, priorities, people, user } = matches[1]
    .data as {
    categories: Category[];
    clients: Client[];
    states: State[];
    priorities: Priority[];
    people: Person[];
    user: string;
  };
  const { slug } = useParams();

  const client_id = slug
    ? (clients as Client[])
        .find((client) => client.slug === slug)
        ?.id.toString()
    : undefined;

  //
  const [internalAction, setAction] = useState<InternalAction>({
    title: action ? action.title : "",
    description: action ? action.description : "",
    client_id: action ? String(action.client_id) : client_id ? client_id : "",
    category_id: action ? String(action.category_id) : "1",
    state_id: action ? String(action.state_id) : "2",
    priority_id: action
      ? String(action.priority_id)
      : "af6ceef7-7c70-44c9-b187-ee9d376c15c1",
    date: action ? parseISO(action.date) : baseDate,
    responsibles: action ? action.responsibles : null,
  });

  const busy = fetcher.state !== "idle";

  useEffect(() => {
    if (
      fetcher.state === "idle" &&
      fetcher.data &&
      Object.keys(fetcher.data).find((k) => k === "data")
    )
      if (closeDialog) closeDialog();
  }, [fetcher, closeDialog]);

  function createAction() {
    fetcher.submit(
      {
        action: "create-action",
        title: internalAction.title as string,
        description: internalAction.description as string,
        client_id: internalAction.client_id as string,
        category_id: internalAction.category_id as string,
        state_id: internalAction.state_id as string,
        date: formatISO(internalAction.date),
        responsibles: [user],
      },
      {
        method: "post",
        action: "/handle-action",
      },
    );
  }

  function updateAction() {
    fetcher.submit(
      {
        action: "update-action",
        id: action?.id as string,
        title: internalAction.title as string,
        description: internalAction.description as string,
        client_id: internalAction.client_id as string,
        category_id: internalAction.category_id as string,
        state_id: internalAction.state_id as string,
        priority_id: internalAction.priority_id as string,
        responsibles: internalAction.responsibles as string[],
        date: formatISO(internalAction.date),
      },
      {
        method: "post",
        action: "/handle-action",
      },
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (isValidAction(internalAction)) {
          action ? updateAction() : createAction();
        }
      }}
      className={`${
        mode === "page" ? "flex h-full flex-col overflow-hidden" : ""
      }`}
    >
      <CmdEnter
        fn={
          isValidAction(internalAction)
            ? action
              ? updateAction
              : createAction
            : () => {
                alert("Ação inválida");
              }
        }
      />
      {/* Título e Desrição */}
      <div
        className={
          mode === "page" ? "flex h-full flex-col overflow-hidden" : ""
        }
      >
        {/* Título */}
        <div className={`p-8  pb-0 max-sm:p-4 `}>
          {action &&
            (busy ? (
              <div>
                <Loader2Icon size={16} className="animate-spin text-primary" />
              </div>
            ) : (
              <UpdatedTimeClock time={parseISO(action.updated_at)} />
            ))}
          <FancyInputText
            onChange={(value) => {
              setAction({
                ...internalAction,
                title: removeTags(value as string),
              });
            }}
            placeholder="Nome da ação"
            className={`${
              action
                ? `min-h-[70px] text-6xl font-bold tracking-tighter`
                : `text-2xl font-bold`
            } w-full bg-transparent outline-none`}
            value={removeTags(internalAction.title || "")}
          />
        </div>
        {/* Descrição */}

        {action ? (
          <div className="grow overflow-hidden px-8 text-sm max-sm:px-4 sm:pt-4">
            <ScrollArea className="h-full">
              <Editor
                content={action.description as string}
                onBlur={(value) =>
                  setAction({
                    ...internalAction,
                    description: value,
                  })
                }
              />
            </ScrollArea>
          </div>
        ) : (
          <div className="px-8 text-sm max-sm:px-4 sm:pt-4">
            <FancyInputText
              placeholder="Descreva sua ação aqui..."
              onChange={(value) => {
                setAction({
                  ...internalAction,
                  description: removeTags(value || ""),
                });
              }}
              max={200}
            />
          </div>
        )}
      </div>

      {/* <pre>{JSON.stringify(internalAction, undefined, 2)}</pre> */}

      {/* Botões */}
      <div className="shrink-0">
        <div className="mt-4 grid-cols-5 justify-between gap-4 overflow-hidden border-t border-foreground/10 px-2 py-4 sm:grid sm:px-6">
          {/* Categoria, Cliente, Status e Prioridade */}
          <div className="col-span-3 flex w-full justify-between gap-1 sm:justify-start">
            {/* Clientes */}
            <FancySelectInput
              items={clients}
              placeholder="Cliente"
              onChange={(value) => {
                setAction({
                  ...internalAction,
                  client_id: value,
                });
              }}
              selectedValue={internalAction.client_id}
            />
            {/* Categorias */}
            <FancySelectInput
              items={categories}
              placeholder="Categoria"
              selectedValue={internalAction.category_id}
              itemValue={(item) => {
                return (
                  item && (
                    <CategoryIcons
                      id={item.slug}
                      className="mr-1 h-4  w-4"
                      key={item.id}
                    />
                  )
                );
              }}
              itemMenu={(item) => {
                return (
                  <SelectItem value={String(item.id)} key={item.id}>
                    <div className="flex gap-2">
                      <CategoryIcons id={item.slug} className="h-4 w-4" />

                      {item.title}
                    </div>
                  </SelectItem>
                );
              }}
              onChange={(value) =>
                setAction({
                  ...internalAction,
                  category_id: value,
                })
              }
            />
            {/* Status */}
            <FancySelectInput
              items={states}
              placeholder="Status"
              selectedValue={internalAction.state_id}
              itemMenu={(item) => (
                <SelectItem value={String(item.id)} key={item.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className={`border-${item.slug} h-2 w-2 rounded-full border-2`}
                    ></div>
                    <div>{item.title}</div>
                  </div>
                </SelectItem>
              )}
              itemValue={(item) => {
                return (
                  item && (
                    <div
                      className={`border-${item.slug} mr-1 h-3 w-3 rounded-full border-[3px]`}
                      key={item.id}
                    ></div>
                  )
                );
              }}
              onChange={(value) =>
                setAction({
                  ...internalAction,
                  state_id: value,
                })
              }
            />

            {/* Prioridades */}

            {action && (
              <FancySelectInput
                items={priorities.map<GenericItem>((p, i) => ({
                  id: p.id,
                  title: p.title,
                  slug: p.slug,
                }))}
                selectedValue={internalAction.priority_id}
                itemMenu={(item) => (
                  <SelectItem value={String(item.id)} key={item.id}>
                    <div className="flex items-center gap-2">
                      <PriorityIcons id={item.slug} className="h-4 w-4" />
                      <div>{item.title}</div>
                    </div>
                  </SelectItem>
                )}
                itemValue={(item) => {
                  return (
                    item && <PriorityIcons className="h-4 w-4" id={item.slug} />
                  );
                }}
                onChange={(value) =>
                  setAction({
                    ...internalAction,
                    priority_id: value,
                  })
                }
              />
            )}

            {/* Responsibles */}

            {action && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex cursor-pointer pl-2">
                    {internalAction.responsibles?.length ? (
                      internalAction.responsibles.map((responsible) => {
                        const person = people.find(
                          (p) => responsible === p.user_id,
                        );

                        return (
                          <AvatarPerson
                            key={person?.id}
                            person={person}
                            className="-ml-2 h-8 w-8 border-4 border-background"
                          />
                        );
                      })
                    ) : (
                      <div className="grid h-8 w-8 place-content-center rounded-full bg-card">
                        <UserIcon className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-content">
                  {people.map((person) => (
                    <DropdownMenuCheckboxItem
                      key={person.user_id}
                      checked={
                        (internalAction.responsibles &&
                          internalAction.responsibles?.filter(
                            (r) => r === person.user_id,
                          ).length > 0) ||
                        false
                      }
                      className="menu-item gap-2"
                      onCheckedChange={(checked) => {
                        let responsibles = internalAction.responsibles;
                        if (checked) {
                          if (responsibles)
                            responsibles = [...responsibles, person.user_id];
                          else responsibles = [person.user_id];
                        } else {
                          if (responsibles)
                            responsibles = responsibles.filter(
                              (r) => person.user_id !== r,
                            );
                        }
                        setAction({ ...internalAction, responsibles });
                      }}
                    >
                      <AvatarPerson person={person} className="h-6 w-6" />
                      <span>{person.name}</span>
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          {/* Data e Botão */}
          <div className="col-span-2 flex w-full justify-between gap-1 sm:justify-end">
            <FancyDatetimePicker
              date={internalAction.date}
              onSelect={(value) => {
                setAction({ ...internalAction, date: value });
              }}
            />

            <Button
              type="submit"
              variant={
                isValidAction(internalAction) || busy ? "default" : "ghost"
              }
              size={"sm"}
              // onClick={() => {
              //   action ? updateAction() : createAction();
              // }}
              disabled={!isValidAction(internalAction) || busy}
            >
              {busy ? (
                <Loader2Icon size={16} className="animate-spin" />
              ) : (
                <>
                  {action ? "Atualizar" : "Inserir"}
                  <Check size={16} className="ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

function isValidAction(action: InternalAction) {
  let valid = true;
  if (!action.title) valid = false;
  if (!action.client_id) valid = false;
  if (!action.category_id) valid = false;
  if (!action.date) valid = false;
  if (!action.state_id) valid = false;

  return valid;
}

export function AvatarPerson({
  person,
  className,
}: {
  person?: Person;
  className?: string;
}) {
  const name = person?.name.split(" ");
  return (
    <Avatar className={cn(className)}>
      {person ? (
        <>
          <AvatarImage src={`/${person.image}`} />
          <AvatarFallback className="font-bold">
            {name ? `${name[0][0]}${name[1][0]}` : "!!"}
          </AvatarFallback>
        </>
      ) : (
        <AvatarFallback>??</AvatarFallback>
      )}
    </Avatar>
  );
}
