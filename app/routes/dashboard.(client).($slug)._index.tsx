import { useLoaderData } from "@remix-run/react";
import { type LoaderFunctionArgs, type MetaFunction } from "@vercel/remix";

import Calendar from "~/components/calendar/calendar-view";
import supabaseServer from "~/lib/supabase.server";
import { getLoaderActions } from "~/lib/utils";

export const config = { runtime: "edge" };

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  {
    title: `${
      data!.client ? data!.client.short.toUpperCase().concat(" / ") : ""
    }Calendário / ʙʟaᴅe`,
  },
];

export async function loader({ request, params }: LoaderFunctionArgs) {
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
  const { actions, celebrations } = useLoaderData<typeof loader>();

  return (
    <Calendar
      actions={actions as Action[]}
      celebrations={celebrations as Celebration[]}
    />
  );
}
