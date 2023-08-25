import type { ReactNode } from "react";
import Blade from "./blade";
import { Link } from "@remix-run/react";

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<div className="h-screen flex flex-col">
			<div className="p-6">
				<Link to="/dashboard">
					<Blade className="h-4" />
					{/* <img
						src="/blade-240-logo.png"
						className="h-4"
						alt="Blade"
					/> */}
				</Link>
			</div>
			{children}
		</div>
	);
}
