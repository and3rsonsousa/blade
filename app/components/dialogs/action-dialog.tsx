import { useFetcher, useMatches } from "@remix-run/react";

import { format, formatISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { CalendarIcon, Check, Loader2Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CategoryIcons } from "~/lib/icons";
import { cn, removeTags } from "~/lib/utils";
import UpdatedTimeClock from "../atoms/update-time-clock";

import CmdEnter from "../atoms/cmdenter";
import Editor from "../atoms/editor";
import FancyInputText from "../atoms/fancy-input";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import FancySelectInput from "~/components/atoms/fancy-select";

type InternalAction = {
	title?: string;
	description?: string | null;
	client?: string | null;
	category?: string;
	state?: string;
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
	const [internalAction, setAction] = useState<InternalAction>({
		title: action ? action.title : "",
		description: action ? action.description : "",
		client: action ? String(action.client) : "",
		category: action ? String(action.category) : "1",
		state: action ? String(action.state) : "2",
		date: action ? new Date(action.date) : date || new Date(),
	});

	const matches = useMatches();
	const fetcher = useFetcher();
	const description = useRef<HTMLDivElement>(null);
	const clientInput = useRef<HTMLButtonElement>(null);
	const { categories, clients, states } = matches[1].data;

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
				client: internalAction.client as string,
				category: internalAction.category as string,
				state: internalAction.state as string,
				date: formatISO(internalAction.date),
			},
			{
				method: "post",
				action: "/handle-action",
			}
		);
	}

	function updateAction() {
		fetcher.submit(
			{
				action: "update-action",
				id: action?.id as string,
				title: internalAction.title as string,
				description: internalAction.description as string,
				client: internalAction.client as string,
				category: internalAction.category as string,
				state: internalAction.state as string,
				date: formatISO(internalAction.date),
			},
			{
				method: "post",
				action: "/handle-action",
			}
		);
	}

	return (
		<div className={`${mode === "page" ? "h-full flex flex-col" : ""}`}>
			<CmdEnter
				fn={
					isValidAction(internalAction)
						? action
							? updateAction
							: createAction
						: () => {
								console.log(internalAction);
								alert("Ação inválida");
						  }
				}
			/>
			<div
				className={mode === "page" ? "grow shrink-0 flex flex-col" : ""}
			>
				{/* Título */}
				<div className={`max-sm:p-4  p-8 pb-0 `}>
					{action &&
						(busy ? (
							<div>
								<Loader2Icon
									size={16}
									className="animate-spin text-primary"
								/>
							</div>
						) : (
							<UpdatedTimeClock
								time={new Date(action.updated_at)}
							/>
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
				<div className="text-sm max-sm:px-4 shrink-0 grow px-8 sm:pt-4">
					{action ? (
						<Editor
							content={action.description as string}
							onBlur={(value) =>
								setAction({
									...internalAction,
									description: value,
								})
							}
						/>
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
			<div>
				<div className="mt-4 sm:grid grid-cols-5 justify-between border-t border-foreground/10 py-4 px-2 sm:px-6 gap-4 overflow-hidden">
					{/* Categoria e Cliente */}
					<div className="flex gap-1 justify-between w-full sm:justify-start col-span-3">
						<FancySelectInput
							items={clients}
							placeholder="Cliente"
							onChange={(value) => {
								setAction({ ...internalAction, client: value });
							}}
							selectedValue={
								action
									? (internalAction.client as string)
									: undefined
							}
							ref={clientInput}
						/>

						<FancySelectInput
							items={categories}
							placeholder="Categoria"
							selectedValue={
								action
									? (internalAction.category as string)
									: "1"
							}
							itemContent={({ slug }) => {
								return (
									<CategoryIcons
										id={slug}
										className="w-4 h-4"
									/>
								);
							}}
							onChange={(value) =>
								setAction({
									...internalAction,
									category: value,
								})
							}
						/>

						<FancySelectInput
							items={states}
							placeholder="Status"
							selectedValue={
								action ? (internalAction.state as string) : "2"
							}
							itemContent={(item) => {
								return (
									<div
										className={`bg-${item.slug} h-3 w-3 rounded-full mr-2`}
									></div>
								);
							}}
							onChange={(value) =>
								setAction({ ...internalAction, state: value })
							}
						/>
					</div>
					{/* Data e Botão */}
					<div className="flex col-span-2 gap-2 w-full justify-between sm:justify-end">
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant={"ghost"}
									size={"sm"}
									className={cn(
										"justify-start text-xs text-left font-normal",
										!internalAction.date &&
											"text-muted-foreground"
									)}
								>
									<CalendarIcon className="mr-2 h-3 w-3" />

									<span className="sm:hidden">
										{internalAction.date
											? format(
													internalAction.date,
													"d 'de' MMMM 'de' Y",
													{
														locale: ptBR,
													}
											  )
											: ""}
									</span>
									<span className="max-sm:hidden">
										{internalAction.date
											? format(
													internalAction.date,
													"d/MMM",
													{
														locale: ptBR,
													}
											  )
											: ""}
									</span>
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0">
								<Calendar
									mode="single"
									selected={internalAction.date}
									onSelect={(value) => {
										setAction({
											...internalAction,
											date: value as Date,
										});
									}}
									initialFocus
								/>
							</PopoverContent>
						</Popover>

						<Button
							variant={
								isValidAction(internalAction)
									? "default"
									: "secondary"
							}
							size={"sm"}
							onClick={() => {
								action ? updateAction() : createAction();
							}}
							disabled={!isValidAction(internalAction)}
						>
							{action ? "Atualizar" : "Inserir"}
							<Check size={16} className="ml-2" />
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
	if (!action.client) valid = false;
	if (!action.category) valid = false;
	if (!action.date) valid = false;
	if (!action.state) valid = false;

	return valid;
}
