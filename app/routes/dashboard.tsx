import { Outlet, useLoaderData } from "@remix-run/react";
import { json, redirect, type LoaderFunctionArgs } from "@vercel/remix";
import Layout from "~/components/structure/layout";
import supabaseServer from "~/lib/supabase.server";

export const config = { runtime: "edge" };

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  const supabase = supabaseServer({
    request,
    response,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return redirect("/login", { headers: response.headers });

  const [
    { data: categories },
    { data: clients },
    { data: states },
    { data: priorities },
    { data: people },
  ] = await Promise.all([
    supabase.from("categories").select("*").order("id", { ascending: true }),
    supabase.from("clients").select("*").order("title", { ascending: true }),
    supabase.from("states").select("*").order("order"),
    supabase.from("priority").select("*").order("order", { ascending: false }),
    supabase.from("people").select("*").order("name", { ascending: true }),
  ]);

  return json({
    categories,
    clients,
    states,
    priorities,
    people,
    user: session.user.id,
  });
}

export default function Dashboard() {
  const context = useLoaderData<typeof loader>();
  return (
    <Layout>
      <Outlet context={{ ...context }} />
    </Layout>
  );
}
