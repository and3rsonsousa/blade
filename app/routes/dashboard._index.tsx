import { type LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import supabaseServer from "~/lib/supabase.server";

export async function loader({ request }: LoaderArgs) {
	const response = new Response();
	const supabase = supabaseServer({
		request,
		response,
	});
	const { data } = await supabase.from("actions").select();

	return { data };
}

export default function DashboardIndex() {
	const data = useLoaderData();
	return (
		<div>
			<pre>{JSON.stringify(data, undefined, 2)}</pre>
		</div>
	);
}
