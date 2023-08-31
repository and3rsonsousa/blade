import { type SerializeFrom } from "@remix-run/node";
import { useMatches, useRouteLoaderData } from "@remix-run/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { type ActionFull } from "~/components/atoms/action";
import { type loader as rootLoader } from "~/root";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
// Remix theme utils below
export function useRequestInfo() {
	const data = useRouteLoaderData("root") as SerializeFrom<typeof rootLoader>;
	return data.requestInfo;
}

export function useHints() {
	const requestInfo = useRequestInfo();
	return requestInfo.hints;
}

export enum Theme {
	DARK = "dark",
	LIGHT = "light",
	SYSTEM = "system",
}

export const themes: Array<Theme> = Object.values(Theme);

export function isTheme(value: unknown): value is Theme {
	return typeof value === "string" && themes.includes(value as Theme);
}

export function removeTags(str: string) {
	if (str === null || str === "") return "";
	else str = str.toString();
	return str.replace(/(<([^>]+)>)/gi, "");
}

export function useOrderedActions(actions: ActionFull[]) {
	const newActions = actions.sort((a, b) => a.states.order - b.states.order);
	return newActions;
}

export function useGroupedActions(actions: ActionFull[]) {
	const { categories }: { categories: Category[] } = useMatches()[1].data;

	const actionsByCategory = categories.map((category) => ({
		category: category,
		actions: actions.filter((action) => action.category_id === category.id),
	}));

	return actionsByCategory;
}
