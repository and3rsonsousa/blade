import { type LoaderArgs, type V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import Calendar from "~/components/calendar/calendar-view";
import LayoutClient from "~/components/structure/layout-client";
import supabaseServer from "~/lib/supabase.server";

export async function loader({ request, params }: LoaderArgs) {
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
			.eq("client_id", client!.id)
			.order("date", { ascending: true });

		return { client, actions };
	}
}

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => [
	{
		title: `${data!.client.short.toUpperCase()} /B`,
	},
];

export default function ClientID() {
	const { client, actions } = useLoaderData<typeof loader>();
	return (
		<LayoutClient client={client}>
			{actions && <Calendar actions={actions} />}
		</LayoutClient>
	);
}
