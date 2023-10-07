import { useLoaderData } from "@remix-run/react";
import { type LoaderFunctionArgs, type MetaFunction } from "@vercel/remix";
import { startOfWeek, startOfMonth, endOfWeek, endOfMonth } from "date-fns";
import { format } from "date-fns-tz";

import Calendar from "~/components/calendar/calendar-view";
import supabaseServer from "~/lib/supabase.server";
import { getCurrentDate } from "~/lib/getCurrentDate";
import { getLoaderActions } from "~/lib/utils";

export const config = { runtime: "edge" };

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  {
    title: `${
      data?.client ? data?.client.short.toUpperCase().concat(" / ") : ""
    }Calendário / ʙʟaᴅe`,
  },
];

export async function loader({ request, params }: LoaderFunctionArgs) {
  const response = new Response();
  const supabase = supabaseServer({
    request,
    response,
  });

  const currentDate = getCurrentDate(request);
  const start = startOfWeek(startOfMonth(currentDate));
  const end = endOfWeek(endOfMonth(currentDate));

  console.log({
    start: format(start, "Y-MM-dd '0:0:0'"),
    end: format(end, "Y-MM-dd '23:59:59'"),
  });

  const { client, actions, celebrations } = await getLoaderActions(
    supabase,
    {
      start: format(start, "Y-MM-dd '0:0:0'"),
      end: format(end, "Y-MM-dd '23:59:59'"),
    },
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
