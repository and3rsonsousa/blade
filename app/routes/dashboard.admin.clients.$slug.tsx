import { useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import { LoaderFunctionArgs, MetaFunction, json } from "@vercel/remix";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ScrollArea } from "~/components/ui/scroll-area";
import supabaseServer from "~/lib/supabase.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const response = new Response();
  const supabase = supabaseServer({
    request,
    response,
  });

  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("slug", params.slug as string)
    .single();

  return json({ client });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  {
    title: `Editar / ${data && data.client?.title} / ʙʟaᴅe`,
  },
];

export default function ClientsPages() {
  const { client } = useLoaderData<typeof loader>();
  const [slug, setSlug] = useState(client?.slug);
  const [short, setShort] = useState(client?.short);
  const fetcher = useFetcher();
  const navigate = useNavigate();

  useEffect(() => {
    if (fetcher.data) {
      const { data, error } = fetcher.data;
      if (data && !error) {
        navigate("/dashboard/admin/clients");
      }
    }
  }, [fetcher.data]);

  return (
    <ScrollArea className="flex h-full">
      <div className="mx-auto flex max-w-md flex-col">
        <div className="p-4">
          <h4>Editar Cliente: {client?.title}</h4>
        </div>
        <div className="p-4">
          <fetcher.Form
            method="post"
            action="/handle-action"
            className="grid grid-cols-2 gap-4"
          >
            <input type="hidden" name="id" value={client?.id} />
            <div className="col-span-full mb-4">
              <Label htmlFor="title" className="mb-2 block">
                Nome
              </Label>
              <Input
                id="title"
                name="title"
                defaultValue={client?.title}
                onChange={(event) => {
                  const value = event.target.value
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/ /g, "")
                    .toLocaleLowerCase();
                  setSlug(value);
                  setShort(value.substring(0, 4));
                }}
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="slug" className="mb-2 block">
                Slug
              </Label>
              <Input
                id="slug"
                name="slug"
                value={slug}
                onChange={(event) => {
                  setSlug(event.target.value);
                }}
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="short" className="mb-2 block">
                Short
              </Label>
              <Input
                id="short"
                name="short"
                value={short}
                onChange={(event) => {
                  setShort(event.target.value);
                }}
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="fgColor" className="mb-2 block">
                fgColor
              </Label>
              <input
                id="fgColor"
                name="fgColor"
                type="color"
                defaultValue={client?.fgColor || "#000"}
                className="color-input h-12 w-full appearance-none bg-transparent"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="bgColor" className="mb-2 block">
                bgColor
              </Label>
              <input
                id="bgColor"
                name="bgColor"
                type="color"
                defaultValue={client?.bgColor || "#000"}
                className="color-input h-12 w-full appearance-none bg-transparent"
              />
            </div>
            <div className="col-span-full text-right">
              <Button type="submit" name="action" value="update-client">
                Adicionar
              </Button>
            </div>
          </fetcher.Form>
        </div>
      </div>
    </ScrollArea>
  );

  // bgColor: string | null;
  // created_at: string;
  // fgColor: string | null;
  // id: number;
  // short: string;
  // slug: string;
  // title: string;
}
