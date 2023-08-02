import { useOutletContext } from "@remix-run/react";

import { LogIn, LogOut } from "lucide-react";
import type { OutletContextType } from "~/root";
import { Button } from "../ui/button";

export default function Login() {
	const { supabase } = useOutletContext<OutletContextType>();

	async function handleLogin() {
		const { error } = await supabase.auth.signInWithPassword({
			email: "and3rsonsousa@outlook.com",
			password: "praninguemsaber",
		});

		if (error) console.log({ error });
	}
	async function handleLogout() {
		const { error } = await supabase.auth.signOut();

		if (error) console.log(error);
	}

	return (
		<>
			<Button size={"icon"} onClick={handleLogin} variant={"secondary"}>
				<LogIn className="w-4 h-4" />
			</Button>
			<Button onClick={handleLogout} variant={"secondary"} size={"icon"}>
				<LogOut className="w-4 h-4" />
			</Button>
		</>
	);
}
