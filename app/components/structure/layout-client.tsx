import { type ReactNode } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Link } from "@remix-run/react";

export default function LayoutClient({
	client,
	children,
}: {
	client: Client;
	children: ReactNode;
}) {
	return (
		<div className="h-full w-full overflow-hidden flex flex-col">
			<div className="px-4 py-3 gap-2 flex items-center border-b">
				<Avatar>
					<AvatarFallback className="text-xs">
						{client.short.toUpperCase()}
					</AvatarFallback>
				</Avatar>
				<Link
					to={`/dashboard/client/${client.slug}`}
					className="m-0 font-semibold text-xl"
				>
					{client.title}
				</Link>
			</div>
			{children}
		</div>
	);
}
