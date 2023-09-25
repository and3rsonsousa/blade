import { useLoaderData } from "@remix-run/react";
import { type LoaderFunctionArgs, type MetaFunction } from "@vercel/remix";
import PriorityView from "~/components/priority/priority-view";

import supabaseServer from "~/lib/supabase.server";
import { getLoaderActions } from "~/lib/utils";

export const config = { runtime: "edge" };

export async function loader({ request, params }: LoaderFunctionArgs) {
  const response = new Response();
  const supabase = supabaseServer({ request, response });

  const { client, actions, celebrations } = await getLoaderActions(
    supabase,
    params.slug,
  );

  return { client, actions, celebrations };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  {
    title: `${
      data!.client ? data!.client.short.toUpperCase().concat(" / ") : ""
    }Prioridade / ʙʟaᴅe`,
  },
];

export default function ClientID() {
  const { actions } = useLoaderData<typeof loader>();
  return <PriorityView actions={actions} />;
}
