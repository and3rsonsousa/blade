import Blade from "~/components/structure/blade";
import { Button } from "~/components/ui/button";

export default function Index() {
	return (
		<div className="grid min-h-screen place-content-center bg-gradient-to-b from-violet-900/50 via-transparent">
			<div className="text-center">
				<div>
					<Blade className="w-full max-w-[240px]" />
				</div>
				<div className="mt-8">
					<Button>Entrar</Button>
				</div>
			</div>
		</div>
	);
}
