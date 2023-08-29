import { useFetcher, useMatches } from "@remix-run/react";

import { format, formatDistance, formatISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import {
	CalendarIcon,
	Check,
	CheckCircle2Icon,
	ChevronsUpDownIcon,
	ClockIcon,
	FrownIcon,
	Loader2Icon,
} from "lucide-react";
import { forwardRef, useEffect, useRef, useState, type ReactNode } from "react";
import { CategoryIcons } from "~/lib/icons";
import { cn, removeTags } from "~/lib/utils";
import Editor from "../editor";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

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
				<div className="mt-4 sm:grid grid-cols-5 justify-between border-t py-4 px-2 sm:px-6 gap-4 overflow-hidden">
					{/* Categoria e Cliente */}
					<div className="flex gap-1 justify-between w-full sm:justify-start col-span-3">
						<SelectInput
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

						<SelectInput
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

						<SelectInput
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

const FancyInputText = forwardRef<
	HTMLDivElement,
	{
		placeholder?: string;
		className?: string;
		max?: number;
		onBlur?: (value?: string) => void;
		onKeyDown?: (value?: string) => void;
		onInput?: (value?: string) => void;
		value?: string;
	}
>(
	(
		{ placeholder, value, className, max = 70, onBlur, onKeyDown, onInput },
		ref
	) => {
		const [visible, setVisible] = useState(!value);
		const [text, setText] = useState(value || "");
		const init = value;
		const onPaste = async (event: ClipboardEvent) => {
			const data = await navigator.clipboard.readText();
			navigator.clipboard.writeText(data);
		};

		useEffect(() => {
			window.addEventListener("paste", onPaste);
		}, []);

		return (
			<div className="relative">
				<div
					className={cn([
						"bg-transparent outline-none w-full",
						className,
					])}
					ref={ref}
					contentEditable="true"
					onInput={(event) => {
						setVisible(event.currentTarget.innerText === "");
						setText(event.currentTarget.innerHTML);
						if (onInput) {
							onInput(event.currentTarget.innerHTML);
						}
					}}
					tabIndex={0}
					onBlur={(event) => {
						if (onBlur) {
							onBlur(event.currentTarget.innerHTML);
						}
					}}
					onKeyDown={(event) => {
						if (onKeyDown) {
							onKeyDown(event.currentTarget.innerHTML);
						}
						if (event.key === "Enter") {
							event.preventDefault();
							event.currentTarget.blur();
						} else if (
							event.currentTarget.innerText.length >= max &&
							event.key !== "Backspace"
						) {
							event.preventDefault();
						}
					}}
					dangerouslySetInnerHTML={{ __html: init as string }}
				></div>
				{text.length > max - 30 && (
					<div
						className={`${
							text.length > max - 10
								? "text-rose-700"
								: text.length > max - 30
								? "text-yellow-600"
								: ""
						} text-[10px] absolute -bottom-4 right-0`}
					>
						{text.length - max}
					</div>
				)}
				{visible && (
					<div
						className={cn([
							"absolute pointer-events-none top-1/2 -translate-y-1/2 text-slate-500/50",
							className,
						])}
					>
						{placeholder}
					</div>
				)}
			</div>
		);
	}
);

const SelectInput = forwardRef<
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
			? list.filter((item) => item.id.toString() === selectedValue)[0]
					.value
			: ""
	);
	const [open, setOpen] = useState(false);
	console.log({ list });

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant={"ghost"}
					size={"sm"}
					className="overflow-hidden"
				>
					<div className="w-full text-xs text-ellipsis overflow-hidden whitespace-nowrap">
						{selected
							? list.find((item) => item.value === selected)
									?.label
							: placeholder}
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

					<CommandEmpty className="text-left flex justify-center gap-2 items-center">
						<div>
							<FrownIcon size={24} />
						</div>
						<div>Nenhuma opção foi encontrada</div>
					</CommandEmpty>
					<CommandGroup className="p-0">
						{list.map((item) => (
							<CommandItem
								className="bg-transparent rounded-none aria-selected:bg-foreground/20"
								key={item.value}
								onSelect={(value) => {
									if (value !== selected) {
										setSelected(value);
										if (onChange)
											onChange(item.id.toString());
									}
									setOpen(false);
								}}
								value={item.value}
							>
								<CheckCircle2Icon
									className={cn(
										"mr-2 h-4 w-4",
										selected === item.value
											? "opacity-100"
											: "opacity-0"
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

FancyInputText.displayName = "FancyInputText";
SelectInput.displayName = "SelectInput";

function isValidAction(action: InternalAction) {
	let valid = true;
	if (!action.title) valid = false;
	if (!action.client) valid = false;
	if (!action.category) valid = false;
	if (!action.date) valid = false;
	if (!action.state) valid = false;

	return valid;
}

function UpdatedTimeClock({ time }: { time: Date }) {
	const [text, setText] = useState(
		formatDistance(new Date(time), new Date(), {
			locale: ptBR,
			addSuffix: true,
			includeSeconds: true,
		})
	);
	useEffect(() => {
		const interval = setInterval(() => {
			setText(() =>
				formatDistance(new Date(time), new Date(), {
					locale: ptBR,
					addSuffix: true,
					includeSeconds: true,
				})
			);
		}, 1000);

		return () => clearInterval(interval);
	}, [time]);
	return (
		<div className="text-muted-foreground text-xs items-center flex">
			<ClockIcon className="mr-2" size={12} />

			<div>Atualizado {text}</div>
		</div>
	);
}

const CmdEnter = function ({ fn }: { fn: () => void }) {
	useEffect(() => {
		console.clear();

		const listener = (event: KeyboardEvent) => {
			if (event.metaKey && event.key === "Enter") {
				fn();
			}
		};
		window.addEventListener("keydown", listener);
		return () => window.removeEventListener("keydown", listener);
	}, []);
	return <></>;
};
