import { useLoaderData } from "@remix-run/react";
import { type LoaderArgs, type V2_MetaFunction } from "@vercel/remix";
import PriorityView from "~/components/priority/priority-view";

import LayoutClient from "~/components/structure/layout-client";
import supabaseServer from "~/lib/supabase.server";

export async function loader({ request, params }: LoaderArgs) {
  const response = new Response();
  const supabase = supabaseServer({ request, response });

  if (params.slug) {
    console.log(params.slug);

    const { data: client } = await supabase
      .from("clients")
      .select("*")
      .eq("slug", params.slug)
      .single();

    const [{ data: actions }, { data: celebrations }] = await Promise.all([
      supabase
        .from("actions")
        .select("*, clients(*), categories(*), states(*)")
        .eq("client_id", client!.id)
        .order("date", { ascending: true }),
      supabase
        .from("celebration")
        .select("*")
        .order("date", { ascending: true }),
    ]);

    return { client, actions, celebrations };
  } else {
    const [{ data: actions }, { data: celebrations }] = await Promise.all([
      supabase
        .from("actions")
        .select("*,clients(*), categories(*), states(*)")
        .order("date", { ascending: true })
        .order("created_at", { ascending: true }),
      supabase
        .from("celebration")
        .select("*")
        .order("date", { ascending: true }),
    ]);

    return { client: null, actions, celebrations };
  }
}

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => [
  {
    title: `${
      data!.client ? data!.client.short.toUpperCase().concat(" / ") : ""
    }Prioridade / ʙʟaᴅe`,
  },
];

export default function ClientID() {
  const { client, actions } = useLoaderData<typeof loader>();
  return (
    <LayoutClient client={client}>
      <PriorityView actions={actions} />
    </LayoutClient>
  );
}
