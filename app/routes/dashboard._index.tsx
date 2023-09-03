import { type LoaderArgs, type V2_MetaFunction } from "@vercel/remix";
import { useLoaderData } from "@remix-run/react";

import supabaseServer from "~/lib/supabase.server";
import Calendar from "~/components/calendar/calendar-view";
import MenuPages from "~/components/atoms/menu-pages";

export const meta: V2_MetaFunction = () => [
  {
    title: "Blade Dashboard",
  },
];

export async function loader({ request }: LoaderArgs) {
  const response = new Response();
  const supabase = supabaseServer({
    request,
    response,
  });
  const [{ data: actions }, { data: celebrations }] = await Promise.all([
    supabase
      .from("actions")
      .select("*,clients(*), categories(*), states(*)")
      .order("date", { ascending: true })
      .order("created_at", { ascending: true }),
    supabase.from("celebration").select("*").order("date", { ascending: true }),
  ]);

  return { actions, celebrations };
}

export default function DashboardIndex() {
  const { actions, celebrations } = useLoaderData<typeof loader>();

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="flex items-center justify-end border-b px-4 py-3">
        <MenuPages />
      </div>
      <Calendar
        actions={actions as Action[]}
        celebrations={celebrations as Celebration[]}
      />
    </div>
  );
}
