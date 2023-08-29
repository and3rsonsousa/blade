import {
	type V2_MetaFunction,
	type LoaderFunction,
	type LoaderArgs,
	json,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import ActionDialog from "~/components/dialogs/action-dialog";
import supabaseServer from "~/lib/supabase.server";

export const loader: LoaderFunction = async ({
	request,
	params,
}: LoaderArgs) => {
	const response = new Response();
	const supabase = supabaseServer({ request, response });
	const { data: action } = await supabase
		.from("actions")
		.select("*")
		.eq("id", params.id)
		.single();

	return json({ action });
};

export const meta: V2_MetaFunction<typeof loader> = ({ data: { action } }) => [
	{
		title: `${action.title} /B`,
	},
];

export default function ActionPage() {
	const { action } = useLoaderData<typeof loader>();
	return (
		<div className="w-full mx-auto max-w-2xl grow shrink-0 ">
			<ActionDialog mode="page" action={action} />
		</div>
	);
}
