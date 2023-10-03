import { MetaFunction, useFetcher } from "@remix-run/react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ScrollArea } from "~/components/ui/scroll-area";

export const meta: MetaFunction = ({ data }) => [
  {
    title: `Novo Cliente / ʙʟaᴅe`,
  },
];

export default function ClientsPages() {
  const [slug, setSlug] = useState("");
  const [short, setShort] = useState("");

  const fetcher = useFetcher();

  return (
    <ScrollArea className="flex h-full">
      <div className="mx-auto max-w-md">
        <div className="p-4">
          <h4>Novo Cliente</h4>
        </div>
        <div className="p-4">
          <fetcher.Form
            method="post"
            action="/handle-action"
            className="grid grid-cols-2 gap-4"
          >
            <div className="col-span-full mb-4">
              <Label htmlFor="title" className="mb-2 block">
                Nome
              </Label>
              <Input
                id="title"
                name="title"
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
                className="color-input h-12 w-full appearance-none bg-transparent"
                defaultValue={"#ffffff"}
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
                className="color-input h-12 w-full appearance-none bg-transparent"
                defaultValue={"#56697c"}
              />
            </div>
            <div className="col-span-full text-right">
              <Button type="submit" name="action" value="create-client">
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
