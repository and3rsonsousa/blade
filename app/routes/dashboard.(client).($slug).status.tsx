import { useLoaderData } from "@remix-run/react";
import { type LoaderArgs, type V2_MetaFunction } from "@vercel/remix";

import StatusView from "~/components/status/status-view";
import LayoutClient from "~/components/structure/layout-client";
import supabaseServer from "~/lib/supabase.server";
import { getLoaderActions } from "~/lib/utils";

export async function loader({ request, params }: LoaderArgs) {
  const response = new Response();
  const supabase = supabaseServer({ request, response });

  const { client, actions, celebrations } = await getLoaderActions(
    supabase,
    params.slug,
  );

  return { client, actions, celebrations };
}

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => [
  {
    title: `${
      data!.client ? data!.client.short.toUpperCase().concat(" / ") : ""
    }Status / ʙʟaᴅe`,
  },
];

export default function ClientID() {
  const { client, actions } = useLoaderData<typeof loader>();
  return (
    <LayoutClient client={client}>
      <StatusView actions={actions} />
    </LayoutClient>
  );
}
