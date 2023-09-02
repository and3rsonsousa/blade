import { Link } from "@remix-run/react";
import { LogInIcon } from "lucide-react";
import Blade from "~/components/structure/blade";
import { Button } from "~/components/ui/button";

export default function Index() {
	return (
		<div className="grid min-h-screen place-content-center">
			<div className="text-center max-w-xs">
				<Blade className="w-32 mx-auto" />

				<div className="my-8">
					Sistema de gestão de ações criado e mantido pela{" "}
					<a
						href="https://agenciacanivete.com.br"
						target="_blank"
						rel="noreferrer"
						className="link"
					>
						aɢêɴᴄɪa ᴄaɴɪᴠeᴛe.
					</a>
				</div>
				<div>
					<Button variant={"default"} asChild>
						<Link to="/dashboard">
							Acessar{" "}
							<LogInIcon size={24} className="ml-2 -mr-1" />
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
