import { type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import ActionDialog from "~/components/dialogs/action-dialog";
import supabaseServer from "~/lib/supabase.server";

export const loader: LoaderFunction = async ({ request, params }) => {
	const response = new Response();
	const supabase = supabaseServer({ request, response });
	const { data: action } = await supabase
		.from("actions")
		.select("*")
		.eq("id", params.id)
		.single();

	return { action };
};

export default function ActionPage() {
	const { action } = useLoaderData<typeof loader>();
	return (
		<div className="w-full mx-auto max-w-xl grow shrink-0 ">
			<ActionDialog mode="page" action={action} />
		</div>
	);
}
