import { type LoaderArgs, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import Calendar from "~/components/calendar/calendar-view";
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
		.eq("slug", params.slug)
		.single();
	if (client) {
		const { data: actions } = await supabase
			.from("actions")
			.select("*, clients(*), categories(*), states(*)")
			.eq("client_id", client.id);

		return { client, actions };
	}

	return {};
};

export default function ClientID() {
	const { client, actions } = useLoaderData<typeof loader>();
	return (
		<div className="h-full w-full overflow-hidden">
			<div>
				<h3 className="px-4 pt-3 m-0">{client.title} </h3>
			</div>
			{actions && <Calendar actions={actions} />}
		</div>
	);
}
