import {
  Link,
  useMatches,
  useNavigate,
  useOutletContext,
  useParams,
} from "@remix-run/react";
import {
  CalendarPlusIcon,
  ChevronsLeft,
  ChevronsRight,
  CommandIcon,
  MenuIcon,
  PlusIcon,
  SearchIcon,
  UserIcon,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import ActionDialog from "../dialogs/action-dialog";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import Blade from "./blade";
import CommandBox from "./commnad-box";
import CelebrationDialog from "../dialogs/celebration-dialog";

export default function Layout({ children }: { children: ReactNode }) {
  const { user }: { user: Person } = useOutletContext();
  const matches = useMatches();
  const params = useParams();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [openActionDialog, setOpenActionDialog] = useState(false);
  const [openCelebrationDialog, setOpenCelebrationDialog] = useState(false);

  const slug = params["slug"];
  const { clients }: { clients: Client[] } = matches[1].data;

  useEffect(() => {
    const keyDown = (event: KeyboardEvent) => {
      if (event.metaKey && event.shiftKey) {
        if (event.key === "a") setOpenActionDialog(true);
        if (event.key === "e") setOpenCelebrationDialog(true);
        if (event.key === "b") setOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", keyDown);

    return () => window.removeEventListener("keydown", keyDown);
  }, []);

  return (
    <div className="flex h-screen w-screen flex-col md:flex-row">
      <div
        className={`${
          open ? "md:w-48" : "md:w-16"
        } flex shrink-0 justify-between max-md:items-center  max-md:border-b md:flex-col md:border-r`}
      >
        <div
          className={`${
            open ? "flex" : ""
          } relative items-center justify-between`}
        >
          <Link
            to="/dashboard"
            className={`block ${open ? "p-6" : "p-6 pb-1"} shrink grow-0`}
          >
            {open ? (
              <Blade className="h-4" />
            ) : (
              <img src="/icon-3.png" alt="Blade Icon" className="mb-4 w-8" />
            )}
          </Link>
          <Button
            size={"icon"}
            variant={open ? "ghost" : "outline"}
            className={`ml-4 mr-2 h-8 w-8 ${
              !open && "absolute -right-6 top-4"
            }`}
            onClick={() => setOpen(!open)}
          >
            {open ? <ChevronsLeft size={24} /> : <ChevronsRight size={24} />}
          </Button>
        </div>
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"} size={"icon"} className="mr-2">
                <MenuIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-content mr-2">
              <DropdownMenuLabel className="px-3 uppercase tracking-wide">
                Clientes
              </DropdownMenuLabel>
              {clients.map((client) => (
                <DropdownMenuItem
                  key={client.id}
                  onSelect={() => navigate(`/dashboard/client/${client.slug}`)}
                  className={`menu-item`}
                >
                  {client.title}
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator className="bg-foreground/10" />
              <DropdownMenuItem>Minha Conta</DropdownMenuItem>
              <DropdownMenuItem>Lixeira</DropdownMenuItem>
              <DropdownMenuItem>Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="hidden shrink-0 grow flex-col justify-between md:flex">
          <div
            className={`flex flex-col gap-1 text-xs ${
              open ? "px-2" : "px-1"
            } font-medium text-muted-foreground`}
          >
            {clients.map((client) => (
              <Link
                key={client.id}
                to={`/dashboard/client/${client.slug}`}
                className={`${
                  open
                    ? "px-3"
                    : "px-1 text-center text-[10px] font-semibold uppercase"
                } overflow-hidden text-ellipsis whitespace-nowrap rounded-sm py-2 transition hover:bg-accent hover:text-accent-foreground ${
                  slug === client.slug ? "bg-muted text-foreground" : ""
                }`}
              >
                {open ? client.title : client.short}
              </Link>
            ))}
          </div>
          {open ? (
            <div className="p-3">
              <div className="p-3">
                <Button
                  className="w-full justify-between bg-card px-2"
                  size={"sm"}
                  variant={"secondary"}
                >
                  <div className="flex items-center gap-2 text-sm">
                    <SearchIcon size={16} />
                    Busca
                  </div>
                  <div className="flex items-center gap-1 text-xs opacity-25">
                    <CommandIcon size={12} />
                    <div>+ K</div>
                  </div>
                </Button>
              </div>
              <div className="flex items-center gap-2 px-3 py-2">
                <UserIcon size={16} />
                <div className="overflow-hidden text-ellipsis whitespace-nowrap text-xs">
                  {user.name}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 pb-4">
              <Button variant={"secondary"} className="h-auto p-2">
                <SearchIcon size={16} />
              </Button>
              <Button variant={"ghost"} className="h-auto p-2">
                <UserIcon size={16} />
              </Button>
            </div>
          )}
        </div>
      </div>

      {children}

      <div className="fixed bottom-6 right-4">
        <Popover
          open={openCelebrationDialog}
          onOpenChange={setOpenCelebrationDialog}
        >
          <PopoverTrigger asChild>
            <Button
              size={"icon"}
              className="mr-2 h-8 w-8 rounded-full"
              variant={"secondary"}
            >
              <CalendarPlusIcon size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="bg-content w-[86vw] sm:w-[540px]"
            align="end"
            sideOffset={24}
            alignOffset={-64}
          >
            <CelebrationDialog
              closeDialog={() => setOpenCelebrationDialog(false)}
            />
          </PopoverContent>
        </Popover>

        <Popover open={openActionDialog} onOpenChange={setOpenActionDialog}>
          <PopoverTrigger asChild>
            <Button size={"icon"} className="rounded-full">
              <PlusIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="bg-content w-[86vw] sm:w-[540px]"
            align="end"
            sideOffset={16}
            alignOffset={0}
          >
            <ActionDialog closeDialog={() => setOpenActionDialog(false)} />
          </PopoverContent>
        </Popover>
      </div>
      <CommandBox
        options={{
          action: { open: openActionDialog, setOpen: setOpenActionDialog },
          celebration: {
            open: openCelebrationDialog,
            setOpen: setOpenCelebrationDialog,
          },
        }}
      />
    </div>
  );
}
