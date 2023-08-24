import { type LoaderArgs, redirect, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import Layout from "~/components/structure/layout";
import supabaseServer from "~/lib/supabase.server";

export async function loader({ request }: LoaderArgs) {
	const response = new Response();
	const supabase = supabaseServer({
		request,
		response,
	});

	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session) return redirect("/login", { headers: response.headers });

	const [{ data: categories }] = await Promise.all([
		supabase.from("categories").select("*"),
	]);

	return json({ categories });
}

export default function Dashboard() {
	const { categories } = useLoaderData<typeof loader>();
	return (
		<Layout>
			<Outlet context={{ categories }} />
		</Layout>
	);
}
