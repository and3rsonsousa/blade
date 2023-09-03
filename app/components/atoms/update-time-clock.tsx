import { formatDistanceToNow, formatISO } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";
import { ptBR } from "date-fns/locale";
import { ClockIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function UpdatedTimeClock({ time }: { time: Date }) {
  const [text, setText] = useState(
    formatDistanceToNow(zonedTimeToUtc(time, "America/Fortaleza"), {
      locale: ptBR,
      addSuffix: true,
      includeSeconds: true,
    }),
  );
  useEffect(() => {
    const interval = setInterval(() => {
      setText(() =>
        formatDistanceToNow(zonedTimeToUtc(time, "America/Fortaleza"), {
          locale: ptBR,
          addSuffix: true,
          includeSeconds: true,
        }),
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);
  return (
    <div className="flex items-center text-xs text-muted-foreground">
      <ClockIcon className="mr-2" size={12} />
      {false ? (
        <div>
          <div>{formatISO(time)}</div>
          <div>{formatISO(zonedTimeToUtc(time, "America/Fortaleza"))}</div>
          <div>{formatISO(new Date())} </div>
        </div>
      ) : (
        <div>Atualizado {text}</div>
      )}
    </div>
  );
}
