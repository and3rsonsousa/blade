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
} from "./ui/context-menu";

export type ActionFull = Action & {
	category: Category;
	state: State;
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
		<ContextMenu>
			<ContextMenuTrigger>
				<div
					className={`mb-1 pl-2 border-l-4 border-${
						action.state.slug
					}  py-1 text-xs hover:bg-muted bg-accent transition cursor-pointer text-muted-foreground w-full border-foreground/5 hover:text-foreground rounded ${
						busy && "opacity-75 scale-95 "
					}`}
					onClick={() => {
						navigate(`/dashboard/action/${action.id}`);
					}}
				>
					{action.title}
				</div>
			</ContextMenuTrigger>
			<ContextMenuContent className="bg-content">
				{action.state.slug !== "finished" && (
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
				<MenuItem onSelect={() => {}}>
					<div>Duplicar</div>
					<CopyIcon size={12} />
				</MenuItem>
				<MenuItem onSelect={() => {}}>
					<div>Adiar</div>
					<ClockIcon size={12} />
				</MenuItem>
				<MenuItem
					onSelect={async () => {
						await fetcher.submit(
							{ action: "delete-action", id: action.id },
							{
								method: "post",
								action: "/handle-action",
							}
						);
					}}
				>
					<div>Deletar</div>
					<TrashIcon size={12} />
				</MenuItem>
				<ContextMenuSeparator />
				<ContextMenuSub>
					<ContextMenuSubTrigger className="menu-item">
						{action.category.title}
					</ContextMenuSubTrigger>
					<ContextMenuPortal>
						<ContextMenuSubContent className="bg-content">
							{categories.map((category) => (
								<MenuItem
									key={category.id}
									onSelect={() => {
										updateAction({
											...action,
											category: category.id,
											state: action.state.id,
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
						{action.state.title}
					</ContextMenuSubTrigger>
					<ContextMenuPortal>
						<ContextMenuSubContent className="bg-content">
							{states.map((state) => (
								<MenuItem
									key={state.id}
									onSelect={() => {
										updateAction({
											...action,
											state: state.id,
											category: action.category.id,
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
	);
}

const MenuItem = ({ ...props }: ContextMenuItemProps) => (
	<ContextMenuItem className="menu-item" {...props} />
);
