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
		const state = Number(formData.get("state"));
		const client = Number(formData.get("client"));
		const date = formData.get("date") as string;
		const category = Number(formData.get("category"));

		const action = {
			title,
			description,
			state,
			client,
			date,
			category,
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
		const state = Number(formData.get("state"));
		const client = Number(formData.get("client"));
		const date = formData.get("date") as string;
		const category = Number(formData.get("category"));
		const updated_at = String(formatISO(new Date()));

		const action = {
			title,
			description,
			state,
			client,
			date,
			category,
			updated_at,
		};

		const { error } = await supabase
			.from("actions")
			.update(action)
			.eq("id", id)
			.single();

		console.log(error, action, formData.get("state"));

		return { error };
	} else if (actionToHandle === "delete-action") {
		const id = formData.get("id") as string;

		const { error } = await supabase.from("actions").delete().eq("id", id);

		return { error };
	}
};
