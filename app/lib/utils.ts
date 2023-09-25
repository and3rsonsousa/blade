import { type SupabaseClient } from "@supabase/supabase-js";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { type ActionFull } from "~/components/atoms/action";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function removeTags(str: string) {
	if (str === null || str === "") return "";
	else str = str.toString();
	return str.replace(/(<([^>]+)>)/gi, "");
}

export function getOrderedActions(actions: ActionFull[]) {
	const newActions = actions.sort((a, b) => a.states.order - b.states.order);
	return newActions;
}

export function getGroupedActions(
	actions: ActionFull[],
	categories: Category[]
) {
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

export async function getLoaderActions(supabase: SupabaseClient, slug?: string) {
	if (slug) {
		const { data: client } = await supabase
			.from("clients")
			.select("*")
			.eq("slug", slug)
			.single();

		const [{ data: actions }, { data: celebrations }] = await Promise.all([
			supabase
				.from("actions")
				.select("*, clients(*), categories(*), states(*), priority(*)")
				.eq("client_id", client!.id)
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