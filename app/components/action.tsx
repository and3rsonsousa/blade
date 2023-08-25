import { useNavigate } from "@remix-run/react";

export type ActionFull = Action & {
	category: Category;
	state: State;
};

export function ActionLineCalendar({ action }: { action: ActionFull }) {
	const navigate = useNavigate();
	return (
		<div
			className={`mb-1 pl-2 border-l-4 border-${action.state.slug}  py-0.5 text-xs hover:bg-accent bg-card transition cursor-pointer text-slate-500 w-full hover:text-foreground rounded`}
			onClick={() => {
				navigate(`/dashboard/action/${action.id}`);
			}}
		>
			{action.title}
		</div>
	);
}
