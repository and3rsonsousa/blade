import { redirect, type LoaderArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
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

	return {};
}

export default function Dashboard() {
	return (
		<Layout>
			<Outlet />
		</Layout>
	);
}
