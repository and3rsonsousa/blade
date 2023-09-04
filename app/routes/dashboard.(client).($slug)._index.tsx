import { useLoaderData } from "@remix-run/react";
import { type LoaderArgs, type V2_MetaFunction } from "@vercel/remix";

import Calendar from "~/components/calendar/calendar-view";
import LayoutClient from "~/components/structure/layout-client";
import supabaseServer from "~/lib/supabase.server";
import { getLoaderActions } from "~/lib/utils";

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => [
  {
    title: `${
      data!.client ? data!.client.short.toUpperCase().concat(" / ") : ""
    }Calendário / ʙʟaᴅe`,
  },
];

export async function loader({ request, params }: LoaderArgs) {
  const response = new Response();
  const supabase = supabaseServer({
    request,
    response,
  });

  const { client, actions, celebrations } = await getLoaderActions(
    supabase,
    params.slug,
  );

  return { client, actions, celebrations };
}

export default function DashboardIndex() {
  const { actions, client, celebrations } = useLoaderData<typeof loader>();

  return (
    <LayoutClient client={client}>
      <Calendar
        actions={actions as Action[]}
        celebrations={celebrations as Celebration[]}
      />
    </LayoutClient>
  );
}
