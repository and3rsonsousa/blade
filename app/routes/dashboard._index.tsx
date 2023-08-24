import { type LoaderArgs, type V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import supabaseServer from "~/lib/supabase.server";
import Calendar from "~/components/calendar/calendar";

export const meta: V2_MetaFunction = () => [
	{
		title: "Blade Dashboard",
	},
];

export async function loader({ request }: LoaderArgs) {
	const response = new Response();
	const supabase = supabaseServer({
		request,
		response,
	});
	const [{ data: actions }] = await Promise.all([
		supabase.from("actions").select("*, category(*), state(*)"),
	]);

	return { actions };
}

export default function DashboardIndex() {
	const { actions } = useLoaderData<typeof loader>();

	return (
		<>
			<Calendar actions={actions as Action[]} />
		</>
	);
}
