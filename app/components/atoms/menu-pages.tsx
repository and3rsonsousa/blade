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
  const slug = params["slug"]?.concat("/") || "";

  return (
    <div className="flex text-sm font-medium">
      <div>
        <Button asChild variant={"ghost"} size={"sm"}>
          <Link to={`/dashboard/client/${slug}`} className="gap-2">
            <CalendarDaysIcon size={16} /> Calendário
          </Link>
        </Button>
      </div>
      <div>
        <Button asChild variant={"ghost"} size={"sm"}>
          <Link to={`/dashboard/client/${slug}list`} className="gap-2">
            <ListTodoIcon size={16} /> Lista
          </Link>
        </Button>
      </div>
      <div>
        <Button asChild variant={"ghost"} size={"sm"}>
          <Link to={`/dashboard/client/${slug}status`} className="gap-2">
            <CheckCircleIcon size={16} /> Status
          </Link>
        </Button>
      </div>
      <div>
        <Button asChild variant={"ghost"} size={"sm"}>
          <Link to={`/dashboard/client/${slug}priority`} className="gap-2">
            <SignalHighIcon size={16} /> Prioridade
          </Link>
        </Button>
      </div>
    </div>
  );
}
