export type ActionFull = Action & {
	category: Category;
	state: State;
};

export function ActionLineCalendar({ action }: { action: ActionFull }) {
	return (
		// <div className="mb-1 pl-2 bg-emerald-600 hover:bg-orange-700 py-0.5 text-xs transition cursor-pointer text-orange-50 w-full  rounded-[4px]">
		// 	{action.title}
		// </div>
		<div
			className={`mb-1 pl-2 border-l-4 border-${action.state.slug} hover:border-orange-600 py-0.5 text-xs hover:bg-accent bg-card transition cursor-pointer text-slate-500 w-full hover:text-foreground rounded-[4px]`}
		>
			{action.title}
		</div>
	);
}
