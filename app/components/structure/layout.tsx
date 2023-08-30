import {
	Link,
	useMatches,
	useNavigate,
	useOutletContext,
	useParams,
} from "@remix-run/react";
import {
	ChevronsLeft,
	ChevronsRight,
	MenuIcon,
	PlusIcon,
	UserIcon,
} from "lucide-react";
import { useState, type ReactNode, useEffect } from "react";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Blade from "./blade";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import ActionDialog from "../dialogs/action-dialog";

export default function Layout({ children }: { children: ReactNode }) {
	const { user }: { user: Person } = useOutletContext();
	const matches = useMatches();
	const params = useParams();
	const navigate = useNavigate();
	const [open, setOpen] = useState(true);
	const [openActionDialog, setOpenActionDialog] = useState(false);

	const slug = params["slug"];
	const { clients }: { clients: Client[] } = matches[1].data;

	useEffect(() => {
		const keyDown = (event: KeyboardEvent) => {
			if (event.metaKey && event.shiftKey) {
				if (event.key === "a") setOpenActionDialog(true);
				if (event.key === "b") setOpen((value) => !value);
			}
		};
		window.addEventListener("keydown", keyDown);

		return () => window.removeEventListener("keydown", keyDown);
	}, []);

	return (
		<div className="h-screen w-screen flex flex-col md:flex-row">
			<div
				className={`${
					open ? "md:w-48" : "md:w-16"
				} shrink-0 max-md:border-b md:border-r flex  max-md:items-center md:flex-col justify-between`}
			>
				<div
					className={`${
						open ? "flex" : ""
					} justify-between relative items-center`}
				>
					<Link
						to="/dashboard"
						className={`block ${
							open ? "p-6" : "p-6 pb-1"
						} grow-0 shrink`}
					>
						{open ? (
							<Blade className="h-4" />
						) : (
							<img
								src="/icon-3.png"
								alt="Blade Icon"
								className="w-8"
							/>
						)}
					</Link>
					<Button
						size={"icon"}
						variant={open ? "ghost" : "outline"}
						className={`h-8 w-8 mr-2 ml-4 ${
							!open && "absolute top-4 -right-6"
						}`}
						onClick={() => setOpen(!open)}
					>
						{open ? (
							<ChevronsLeft size={24} />
						) : (
							<ChevronsRight size={24} />
						)}
					</Button>
				</div>
				<div className="md:hidden">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant={"ghost"}
								size={"icon"}
								className="mr-2"
							>
								<MenuIcon />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="mr-2 bg-content">
							<DropdownMenuLabel className="px-3 uppercase tracking-wide">
								Clientes
							</DropdownMenuLabel>
							{clients.map((client) => (
								<DropdownMenuItem
									key={client.id}
									onSelect={() =>
										navigate(
											`/dashboard/client/${client.slug}`
										)
									}
									className={`menu-item`}
								>
									{client.title}
								</DropdownMenuItem>
							))}

							<DropdownMenuSeparator className="bg-foreground/10" />
							<DropdownMenuItem>Minha Conta</DropdownMenuItem>
							<DropdownMenuItem>Lixeira</DropdownMenuItem>
							<DropdownMenuItem>Sair</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				<div className="hidden grow shrink-0 md:flex flex-col justify-between">
					<div
						className={`flex flex-col gap-2 text-xs ${
							open ? "px-2" : "px-1"
						} font-medium text-muted-foreground`}
					>
						{clients.map((client) => (
							<Link
								key={client.id}
								to={`/dashboard/client/${client.slug}`}
								className={`${
									open
										? "px-3"
										: "px-1 text-center uppercase text-[10px] font-semibold"
								} py-2 hover:bg-accent hover:text-accent-foreground transition rounded-sm overflow-hidden text-ellipsis whitespace-nowrap ${
									slug === client.slug
										? "bg-muted text-foreground"
										: ""
								}`}
							>
								{open ? client.title : client.short}
							</Link>
						))}
					</div>
					<div className="p-3">
						<Button
							className="w-full"
							size={"sm"}
							variant={"ghost"}
						>
							Busca
						</Button>
						<div className="flex gap-2 items-center px-3 py-2">
							<UserIcon size={16} />
							<div className="text-xs whitespace-nowrap text-ellipsis overflow-hidden">
								{user.name}
							</div>
						</div>
					</div>
					{/* <motion.svg
						width="100"
						height="100"
						viewBox="0 0 100 100"
						className=" -rotate-90 w-8 h-8"
					>
						<motion.circle
							fill="transparent"
							className={"text-slate-900"}
							cx="50"
							cy="50"
							r="45"
							strokeLinecap="round"
							stroke="currentColor"
							pathLength={"0.1"}
							strokeWidth={10}
							initial={{ pathLength: 0 }}
							animate={{ pathLength: 1 }}
						/>
						<motion.circle
							fill="transparent"
							className={"text-emerald-500"}
							cx="50"
							cy="50"
							r="45"
							strokeLinecap="round"
							stroke="currentColor"
							pathLength={"0.1"}
							strokeWidth={10}
							initial={{ pathLength: 0 }}
							animate={{ pathLength: 0.87 }}
						/>
						<motion.circle
							fill="transparent"
							className={"text-yellow-500"}
							cx="50"
							cy="50"
							r="45"
							strokeLinecap="round"
							stroke="currentColor"
							pathLength={"0.1"}
							strokeWidth={10}
							initial={{ pathLength: 0 }}
							animate={{ pathLength: 0.61 }}
						/>
						<motion.circle
							fill="transparent"
							className={"text-red-600"}
							cx="50"
							cy="50"
							r="45"
							strokeLinecap="round"
							stroke="currentColor"
							pathLength={"0.1"}
							strokeWidth={10}
							initial={{ pathLength: 0 }}
							animate={{ pathLength: 0.37 }}
						/>
						<motion.circle
							fill="transparent"
							className={"text-primary"}
							cx="50"
							cy="50"
							r="45"
							strokeLinecap="round"
							stroke="currentColor"
							pathLength={"0.1"}
							strokeWidth={10}
							initial={{ pathLength: 0 }}
							animate={{ pathLength: 0.2 }}
						/>
					</motion.svg> */}
				</div>
			</div>

			{children}

			<div className="fixed bottom-6 right-4">
				<Popover
					open={openActionDialog}
					onOpenChange={setOpenActionDialog}
				>
					<PopoverTrigger asChild>
						<Button size={"icon"} className="rounded-full">
							<PlusIcon />
						</Button>
					</PopoverTrigger>
					<PopoverContent
						className="w-[86vw] sm:w-[540px] bg-content"
						align="end"
						sideOffset={16}
						alignOffset={0}
					>
						<ActionDialog
							closeDialog={() => setOpenActionDialog(false)}
						/>
					</PopoverContent>
				</Popover>
			</div>
		</div>
	);
}
