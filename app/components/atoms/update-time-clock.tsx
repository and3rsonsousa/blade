import { formatDistanceToNow } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";
import { ptBR } from "date-fns/locale";
import { ClockIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function UpdatedTimeClock({ time }: { time: Date }) {
	const [text, setText] = useState(
		formatDistanceToNow(
			zonedTimeToUtc(new Date(time), "America/Fortaleza"),
			{
				locale: ptBR,
				addSuffix: true,
				includeSeconds: true,
			}
		)
	);
	useEffect(() => {
		const interval = setInterval(() => {
			setText(() =>
				formatDistanceToNow(
					zonedTimeToUtc(new Date(time), "America/Fortaleza"),
					{
						locale: ptBR,
						addSuffix: true,
						includeSeconds: true,
					}
				)
			);
		}, 1000);

		return () => clearInterval(interval);
	}, [time]);
	return (
		<div className="text-muted-foreground text-xs items-center flex">
			<ClockIcon className="mr-2" size={12} />

			<div>Atualizado {text}</div>
		</div>
	);
}
