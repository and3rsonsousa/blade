import { type ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
	const data = await request.formData();
	const title = data.get("title") as string;
	const description = data.get("description") as string;
	const states = data.get("states") as string;
	const client = data.get("client") as string;
	const date = data.get("date") as string;
	const category = data.get("category") as string;

	console.log({ title, description, states, client, date, category });

	return {};
};
