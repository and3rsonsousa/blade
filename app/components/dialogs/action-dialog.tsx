import { useFetcher, useMatches } from "@remix-run/react";

import { format, formatDistance, formatISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { CalendarIcon, Check, ClockIcon } from "lucide-react";
import { forwardRef, useEffect, useRef, useState, type ReactNode } from "react";
import { CategoryIcons } from "~/lib/icons";
import useDebounce from "~/lib/useDebounce";
import { cn } from "~/lib/utils";
import Editor from "../editor";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

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
};

export default function ActionDialog({ mode, action }: ActionDialogType) {
	const [internalAction, setAction] = useState<InternalAction>({
		title: action ? action.title : "",
		description: action ? action.description : "",
		client: action ? String(action.client) : "",
		category: action ? String(action.category) : "1",
		state: action ? String(action.state) : "2",
		date: action ? new Date(action.date) : new Date(),
	});
	const [start, setStart] = useState(true);
	const matches = useMatches();
	const fetcher = useFetcher();
	const description = useRef<HTMLDivElement>(null);
	const clientInput = useRef<HTMLButtonElement>(null);
	const { categories, clients, states } = matches[1].data;

	const descriptionDebounce = useDebounce((value) => {
		setAction({ ...internalAction, description: value });
	}, 5000);

	useEffect(() => {
		if (!start && action) {
			updateAction();
		} else {
			setStart(false);
		}
	}, [internalAction]);

	async function createAction() {
		await fetcher.submit(
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
		console.log(fetcher);
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

	const onBlurTitle = (value?: string) => {
		description.current?.focus();
		setAction({ ...internalAction, title: value });
	};
	const onBlurDescription = (value?: string) => {
		if (!action) {
			clientInput.current?.focus();
		}
		setAction({ ...internalAction, description: value });
	};

	return (
		<div className={`${mode === "page" ? "h-full flex flex-col" : ""}`}>
			<div
				className={mode === "page" ? "grow shrink-0 flex flex-col" : ""}
			>
				{/* Título */}
				<div className={`max-sm:p-4  p-8 pb-0 `}>
					{action && (
						<UpdatedTimeClock time={new Date(action.updated_at)} />
					)}
					<FancyInputText
						placeholder="Nome da ação"
						onBlur={onBlurTitle}
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
							onBlur={onBlurDescription}
							onKeyDown={descriptionDebounce}
						/>
					) : (
						<FancyInputText
							placeholder="Descreva sua ação aqui..."
							onBlur={onBlurDescription}
							ref={description}
							max={200}
						/>
					)}
				</div>

				{/* <pre className="text-xs whitespace-pre-wrap">
					{JSON.stringify(internalAction, undefined, 2)}
				</pre> */}
			</div>
			{/* Botões */}
			<div>
				<div className="mt-4 sm:flex grid-cols-2 justify-between border-t py-4 px-2 sm:px-6 gap-4 overflow-hidden">
					{/* Categoria e Cliente */}
					<div className="flex gap-1 justify-between w-full sm:justify-start">
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
					<div className="flex gap-2 justify-between sm:justify-end">
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
							size={"sm"}
							className="items-center"
							onClick={() => {
								createAction();
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
		value?: string;
	}
>(({ placeholder, value, className, max = 70, onBlur, onKeyDown }, ref) => {
	const [visible, setVisible] = useState(!value);
	const [text, setText] = useState(value || "");
	const init = value;

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
});

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
	const [selected, setSelected] = useState(selectedValue);

	return (
		<Select
			value={selected}
			onValueChange={(value) => {
				setSelected(() => value);
				if (onChange) onChange(value);
			}}
		>
			<SelectTrigger
				ref={ref}
				className={`p-2 rounded-sm bg-transparent border-0 h-auto text-xs`}
			>
				{/* {itemContent ? (
					itemContent(
						items.filter((item) => selected === String(item.id))[0]
					)
				) : (
					<SelectValue placeholder={placeholder} />
					)} */}
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent>
				{items.map((item) => (
					<SelectItem
						key={item.id}
						value={String(item.id)}
						className="text-xs px-3"
					>
						{item.title}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
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
	return (
		<div className="text-muted-foreground text-xs items-center flex">
			<ClockIcon className="mr-2" size={12} />

			<div>
				Atualizado{" "}
				{formatDistance(new Date(time), new Date(), {
					locale: ptBR,
					addSuffix: true,
					includeSeconds: true,
				})}
			</div>
		</div>
	);
}
