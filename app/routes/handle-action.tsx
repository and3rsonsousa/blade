import { type ActionFunction } from "@remix-run/node";
import supabaseServer from "~/lib/supabase.server";

export const action: ActionFunction = async ({ request }) => {
	const data = await request.formData();
	const title = data.get("title") as string;
	const description = data.get("description") as string;
	const state = Number(data.get("state"));
	const client = Number(data.get("client"));
	const date = data.get("date") as string;
	const category = Number(data.get("category"));

	const response = new Response();
	const supabase = supabaseServer({ request, response });
	const {
		data: { session },
	} = await supabase.auth.getSession();

	const action = {
		title,
		description,
		state,
		client,
		date,
		category,
		user_id: session?.user.id,
	};

	const { error } = await supabase.from("actions").insert(action);
	console.log(error);

	return { error };
};
