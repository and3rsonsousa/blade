import { type V2_MetaFunction, type LoaderArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import Calendar from "~/components/calendar/calendar-view";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
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
			.eq("client_id", client!.id);

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
		<div className="h-full w-full overflow-hidden">
			<div className="px-4 pt-3 gap-2 flex items-center">
				<Avatar>
					<AvatarFallback className="text-xs">
						{client.short.toUpperCase()}
					</AvatarFallback>
				</Avatar>
				<Link
					to={`/dashboard/${client.slug}`}
					className="m-0 font-semibold text-xl"
				>
					{client.title}
				</Link>
			</div>
			{actions && <Calendar actions={actions} />}
		</div>
	);
}
