import { useLoaderData } from "@remix-run/react";
import { type LoaderFunctionArgs, type MetaFunction } from "@vercel/remix";

import ActionDialog from "~/components/dialogs/action-dialog";
import supabaseServer from "~/lib/supabase.server";

export const config = { runtime: "edge" };

export async function loader({ request, params }: LoaderFunctionArgs) {
  const response = new Response();
  const supabase = supabaseServer({ request, response });
  const { data: action } = await supabase
    .from("actions")
    .select("*, clients(*)")
    .eq("id", params.id!)
    .single();

  if (action) return { action };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  {
    title: data ? `${data.action?.title} / ʙʟaᴅe` : "ʙʟaᴅe",
  },
];

export default function Page() {
  const { action } = useLoaderData<typeof loader>();

  return (
    <div className="mx-auto h-full w-full max-w-2xl grow overflow-hidden">
      <ActionDialog mode="page" action={action} />
    </div>
  );
}
