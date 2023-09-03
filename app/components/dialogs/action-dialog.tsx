import { useFetcher, useMatches, useParams } from "@remix-run/react";

import { formatISO, parseISO } from "date-fns";
import { Check, Loader2Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CategoryIcons } from "~/lib/icons";
import { removeTags } from "~/lib/utils";
import UpdatedTimeClock from "../atoms/update-time-clock";

import FancySelectInput from "~/components/atoms/fancy-select";
import CmdEnter from "../atoms/cmdenter";
import Editor from "../atoms/editor";
import FancyDatetimePicker from "../atoms/fancy-datetime";
import FancyInputText from "../atoms/fancy-input";
import { Button } from "../ui/button";
import { SelectItem } from "../ui/select";
import { ScrollArea } from "../ui/scroll-area";

export type InternalAction = {
  title?: string;
  description?: string | null;
  client_id?: string;
  category_id?: string;
  state_id?: string;
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
  const baseDate = new Date();
  baseDate.setHours(11, 12);
  const matches = useMatches();
  const fetcher = useFetcher();
  const { categories, clients, states } = matches[1].data;
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
    date: action ? parseISO(action.date) : date || baseDate,
  });

  const description = useRef<HTMLDivElement>(null);
  const clientInput = useRef<HTMLButtonElement>(null);

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
        date: formatISO(internalAction.date),
      },
      {
        method: "post",
        action: "/handle-action",
      },
    );
  }

  return (
    <div
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
            onBlur={(value) => {
              setAction({
                ...internalAction,
                title: removeTags(value!),
              });
            }}
            placeholder="Nome da ação"
            className={
              action
                ? `text-6xl font-bold tracking-tighter`
                : `text-2xl font-semibold`
            }
            value={internalAction.title}
          />
        </div>
        {/* Descrição */}
        <div className="grow overflow-hidden px-8 text-sm max-sm:px-4 sm:pt-4">
          {action ? (
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
          ) : (
            <FancyInputText
              placeholder="Descreva sua ação aqui..."
              onBlur={(value) => {
                setAction({
                  ...internalAction,
                  description: removeTags(value!),
                });
              }}
              ref={description}
              max={200}
            />
          )}
        </div>
      </div>
      {/* Botões */}
      <div className="shrink-0">
        <div className="mt-4 grid-cols-5 justify-between gap-4 overflow-hidden border-t border-foreground/10 px-2 py-4 sm:grid sm:px-6">
          {/* Categoria e Cliente */}
          <div className="col-span-3 flex w-full justify-between gap-1 sm:justify-start">
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
              ref={clientInput}
            />

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
                  <SelectItem value={String(item.id)}>
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

            <FancySelectInput
              items={states}
              placeholder="Status"
              selectedValue={internalAction.state_id}
              itemMenu={(item) => (
                <SelectItem value={String(item.id)}>
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
              variant={
                isValidAction(internalAction) || busy ? "default" : "secondary"
              }
              size={"sm"}
              onClick={() => {
                action ? updateAction() : createAction();
              }}
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
    </div>
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
