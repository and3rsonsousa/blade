import {
  Link,
  useMatches,
  useNavigate,
  useOutletContext,
  useParams,
} from "@remix-run/react";
import {
  CalendarDaysIcon,
  CalendarPlusIcon,
  CheckCircleIcon,
  ChevronsLeft,
  ChevronsRight,
  ListTodoIcon,
  LogOutIcon,
  MenuIcon,
  PlusIcon,
  SignalHighIcon,
  UserIcon,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "~/lib/utils";
import { ShortName } from "../atoms/action";
import ActionDialog from "../dialogs/action-dialog";
import CelebrationDialog from "../dialogs/celebration-dialog";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ScrollArea } from "../ui/scroll-area";
import Blade from "./blade";
import CommandBox from "./commnad-box";
import { TypedSupabaseClient } from "~/root";

export default function Layout({ children }: { children: ReactNode }) {
  const { user, supabase }: { user: Person; supabase: TypedSupabaseClient } =
    useOutletContext();
  const matches = useMatches();
  const params = useParams();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openActionDialog, setOpenActionDialog] = useState(false);
  const [openCelebrationDialog, setOpenCelebrationDialog] = useState(false);
  const slug = params["slug"];
  const url = `/dashboard${slug ? "/client/".concat(slug) : ""}/`;

  const { clients } = matches[1].data as {
    clients: Client[];
  };

  useEffect(() => {
    const keyDown = (event: KeyboardEvent) => {
      if (event.metaKey && event.shiftKey) {
        if (event.key === "a") {
          event.preventDefault();
          event.stopPropagation();
          setOpenActionDialog(true);
        }
        if (event.key === "d") {
          event.preventDefault();
          event.stopPropagation();
          setOpenCelebrationDialog(true);
        }
        if (event.key === "b") {
          event.preventDefault();
          event.stopPropagation();
          setOpen((value) => !value);
        }
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
        } flex shrink-0 justify-between overflow-hidden border-border/50 max-md:items-center max-md:border-b md:flex-col md:border-r`}
      >
        {/* Logo  */}
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
        </div>
        {/* Mobile */}
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

        <div className="hidden h-full flex-col justify-between overflow-hidden  md:flex">
          <ScrollArea className="shrink grow">
            <div className="pb-2">
              {/* Páginas */}
              {open && <h5 className="px-4 text-[10px] text-muted">Páginas</h5>}
              <div className="mb-8 flex flex-col text-sm font-medium hover:text-muted">
                <Link
                  to={`${url}`}
                  className={`flex gap-2 py-2 transition hover:text-foreground ${
                    open ? "px-4" : "px-6"
                  }`}
                >
                  <CalendarDaysIcon size={16} />
                  <span className={!open ? "hidden" : ""}> Calendário </span>
                </Link>

                <Link
                  to={`${url}list`}
                  className={`flex gap-2 py-2 transition hover:text-foreground ${
                    open ? "px-4" : "px-6"
                  }`}
                >
                  <ListTodoIcon size={16} />
                  <span className={!open ? "hidden" : ""}> Lista </span>
                </Link>

                <Link
                  to={`${url}status`}
                  className={`flex gap-2 py-2 transition hover:text-foreground ${
                    open ? "px-4" : "px-6"
                  }`}
                >
                  <CheckCircleIcon size={16} />
                  <span className={!open ? "hidden" : ""}> Status </span>
                </Link>

                <Link
                  to={`${url}priority`}
                  className={`flex gap-2 py-2 transition hover:text-foreground ${
                    open ? "px-4" : "px-6"
                  }`}
                >
                  <SignalHighIcon size={16} />
                  <span className={!open ? "hidden" : ""}> Prioridade </span>
                </Link>
              </div>
              {/* Clientes */}
              {open ? (
                <>
                  <h5 className="px-4 text-[10px] text-muted">Clientes</h5>

                  <div
                    className={`flex flex-col gap-1 text-xs font-medium hover:text-muted`}
                  >
                    {clients.map((client) => (
                      <Link
                        key={client.id}
                        to={`/dashboard/client/${client.slug}`}
                        className={`overflow-hidden text-ellipsis whitespace-nowrap border-l-2 px-3.5  py-1 font-medium  transition hover:text-foreground ${cn(
                          slug === client.slug
                            ? "border-foreground text-foreground"
                            : "border-transparent text-muted-foreground",
                        )}`}
                      >
                        {client.title}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                clients.map((client) => (
                  <Link key={client.id} to={`/dashboard/client/${client.slug}`}>
                    <Avatar
                      className={`mx-auto scale-75 border-2 border-transparent text-[12px] font-bold transition hover:scale-90 ${
                        params.slug === client.slug &&
                        "scale-100 border-foreground"
                      }`}
                    >
                      <AvatarFallback
                        className="uppercase"
                        style={{
                          backgroundColor: client.bgColor || undefined,
                          color: client.fgColor || undefined,
                        }}
                      >
                        <ShortName short={client.short} />
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                ))
              )}
            </div>
          </ScrollArea>

          <div className="flex shrink-0 flex-col items-center gap-2 border-t border-border/50 py-4">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex gap-2" asChild>
                <Button variant={"ghost"} size={open ? "default" : "icon"}>
                  <UserIcon size={16} />
                  <div
                    className={`overflow-hidden text-ellipsis whitespace-nowrap text-xs ${
                      !open ? "hidden" : ""
                    }`}
                  >
                    {user.name}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-content ml-2">
                {/* Clientes */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="menu-item">
                    Clientes
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent className="bg-content">
                      <DropdownMenuItem className="menu-item" asChild>
                        <Link to={"/dashboard/admin/clients"}>
                          Todos os clientes
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="menu-item" asChild>
                        <Link to={"/dashboard/admin/clients/new"}>
                          Adicionar novo cliente
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                {/* Usuários */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="menu-item">
                    Usuários
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent className="bg-content">
                      <DropdownMenuItem className="menu-item">
                        Todos os usuários
                      </DropdownMenuItem>
                      <DropdownMenuItem className="menu-item">
                        Cadastrar novo Usuário
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSeparator className="bg-foreground/10" />
                <DropdownMenuItem
                  className="menu-item px-2"
                  onClick={async () => {
                    await supabase.auth.signOut();
                  }}
                >
                  <span>Sair</span>
                  <LogOutIcon className="h-3 w-3" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {children}

      <Button
        size={"icon"}
        variant={open ? "ghost" : "outline"}
        className={`absolute top-5 ml-4 mr-2 h-6 w-6 ${
          open ? "left-36 " : " left-9"
        }`}
        onClick={() => setOpen(!open)}
      >
        {open ? <ChevronsLeft size={16} /> : <ChevronsRight size={16} />}
      </Button>
      {/* Add button */}
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
      {/* Cmd + K */}
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
