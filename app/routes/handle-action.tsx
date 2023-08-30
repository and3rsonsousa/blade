import { type ActionFunction } from "@remix-run/node";
import { formatISO } from "date-fns";
import supabaseServer from "~/lib/supabase.server";

export const action: ActionFunction = async ({ request }) => {
	const formData = await request.formData();
	const actionToHandle = formData.get("action") as string;

	const response = new Response();
	const supabase = supabaseServer({ request, response });
	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (actionToHandle === "create-action") {
		const title = formData.get("title") as string;
		const description = formData.get("description") as string;
		const state_id = Number(formData.get("state"));
		const client_id = Number(formData.get("client"));
		const date = formData.get("date") as string;
		const category_id = Number(formData.get("category"));

		const action = {
			title,
			description,
			state_id,
			client_id,
			date,
			category_id,
			user_id: session?.user.id,
		};

		const { data, error } = await supabase
			.from("actions")
			.insert(action)
			.select()
			.single();

		return { data, error };
	} else if (actionToHandle === "update-action") {
		const id = formData.get("id") as string;
		const title = formData.get("title") as string;
		const description = formData.get("description") as string;
		const state_id = Number(formData.get("state"));
		const client_id = Number(formData.get("client"));
		const date = formData.get("date") as string;
		const category_id = Number(formData.get("category"));
		const updated_at = String(formatISO(new Date()));

		type ActionToUpdate = {
			title: string;
			description: string;
			state_id: number;
			client_id: number;
			date: string;
			category_id: number;
			updated_at: string;
		};

		const action: ActionToUpdate = {
			title,
			description,
			state_id,
			client_id,
			date,
			category_id,
			updated_at,
		};

		Object.keys(action).forEach((key) => {
			if (!action[key as keyof ActionToUpdate]) {
				delete action[key as keyof ActionToUpdate];
			}
		});

		const { data, error } = await supabase
			.from("actions")
			.update(action)
			.eq("id", id)
			.single();

		console.log({ action, id, data, error });
		return { data, error };
	} else if (actionToHandle === "delete-action") {
		const id = formData.get("id") as string;

		const { data, error } = await supabase
			.from("actions")
			.delete()
			.eq("id", id)
			.select()
			.single();

		return { data, error };
	} else if (actionToHandle === "duplicate-action") {
		const id = (await formData.get("id")) as string;
		const { data: action } = await supabase
			.from("actions")
			.select("*")
			.eq("id", id)
			.single();
		if (action) {
			Object.keys(action).forEach((key) => {
				if (["created_at", "updated_at", "id"].find((k) => k === key)) {
					delete action[key as keyof Action];
				}
			});
			const { data, error } = await supabase
				.from("actions")
				.insert(action)
				.select()
				.single();

			return { data, error };
		}
		return {};
	}
};
