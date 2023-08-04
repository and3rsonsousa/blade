import Blade from "~/components/structure/blade";
import Login from "~/components/structure/login";

export default function LoginPage() {
	return (
		<div className="grid min-h-screen place-content-center">
			<div className="w-96 flex flex-col gap-4">
				<Blade className="w-32" />
				<Login />
			</div>
		</div>
	);
}
