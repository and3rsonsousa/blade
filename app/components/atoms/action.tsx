import { type ContextMenuItemProps } from "@radix-ui/react-context-menu";
import { useFetcher, useMatches, useNavigate } from "@remix-run/react";
import { ClockIcon, CopyIcon, PencilIcon, TrashIcon } from "lucide-react";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuPortal,
	ContextMenuSeparator,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuTrigger,
} from "../ui/context-menu";
import { removeTags } from "~/lib/utils";
import { motion } from "framer-motion";

export type ActionFull = Action & {
	clients: Client;
	categories: Category;
	states: State;
};

export function ActionLineCalendar({ action }: { action: ActionFull }) {
	const navigate = useNavigate();
	const fetcher = useFetcher();
	const busy = fetcher.state !== "idle";

	const matches = useMatches();
	const { categories, states }: { categories: Category[]; states: State[] } =
		matches[1].data;

	async function updateAction(values: {}) {
		await fetcher.submit(
			{ action: "update-action", ...values },
			{
				method: "post",
				action: "/handle-action",
			}
		);
	}

	return (
		<motion.div
			layout
			initial={{ opacity: 0, scale: 0.8 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.8 }}
			transition={{ duration: 0.4 }}
		>
			<ContextMenu>
				<ContextMenuTrigger>
					<div
						className={`mb-1 px-2 border-l-4 border-${
							action.states.slug
						}  py-1 text-xs hover:bg-muted bg-accent transition cursor-pointer text-muted-foreground w-full border-foreground/5 hover:text-foreground rounded flex gap-1 ${
							busy && "opacity-50"
						}`}
						onClick={() => {
							navigate(`/dashboard/action/${action.id}`);
						}}
					>
						<div className="text-ellipsis w-full shrink overflow-hidden whitespace-nowrap">
							{removeTags(action.title)}
						</div>
						<div className="uppercase text-[8px] opacity-75">
							{action.clients.short}
						</div>
					</div>
				</ContextMenuTrigger>
				<ContextMenuContent className="bg-content mx-2">
					{action.states.slug !== "finished" && (
						<>
							<MenuItem>
								<div>Concluído</div>
								<div className="w-2 h-2 rounded-full bg-finished"></div>
							</MenuItem>
							<ContextMenuSeparator />
						</>
					)}
					<MenuItem
						onSelect={() => {
							navigate(`/dashboard/action/${action.id}`);
						}}
					>
						<div>Editar</div>
						<PencilIcon size={12} />
					</MenuItem>
					<MenuItem
						onSelect={() => {
							fetcher.submit(
								{ id: action.id, action: "duplicate-action" },
								{ action: "/handle-action", method: "POST" }
							);
						}}
					>
						<div>Duplicar</div>
						<CopyIcon size={12} />
					</MenuItem>
					<MenuItem onSelect={() => {}}>
						<div>Adiar</div>
						<ClockIcon size={12} />
					</MenuItem>
					<MenuItem
						onSelect={async () => {
							if (confirm("Deseja deletar essa ação?")) {
								await fetcher.submit(
									{ action: "delete-action", id: action.id },
									{
										method: "post",
										action: "/handle-action",
									}
								);
							}
						}}
					>
						<div>Deletar</div>
						<TrashIcon size={12} />
					</MenuItem>
					<ContextMenuSeparator />
					<ContextMenuSub>
						<ContextMenuSubTrigger className="menu-item">
							{action.categories.title}
						</ContextMenuSubTrigger>
						<ContextMenuPortal>
							<ContextMenuSubContent className="bg-content">
								{categories.map((category) => (
									<MenuItem
										key={category.id}
										onSelect={() => {
											updateAction({
												...action,
												category_id: category.id,
												state_id: action.state_id,
											});
										}}
									>
										{category.title}
									</MenuItem>
								))}
							</ContextMenuSubContent>
						</ContextMenuPortal>
					</ContextMenuSub>
					<ContextMenuSub>
						<ContextMenuSubTrigger className="menu-item">
							{action.states.title}
						</ContextMenuSubTrigger>
						<ContextMenuPortal>
							<ContextMenuSubContent className="bg-content">
								{states.map((state) => (
									<MenuItem
										key={state.id}
										onSelect={() => {
											updateAction({
												...action,
												state_id: state.id,
												category_id: action.category_id,
											});
										}}
									>
										{state.title}
									</MenuItem>
								))}
							</ContextMenuSubContent>
						</ContextMenuPortal>
					</ContextMenuSub>
					<ContextMenuSeparator />
				</ContextMenuContent>
			</ContextMenu>
		</motion.div>
	);
}

const MenuItem = ({ ...props }: ContextMenuItemProps) => (
	<ContextMenuItem className="menu-item" {...props} />
);
