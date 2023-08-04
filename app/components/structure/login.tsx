import { useOutletContext } from "@remix-run/react";

import { LogIn, LogOut } from "lucide-react";
import type { OutletContextType } from "~/root";
import { Button } from "../ui/button";
import { Input } from "~/components/ui/input";

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
			<Input name="email" />
		</>
	);
}
