import { Link, useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs, MetaFunction, json } from "@vercel/remix";
import { PlusCircleIcon } from "lucide-react";
import { ShortName } from "~/components/atoms/action";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import supabaseServer from "~/lib/supabase.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response();
  const supabase = supabaseServer({
    request,
    response,
  });

  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .order("title");

  return json({ clients });
};

export const meta: MetaFunction = () => [
  {
    title: "Clientes / ʙʟaᴅe",
  },
];

export default function ClientsPages() {
  const { clients } = useLoaderData<typeof loader>();
  return (
    <ScrollArea className="flex h-full">
      <div className="grid gap-2 p-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-full p-8 text-center">
          <Button variant={"default"} size={"lg"} asChild>
            <Link to="/dashboard/admin/clients/new">
              Novo Cliente
              <PlusCircleIcon className="ml-4 h-6 w-6" />
            </Link>
          </Button>
        </div>
        {clients?.map((client) => (
          <Link
            to={`/dashboard/admin/clients/${client.slug}`}
            key={client.id}
            className="group flex items-center gap-4 rounded-lg border border-muted bg-card p-4 transition-colors hover:bg-muted/75"
          >
            <Avatar className="transition duration-500 group-hover:scale-110">
              <AvatarFallback
                style={{
                  backgroundColor: client.bgColor || undefined,
                  color: client.fgColor || undefined,
                }}
              >
                <div className="w-8 text-center text-[12px] font-bold uppercase ">
                  <ShortName short={client.short} />
                </div>
              </AvatarFallback>
            </Avatar>
            <div className="text-lg font-semibold leading-none transition duration-500 group-hover:-translate-x-1">
              {client.title}
            </div>
          </Link>
        ))}
      </div>
    </ScrollArea>
  );
}
