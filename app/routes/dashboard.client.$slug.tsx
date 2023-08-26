import { type LoaderArgs, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import supabaseServer from "~/lib/supabase.server";

export const loader: LoaderFunction = async ({
	request,
	params,
}: LoaderArgs) => {
	const response = new Response();
	const supabase = supabaseServer({ request, response });

	const { data: client } = await supabase
		.from("clients")
		.select("*")
		.eq("slug", params.slug);

	return { client };
};

export default function ClientID() {
	const { client } = useLoaderData();
	return (
		<div>
			<pre>{JSON.stringify(client, undefined, 2)}</pre>
		</div>
	);
}
