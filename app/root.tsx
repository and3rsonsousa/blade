import { json, type LinksFunction, type LoaderArgs } from "@remix-run/node";
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
	useRevalidator,
} from "@remix-run/react";
import { createBrowserClient } from "@supabase/auth-helpers-remix";
import { useEffect, useState } from "react";
import createServerSupabase from "~/lib/supabase.server";

import { type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "db_types";
import styles from "./globals.css";
import { cssBundleHref } from "@remix-run/css-bundle";

type TypedSupabaseClient = SupabaseClient<Database>;
export type OutletContextType = {
	supabase: TypedSupabaseClient;
};

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: styles },
	...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader = async ({ request }: LoaderArgs) => {
	const env = {
		SUPABASE_URL: process.env.SUPABASE_URL,
		SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
	};

	const response = new Response();

	const supabase = createServerSupabase({ request, response });

	const {
		data: { session },
	} = await supabase.auth.getSession();

	return json({ env, session }, { headers: response.headers });
};

export default function App() {
	const { env, session } = useLoaderData<typeof loader>();
	const revalidator = useRevalidator();
	const [supabase] = useState(() =>
		createBrowserClient<Database>(env.SUPABASE_URL!, env.SUPABASE_ANON_KEY!)
	);

	const serverAccessToken = session?.access_token;

	useEffect(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, session) => {
			if (
				event !== "INITIAL_SESSION" &&
				session?.access_token !== serverAccessToken
			) {
				revalidator.revalidate();
			}
		});

		return () => {
			subscription.unsubscribe();
		};
	}, [supabase, serverAccessToken, revalidator]);

	return (
		<html lang="pt-br" className="dark">
			<head>
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="width=device-width,initial-scale=1"
				/>
				<Meta />
				<Links />
			</head>
			<body className="bg-background">
				<Outlet context={{ supabase }} />
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}
