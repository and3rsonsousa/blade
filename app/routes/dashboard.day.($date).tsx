import { LoaderFunctionArgs, MetaFunction } from "@vercel/remix";
import {
  startOfWeek,
  startOfMonth,
  endOfWeek,
  endOfMonth,
  format,
} from "date-fns";
import { getCurrentDate } from "~/lib/getCurrentDate";
import supabaseServer from "~/lib/supabase.server";
import { getLoaderActions } from "~/lib/utils";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const response = new Response();
  const supabase = supabaseServer({
    request,
    response,
  });

  if (params.day) {
  }

  const currentDate = getCurrentDate(request);
  const start = startOfWeek(startOfMonth(currentDate));
  const end = endOfWeek(endOfMonth(currentDate));

  const { client, actions, celebrations } = await getLoaderActions(supabase, {
    start: format(start, "Y-MM-dd '0:0:0'"),
    end: format(end, "Y-MM-dd '23:59:59'"),
  });

  return { client, actions, celebrations };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  {
    title: `${
      data?.client ? data?.client.short.toUpperCase().concat(" / ") : ""
    }Calendário / ʙʟaᴅe`,
  },
];

export default function DayPage() {
  return <div>Today</div>;
}
