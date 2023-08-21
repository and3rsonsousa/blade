import { useNavigate, useOutletContext } from "@remix-run/react";

import { AlertCircle, Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import type { OutletContextType } from "~/root";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { useState } from "react";
import { Toggle } from "../ui/toggle";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Input } from "../ui/input";

export default function Login() {
	const { supabase } = useOutletContext<OutletContextType>();
	const navigate = useNavigate();
	const [isPasswordVisible, setPasswordVisibility] = useState(false);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState<string | undefined>(undefined);
	const [loginInfo, setLoginInfo] = useState<{
		email: string;
		password: string;
	}>({ email: "", password: "" });

	async function handleLogin() {
		setBusy(true);
		setError(undefined);
		const { error } = await supabase.auth.signInWithPassword({
			...loginInfo,
		});

		setBusy(() => false);

		if (error) {
			setError(error.message);
		} else {
			navigate("/dashboard");
		}
	}

	const PasswordVisibleComponent = isPasswordVisible ? Eye : EyeOff;

	return (
		<div>
			{error && (
				<div className="mb-4">
					<Alert variant={"destructive"}>
						<AlertCircle className="w-4 h-4" />
						<AlertTitle>Erro</AlertTitle>
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				</div>
			)}
			<div className="space-y-2 mb-4">
				<Label htmlFor="email">E-mail</Label>
				<Input
					name="email"
					id="email"
					type="text"
					placeholder="seu@email.com"
					value={loginInfo.email}
					onChange={(event) =>
						setLoginInfo((li) => {
							return { ...li, email: event.target.value };
						})
					}
				/>
			</div>
			<div className="space-y-2 mb-8">
				<Label htmlFor="password">Senha</Label>
				<div className="relative">
					<Input
						name="password"
						id="password"
						type={isPasswordVisible ? "text" : "password"}
						placeholder="Digite sua senha"
						value={loginInfo.password}
						onChange={(event) =>
							setLoginInfo((li) => {
								return { ...li, password: event.target.value };
							})
						}
					/>

					<Toggle
						className="flex-shrink-0 absolute top-0 right-0 rounded-l-none"
						variant={"default"}
						onPressedChange={(pressed) =>
							setPasswordVisibility(pressed)
						}
					>
						<PasswordVisibleComponent className="h-4 w-4" />
					</Toggle>
				</div>
			</div>
			<div className="text-right">
				<Button
					onClick={handleLogin}
					disabled={busy}
					className="max-sm:w-full"
				>
					<span>Entrar</span>
					{busy ? (
						<Loader2 className="h-4 w-4 ml-2 animate-spin" />
					) : (
						<LogIn className="h-4 w-4 ml-2" />
					)}
				</Button>
			</div>
		</div>
	);
}
