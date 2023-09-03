import { Link, useParams } from "@remix-run/react";
import {
  CalendarDaysIcon,
  CheckCircleIcon,
  ListTodoIcon,
  SignalHighIcon,
} from "lucide-react";
import { Button } from "../ui/button";

export default function MenuPages() {
  const params = useParams();
  const slug = params["slug"];
  const url = `/dashboard${slug ? "/client/".concat(slug) : ""}/`;

  return (
    <div className="flex text-sm font-medium">
      <div>
        <Button asChild variant={"ghost"} size={"sm"}>
          <Link to={`${url}`} className="gap-2">
            <CalendarDaysIcon size={16} /> Calendário
          </Link>
        </Button>
      </div>
      <div>
        <Button asChild variant={"ghost"} size={"sm"}>
          <Link to={`${url}list`} className="gap-2">
            <ListTodoIcon size={16} /> Lista
          </Link>
        </Button>
      </div>
      <div>
        <Button asChild variant={"ghost"} size={"sm"}>
          <Link to={`${url}status`} className="gap-2">
            <CheckCircleIcon size={16} /> Status
          </Link>
        </Button>
      </div>
      <div>
        <Button asChild variant={"ghost"} size={"sm"}>
          <Link to={`${url}priority`} className="gap-2">
            <SignalHighIcon size={16} /> Prioridade
          </Link>
        </Button>
      </div>
    </div>
  );
}
