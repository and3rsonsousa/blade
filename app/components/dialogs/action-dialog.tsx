import { useFetcher, useMatches } from "@remix-run/react";

import { format, formatISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { CalendarIcon, Check } from "lucide-react";
import { forwardRef, useRef, useState, type ReactNode } from "react";
import { CategoryIcons } from "~/lib/icons";
import { cn } from "~/lib/utils";
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
	description?: string;
	client?: string;
	category?: string;
	state?: string;
	date: Date;
};

export default function ActionDialog() {
	const [action, setAction] = useState<InternalAction>({
		title: "",
		description: "",
		client: "",
		category: "1",
		state: "2",
		date: new Date(),
	});
	const matches = useMatches();
	const fetcher = useFetcher();

	const description = useRef<HTMLDivElement>(null);
	const category = useRef<HTMLButtonElement>(null);

	const { categories, clients, states } = matches[1].data;

	const onBlurTitle = () => {
		description.current?.focus();
	};
	const onBlurDescription = () => {
		category.current?.focus();
	};
	return (
		<>
			{/* Título */}
			<div className="max-sm:p-4 p-8 pb-0">
				<FancyInputText
					placeholder="Nome da ação"
					onBlur={onBlurTitle}
					className="text-2xl font-semibold"
					onInput={(value) => setAction({ ...action, title: value })}
				/>
			</div>
			{/* Descrição */}
			<div className="text-sm max-sm:px-4 px-8 sm:pt-4">
				<FancyInputText
					placeholder="Descreva sua ação aqui..."
					onBlur={onBlurDescription}
					ref={description}
					max={200}
					onInput={(value) =>
						setAction({ ...action, description: value })
					}
				/>
			</div>
			{/* Botões */}
			<div className="mt-4 sm:flex grid-cols-2 justify-between border-t py-4 px-2 sm:px-6 gap-4 overflow-hidden">
				{/* Categoria e Cliente */}
				<div className="flex gap-1 justify-between">
					<SelectInput
						items={clients}
						placeholder="Cliente"
						onChange={(value) => {
							setAction({ ...action, client: value });
						}}
					/>

					<SelectInput
						ref={category}
						items={categories}
						placeholder="Categoria"
						selectedValue="1"
						itemContent={({ slug }) => {
							return (
								<CategoryIcons id={slug} className="w-4 h-4" />
							);
						}}
						onChange={(value) =>
							setAction({ ...action, category: value })
						}
					/>

					<SelectInput
						items={states}
						placeholder="Status"
						selectedValue="2"
						itemContent={(item) => {
							return (
								<div
									className={`bg-${item.slug} h-3 w-3 rounded-full mr-2`}
								></div>
							);
						}}
						onChange={(value) =>
							setAction({ ...action, state: value })
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
									!action.date && "text-muted-foreground"
								)}
							>
								<CalendarIcon className="mr-2 h-3 w-3" />

								<span className="sm:hidden">
									{action.date
										? format(
												action.date,
												"d 'de' MMMM 'de' Y",
												{
													locale: ptBR,
												}
										  )
										: ""}
								</span>
								<span className="max-sm:hidden">
									{action.date
										? format(action.date, "d/MMM", {
												locale: ptBR,
										  })
										: ""}
								</span>
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0">
							<Calendar
								mode="single"
								selected={action.date}
								onSelect={(value) => {
									setAction({
										...action,
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
							fetcher.submit(
								{
									title: action.title as string,
									description: action.description as string,
									client: action.client as string,
									category: action.category as string,
									state: action.state as string,
									date: formatISO(action.date),
								},
								{
									method: "post",
									action: "/handle-action",
								}
							);
						}}
						disabled={!isValidAction(action)}
					>
						Inserir
						<Check size={16} className="ml-2" />
					</Button>
				</div>
			</div>
		</>
	);
}

const FancyInputText = forwardRef<
	HTMLDivElement,
	{
		placeholder?: string;
		content?: string;
		className?: string;
		max?: number;
		onBlur?: () => void;
		onInput?: (value?: string) => void;
	}
>(({ placeholder, content, className, max = 70, onBlur, onInput }, ref) => {
	const [visible, setVisible] = useState(!content);
	const [text, setText] = useState(content || "");

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
				onKeyDown={(event) => {
					if (event.key === "Enter") {
						console.clear();
						if (onBlur) {
							event.preventDefault();
							onBlur();
						}
					} else if (
						event.currentTarget.innerText.length >= max &&
						event.key !== "Backspace"
					) {
						event.preventDefault();
					}
				}}
			>
				{content}
			</div>
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
				{itemContent ? (
					itemContent(
						items.filter((item) => selected === String(item.id))[0]
					)
				) : (
					<SelectValue placeholder={placeholder} />
				)}
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
