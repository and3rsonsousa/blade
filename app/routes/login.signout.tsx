import { LoaderFunctionArgs, redirect } from "@vercel/remix";
import supabaseServer from "~/lib/supabase.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response();
  const supabase = supabaseServer({
    request,
    response,
  });

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }

  return redirect("/");
};
