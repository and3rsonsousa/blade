import Blade from "~/components/structure/blade";
import Login from "~/components/structure/login";

export default function LoginPage() {
	return (
		<div className="grid min-h-screen place-content-center">
			<div className="w-72 flex flex-col gap-8">
				<div className="flex justify-between items-center">
					<Blade className="w-32" />
					<div className="text-slate-500 text-right">
						<div className="font-medium text-sm">ßeta</div>
						<div className="text-xs">23.8.20.1</div>
					</div>
				</div>
				<Login />
			</div>
		</div>
	);
}
