import { forwardRef, useState, useEffect } from "react";
import { cn } from "~/lib/utils";

const FancyInputText = forwardRef<
	HTMLDivElement,
	{
		placeholder?: string;
		className?: string;
		max?: number;
		onBlur?: (value?: string) => void;
		onKeyDown?: (value?: string) => void;
		onInput?: (value?: string) => void;
		value?: string;
	}
>(
	(
		{ placeholder, value, className, max = 70, onBlur, onKeyDown, onInput },
		ref
	) => {
		const [visible, setVisible] = useState(!value);
		const [text, setText] = useState(value || "");
		const init = value;
		const onPaste = async (event: ClipboardEvent) => {
			const data = await navigator.clipboard.readText();
			navigator.clipboard.writeText(data);
		};

		useEffect(() => {
			window.addEventListener("paste", onPaste);
		}, []);

		return (
			<div className="relative">
				<div
					className={cn([
						"bg-transparent outline-none w-full",
						className,
					])}
					ref={ref}
					contentEditable="true"
					onInput={(event) => {
						setVisible(event.currentTarget.innerText === "");
						setText(event.currentTarget.innerHTML);
						if (onInput) {
							onInput(event.currentTarget.innerHTML);
						}
					}}
					tabIndex={0}
					onBlur={(event) => {
						if (onBlur) {
							onBlur(event.currentTarget.innerHTML);
						}
					}}
					onKeyDown={(event) => {
						if (onKeyDown) {
							onKeyDown(event.currentTarget.innerHTML);
						}
						if (event.key === "Enter") {
							event.preventDefault();
							event.currentTarget.blur();
						} else if (
							event.currentTarget.innerText.length >= max &&
							event.key !== "Backspace"
						) {
							event.preventDefault();
						}
					}}
					dangerouslySetInnerHTML={{ __html: init as string }}
				></div>
				{text.length > max - 30 && (
					<div
						className={`${
							text.length > max - 10
								? "text-rose-700"
								: text.length > max - 30
								? "text-yellow-600"
								: ""
						} text-[10px] absolute -bottom-4 right-0`}
					>
						{text.length - max}
					</div>
				)}
				{visible && (
					<div
						className={cn([
							"absolute pointer-events-none top-1/2 -translate-y-1/2 text-slate-500/50",
							className,
						])}
					>
						{placeholder}
					</div>
				)}
			</div>
		);
	}
);

FancyInputText.displayName = "FancyInputText";

export default FancyInputText;
