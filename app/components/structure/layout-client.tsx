import { Link } from "@remix-run/react";
import { type ReactNode } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import MenuPages from "../atoms/menu-pages";

export default function LayoutClient({
  client,
  children,
}: {
  client: Client;
  children: ReactNode;
}) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarFallback className="text-xs">
              {client.short.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Link
            to={`/dashboard/client/${client.slug}`}
            className="m-0 text-xl font-semibold"
          >
            {client.title}
          </Link>
        </div>
        <MenuPages />
      </div>
      {children}
    </div>
  );
}
