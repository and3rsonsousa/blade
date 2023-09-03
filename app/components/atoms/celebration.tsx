import { useFetcher } from "@remix-run/react";
import { CircleIcon, Star } from "lucide-react";

export default function CelebrationLine({
  celebration,
}: {
  celebration: Celebration;
}) {
  const fetcher = useFetcher();
  return (
    <div
      className="mt-2 flex shrink-0 grow items-center gap-1 text-[10px] text-slate-400"
      onClick={() =>
        fetcher.submit(
          { action: "delete-celebration", id: celebration.id },
          { action: "/handle-action", method: "post" },
        )
      }
    >
      {celebration.is_holiday ? <Star size={8} /> : <CircleIcon size={8} />}
      <div>{celebration.title}</div>
    </div>
  );
}
