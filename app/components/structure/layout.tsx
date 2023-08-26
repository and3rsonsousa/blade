import { Link, useMatches, useNavigate } from "@remix-run/react";
import { MenuIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Blade from "./blade";

export default function Layout({ children }: { children: ReactNode }) {
	const matches = useMatches();
	const navigate = useNavigate();
	const { clients }: { clients: Client[] } = matches[1].data;
	return (
		<div className="h-screen flex flex-col md:flex-row">
			<div className="md:w-48 shrink-0 max-md:border-b md:border-r flex items-center justify-between">
				<Link to="/dashboard" className="block p-6">
					<Blade className="h-4" />
				</Link>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant={"ghost"} size={"sm"}>
							<MenuIcon />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						{clients.map((client) => (
							<DropdownMenuItem
								key={client.id}
								onSelect={() =>
									navigate(`/dashboard/client/${client.slug}`)
								}
								className={``}
							>
								{client.title}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{children}
		</div>
	);
}
