import { useFetcher, useNavigate } from "@remix-run/react";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "./ui/context-menu";
import { PencilIcon, TrashIcon } from "lucide-react";

export type ActionFull = Action & {
	category: Category;
	state: State;
};

export function ActionLineCalendar({ action }: { action: ActionFull }) {
	const navigate = useNavigate();
	const fetcher = useFetcher();
	const busy = fetcher.state !== "idle";
	return (
		<ContextMenu>
			<ContextMenuTrigger>
				<div
					className={`mb-1 pl-2 border-l-4 border-${
						action.state.slug
					}  py-0.5 text-xs hover:bg-accent bg-card transition cursor-pointer text-slate-500 w-full hover:text-foreground rounded ${
						busy && "opacity-25 scale-95"
					}`}
					onClick={() => {
						navigate(`/dashboard/action/${action.id}`);
					}}
				>
					{action.title}
				</div>
			</ContextMenuTrigger>
			<ContextMenuContent className="bg-foreground/5 border border-foreground/10 backdrop-blur-lg px-0 py-2 ">
				<ContextMenuItem
					className="rounded-none text-xs items-center px-3 py-1.5 focus:bg-primary flex justify-between"
					onSelect={() => {
						navigate(`/dashboard/action/${action.id}`);
					}}
				>
					<div>Editar</div>
					<PencilIcon size={16} />
				</ContextMenuItem>
				<ContextMenuItem
					className="rounded-none text-xs items-center px-3 py-1.5 focus:bg-primary flex justify-between"
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
					<TrashIcon size={16} />
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}
