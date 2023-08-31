import { useFetcher, useMatches, useParams } from "@remix-run/react";

import { formatISO } from "date-fns";
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
		client_id: action
			? String(action.client_id)
			: client_id
			? client_id
			: "",
		category_id: action ? String(action.category_id) : "1",
		state_id: action ? String(action.state_id) : "2",
		date: action ? new Date(action.date) : date || baseDate,
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
				client_id: internalAction.client_id as string,
				category_id: internalAction.category_id as string,
				state_id: internalAction.state_id as string,
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
											className="w-4 h-4  mr-1"
										/>
									)
								);
							}}
							itemMenu={(item) => {
								return (
									<SelectItem value={String(item.id)}>
										<div className="flex gap-2">
											<CategoryIcons
												id={item.slug}
												className="w-4 h-4"
											/>

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
									<div className="flex gap-2 items-center">
										<div
											className={`border-${item.slug} border-2 h-2 w-2 rounded-full`}
										></div>
										<div>{item.title}</div>
									</div>
								</SelectItem>
							)}
							itemValue={(item) => {
								return (
									item && (
										<div
											className={`border-${item.slug} border-[3px] h-3 w-3 rounded-full mr-1`}
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
					<div className="flex col-span-2 gap-1 w-full justify-between sm:justify-end">
						<FancyDatetimePicker
							date={internalAction.date}
							onSelect={(value) => {
								setAction({ ...internalAction, date: value });
							}}
						/>

						<Button
							variant={
								isValidAction(internalAction) || busy
									? "default"
									: "secondary"
							}
							size={"sm"}
							onClick={() => {
								action ? updateAction() : createAction();
							}}
							disabled={!isValidAction(internalAction) || busy}
						>
							{busy ? (
								<Loader2Icon
									size={16}
									className="animate-spin"
								/>
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
