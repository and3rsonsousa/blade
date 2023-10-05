import { useFetcher } from "@remix-run/react";
import { PlusIcon, Star } from "lucide-react";

export default function CelebrationLine({
  celebration,
}: {
  celebration: Celebration;
}) {
  const fetcher = useFetcher();
  return (
    <div
      title={celebration.title}
      className="mt-1 flex shrink-0 grow items-center gap-1 text-[10px] leading-none text-muted-foreground opacity-50 transition hover:opacity-100"
      onClick={() => {
        if (confirm("Deseja mesmo excluir essa Data Comemorativa?")) {
          fetcher.submit(
            { action: "delete-celebration", id: celebration.id },
            { action: "/handle-action", method: "post" },
          );
        }
      }}
    >
      {celebration.is_holiday ? <Star size={8} /> : <PlusIcon size={8} />}
      <div className="overflow-hidden text-ellipsis whitespace-nowrap">
        {celebration.title}
      </div>
    </div>
  );
}
