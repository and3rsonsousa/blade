import { Calendar } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { useMatches } from "@remix-run/react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

export default function ActionDialog() {
	const matches = useMatches();
	const { categories } = matches[1].data;
	return (
		<>
			<div className="max-sm:p-4 p-8 pb-0">
				<ActionTitleInput placeholder="Nome da ação" />
			</div>

			<div className="text-sm px-8 pt-4 text-muted">
				Descreva sua ação...
			</div>
			<div className="mt-4 sm:flex justify-between border-t p-4 sm:px-8 gap-16">
				<div className="flex max-sm:pb-4 justify-between gap-4 items-center text-xs">
					<div className="flex gap-4">
						<Select>
							<SelectTrigger className="p-2 rounded-sm bg-transparent border-0 h-auto text-xs">
								<SelectValue placeholder="Teste" />
							</SelectTrigger>
							<SelectContent>
								{(categories as Category[]).map((category) => (
									<SelectItem
										key={category.id}
										value={String(category.id)}
									>
										{category.title}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<div>Univet</div>
					</div>
					<div className="flex gap-4">
						<div className="flex gap-2 items-center">
							<div className="h-2 w-2 rounded-full bg-orange-500"></div>
							<div>Fazer</div>
						</div>
						<div className="flex gap-1 items-center">
							<Calendar className="w-3 h-3 opacity-50" />
							<div>12 de março</div>
						</div>
					</div>
				</div>
				<Button size={"sm"}>Inserir</Button>
			</div>
		</>
	);
}

const ActionTitleInput = ({
	placeholder,
	content,
	max = 70,
}: {
	placeholder?: string;
	content?: string;
	max?: number;
}) => {
	const [visible, setVisible] = useState(!content);
	const [text, setText] = useState(content || "");

	return (
		<div className="relative">
			<div
				className="text-2xl font-semibold bg-transparent outline-none w-full"
				contentEditable="true"
				onInput={(event) => {
					setVisible(event.currentTarget.innerText === "");
					setText(event.currentTarget.innerText);
				}}
				onKeyDown={(event) => {
					if (
						event.currentTarget.innerText.length >= max &&
						event.key !== "Backspace"
					) {
						event.preventDefault();
					}
				}}
			>
				{content}
			</div>
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
				<div className="absolute pointer-events-none top-1/2 -translate-y-1/2 text-muted text-2xl font-semibold">
					{placeholder}
				</div>
			)}
		</div>
	);
};
