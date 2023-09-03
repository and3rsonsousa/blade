import { getOrderedActions } from "~/lib/utils";
import { ActionListItem, type ActionFull } from "../atoms/action";
import { ScrollArea } from "../ui/scroll-area";

export default function ListView({ actions }: { actions: Action[] | null }) {
  return (
    <div className="h-full w-full overflow-hidden">
      <ScrollArea className="h-full">
        <div className="mx-auto max-w-xl">
          <div className="text-ll py-4 font-bold">Todas as Ações</div>
          <div className="space-y-1">
            {actions &&
              getOrderedActions(actions as ActionFull[]).map((action) => (
                <ActionListItem key={action.id} action={action as ActionFull} />
              ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
