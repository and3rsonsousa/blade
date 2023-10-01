import { useLoaderData } from "@remix-run/react";
import { type LoaderFunctionArgs, type MetaFunction } from "@vercel/remix";
import {
  startOfWeek,
  startOfMonth,
  endOfWeek,
  endOfMonth,
  format,
} from "date-fns";

import ListView from "~/components/list/list-view";
import { getCurrentDate } from "~/lib/getCurrentDate";
import supabaseServer from "~/lib/supabase.server";
import { getLoaderActions } from "~/lib/utils";

export const config = { runtime: "edge" };

export async function loader({ request, params }: LoaderFunctionArgs) {
  const response = new Response();
  const supabase = supabaseServer({ request, response });
  const currentDate = getCurrentDate(request);
  const start = startOfWeek(startOfMonth(currentDate));
  const end = endOfWeek(endOfMonth(currentDate));

  const { client, actions, celebrations } = await getLoaderActions(
    supabase,
    { start: format(start, "Y-MM-dd"), end: format(end, "Y-MM-dd") },
    params.slug,
  );

  return { client, actions, celebrations };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  {
    title: `${
      data!.client ? data!.client.short.toUpperCase().concat(" / ") : ""
    }Lista / ʙʟaᴅe`,
  },
];

export default function ClientID() {
  const { actions } = useLoaderData<typeof loader>();
  return <ListView actions={actions} />;
}
