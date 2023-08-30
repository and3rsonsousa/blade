import { useEffect } from "react";

const CmdEnter = function ({ fn }: { fn: () => void }) {
	useEffect(() => {
		const listener = (event: KeyboardEvent) => {
			if (event.metaKey && event.key === "Enter") {
				fn();
			}
		};
		window.addEventListener("keydown", listener);
		return () => window.removeEventListener("keydown", listener);
	}, [fn]);
	return <></>;
};

export default CmdEnter;
