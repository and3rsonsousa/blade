import { useMatches } from "@remix-run/react";
import { getOrderedActions, getPrioritizedActions } from "~/lib/utils";
import { ActionStatus, type ActionFull } from "../atoms/action";
import { PriorityIcons } from "~/lib/icons";
import { ScrollArea } from "../ui/scroll-area";

export default function PriorityView({
  actions,
}: {
  actions: Action[] | null;
}) {
  const matches = useMatches();
  const { priorities } = matches[1].data;
  const currentActions = actions
    ? getPrioritizedActions(
        getOrderedActions(actions as ActionFull[]),
        priorities,
      )
    : null;
  return currentActions ? (
    <div className="grid h-full grid-cols-3 overflow-hidden border border-yellow-500">
      {currentActions.map(({ priority, actions }) => (
        <div key={priority.id} className="flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 p-2">
            <div className="relative">
              <PriorityIcons
                id="base"
                className="absolute left-0 top-0 z-0 opacity-20"
              />
              <PriorityIcons
                id={priority.slug}
                className={`${
                  priority.slug === "low"
                    ? "text-green-500"
                    : priority.slug === "mid"
                    ? "text-amber-400"
                    : "text-red-600"
                } isolate`}
              />
            </div>
            <div className="font-bold">{priority.title}</div>
          </div>
          <ScrollArea>
            <div className="space-y-1 px-2">
              {actions.map(
                (action) =>
                  action.states.slug !== "finished" && (
                    <ActionStatus action={action} key={action.id} />
                  ),
              )}
              <div className="h-[20vh]"></div>
            </div>
          </ScrollArea>
        </div>
      ))}
    </div>
  ) : (
    <div>Nenhuma Ação para ser exibida.</div>
  );
}
