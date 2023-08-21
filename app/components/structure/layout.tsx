import type { ReactNode } from "react";
import Blade from "./blade";

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<div className="h-screen flex flex-col">
			<div className="p-6">
				<Blade className="h-4" />
			</div>
			{children}
		</div>
	);
}
