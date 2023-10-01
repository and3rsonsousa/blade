import { useMatches } from "@remix-run/react";
import { ActionLineCalendar, type ActionFull } from "../atoms/action";
import FancyInputText from "../atoms/fancy-input";
import { ScrollArea } from "../ui/scroll-area";

export default function StatusView({ actions }: { actions: Action[] | null }) {
  const matches = useMatches();
  const { states } = matches[1].data as { states: State[] };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden border border-yellow-400">
      <div className="mx-auto w-full">
        <div className="text-ll p-4 font-bold">Todas as Ações</div>
      </div>
      <div className="overflow-x-scroll border ">
        <div className="flex h-full min-w-[1200px] flex-nowrap overflow-hidden border border-green-400">
          {states.map((state) => (
            <div key={state.id} className="flex w-1/6 flex-col overflow-hidden">
              <div className="flex items-center p-2 text-sm font-bold text-slate-200">
                <div
                  className={`mr-2 h-3 w-3 rounded-full border-2 border-${state.slug}`}
                ></div>
                <div>{state.title}</div>
              </div>
              <ScrollArea>
                <div className="h-full w-full grow space-y-1 overflow-hidden px-2">
                  {actions
                    ?.filter((action) => action.state_id === state.id)
                    .map((action) => (
                      <ActionLineCalendar
                        setDropAction={() => {}}
                        action={action as ActionFull}
                        key={action.id}
                        showCategory={true}
                      />
                    ))}
                  <div
                    className={`rounded border-l-4 bg-card p-4 border-${state.slug}`}
                  >
                    <FancyInputText
                      className="text-sm"
                      placeholder="Digite o título da Ação"
                    />
                  </div>
                  <div className="h-[25vh]"></div>
                </div>
              </ScrollArea>
            </div>
          ))}
        </div>
      </div>
      {/* <div className="absolute right-0 top-0 h-full w-40 bg-foreground/10"></div> */}
    </div>
  );
}
