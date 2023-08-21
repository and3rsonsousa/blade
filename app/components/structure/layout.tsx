import type { ReactNode } from "react";
import Blade from "./blade";
import { ScrollArea } from "../ui/scroll-area";

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<div className="h-screen overflow-hidden">
			<div className="p-6">
				<Blade className="h-4" />
			</div>
			<ScrollArea className="h-full">{children}</ScrollArea>
		</div>
	);
}
