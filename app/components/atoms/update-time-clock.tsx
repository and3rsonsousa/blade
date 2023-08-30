import { formatDistance } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ClockIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function UpdatedTimeClock({ time }: { time: Date }) {
	const [text, setText] = useState(
		formatDistance(new Date(time), new Date(), {
			locale: ptBR,
			addSuffix: true,
			includeSeconds: true,
		})
	);
	useEffect(() => {
		const interval = setInterval(() => {
			setText(() =>
				formatDistance(new Date(time), new Date(), {
					locale: ptBR,
					addSuffix: true,
					includeSeconds: true,
				})
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
