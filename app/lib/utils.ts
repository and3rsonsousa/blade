import { action } from './../routes/handle-action';
import { type SupabaseClient } from "@supabase/supabase-js";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { type ActionFull } from "~/components/atoms/action";
import { TypedSupabaseClient } from "~/root";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function removeTags(str: string) {
	if (str === null || str === "") return "";
	else str = str.toString();
	return str.replace(/(<([^>]+)>)/gi, "");
}

export function getOrderedActions(actions: ActionFull[]) {

	if (actions) {
		const newActions = actions.sort((a, b) => a.states.order - b.states.order);
		return newActions;
	} else {
		throw new Error(
			"'actions' is not valid"
		)

	}

}

export function getActionsByResponsible(actions: ActionFull[], responsibles: Person[]) {

	if (actions) {
		const newActions = actions.filter(action => action.responsibles?.find(responsible => responsibles.find(r => r.user_id === responsible)))
		return newActions;
	} else {
		throw new Error(
			"'actions' is not valid"
		)
	}

}

export function getGroupedActions(
	actions: ActionFull[],
	categories: Category[]
) {

	categories = categories.sort((a, b) => a.priority - b.priority)

	const actionsByCategory = categories.map((category) => ({
		category: category,
		actions: actions.filter((action) => action.category_id === category.id),
	}));

	return actionsByCategory;
}

export function getPrioritizedActions(
	actions: ActionFull[],
	priorities: Priority[]
) {
	const actionsByPriority = priorities.map((priority) => ({
		priority: priority,
		actions: actions.filter((action) => action.priority_id === priority.id),
	}));

	return actionsByPriority;
}

export function getFilteredActions(actions: ActionFull[], filter: string) {
	const newActions = actions.filter(
		(action) => action.categories.slug === filter
	);
	return newActions;
}

export async function getLoaderActions(supabase: TypedSupabaseClient, period: { start: string, end: string }, slug?: string,) {

	if (slug) {

		const { data: client } = await supabase
			.from("clients")
			.select("*")
			.eq("slug", slug)
			.single();

		if (!client) {
			return {};
		}


		const [{ data: actions }, { data: celebrations }] = await Promise.all([
			supabase
				.from("actions")
				.select("*, clients(*), categories(*), states(*), priority(*)")
				.eq("client_id", client.id)
				.gte("date", period.start)
				.lte("date", period.end)
				.order("date", { ascending: true }),
			supabase
				.from("celebration")
				.select("*")
				.order("date", { ascending: true }),
		]);


		return { client, actions, celebrations };
	} else {
		const [{ data: actions }, { data: celebrations }] = await Promise.all([
			supabase
				.from("actions")
				.select("*,clients(*), categories(*), states(*), priority(*)")
				.gte("date", period.start)
				.lte("date", period.end)
				.order("date", { ascending: true })
				.order("created_at", { ascending: true }),
			supabase
				.from("celebration")
				.select("*")
				.order("date", { ascending: true }),
		]);
		return { client: null, actions, celebrations };
	}

}
