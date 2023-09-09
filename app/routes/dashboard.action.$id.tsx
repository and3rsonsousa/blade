import {
  type V2_MetaFunction,
  type LoaderFunction,
  type LoaderArgs,
  json,
} from "@vercel/remix";
import { useLoaderData } from "@remix-run/react";
import ActionDialog from "~/components/dialogs/action-dialog";
import LayoutClient from "~/components/structure/layout-client";
import supabaseServer from "~/lib/supabase.server";

export const config = { runtime: "edge" };

export const loader: LoaderFunction = async ({
  request,
  params,
}: LoaderArgs) => {
  const response = new Response();
  const supabase = supabaseServer({ request, response });
  const { data: action } = await supabase
    .from("actions")
    .select("*, clients(*)")
    .eq("id", params.id)
    .single();

  return json({ action });
};

export const meta: V2_MetaFunction<typeof loader> = ({ data: { action } }) => [
  {
    title: `${action.title} / ʙʟaᴅe`,
  },
];

export default function ActionPage() {
  const { action } = useLoaderData<typeof loader>();

  return (
    <LayoutClient client={action.clients}>
      <div className="mx-auto h-full w-full max-w-2xl grow overflow-hidden">
        <ActionDialog mode="page" action={action} />
      </div>
    </LayoutClient>
  );
}
