import { type LoaderArgs, type V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
	eachDayOfInterval,
	endOfMonth,
	endOfWeek,
	format,
	startOfMonth,
	startOfWeek,
	toDate,
} from "date-fns";
import { Bold, Italic, Plus, Underline } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";

import supabaseServer from "~/lib/supabase.server";

import { BubbleMenu, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState, type ComponentProps, type ReactNode } from "react";
import { Label } from "~/components/ui/label";

export const meta: V2_MetaFunction = () => [
	{
		title: "Dashboard",
	},
];

export async function loader({ request }: LoaderArgs) {
	const response = new Response();
	const supabase = supabaseServer({
		request,
		response,
	});
	const { data } = await supabase
		.from("actions")
		.select("*, category(*), state(*)");

	return { data };
}

export default function DashboardIndex() {
	const { data } = useLoaderData<typeof loader>();
	const date = toDate(Date.now());
	const start = startOfWeek(startOfMonth(date));
	const end = endOfWeek(endOfMonth(date));
	const days = eachDayOfInterval({ start, end });
	const [open, setOpen] = useState(false);

	const calendar: CalendarType = [];

	days.forEach((day) => {
		calendar.push({
			day,
			actions: data?.filter((action) => {
				const date = toDate(new Date(action.date));
				if (format(date, "y-M-d") === format(day, "y-M-d")) {
					return true;
				}
				return false;
			}) as Action[],
		});
	});

	const editor = useEditor({
		extensions: [StarterKit],
		content:
			"<h2>testando meu deus</h2><p>de novo</p><p>Essa <strong>merda</strong> aqui</p><ol><li><p>Testando</p></li><li><p>valha jesus</p></li></ol><p></p><hr><p>Parece que agora vai</p><p>Sei lá né?</p><p></p>",
		editorProps: {
			attributes: {
				class: "outline-none bg-input px-4 py-3 rounded-lg",
			},
		},
		onUpdate() {
			console.log(editor?.getHTML().toString());
		},
		onBlur() {
			console.log("OK");
		},
	});

	return (
		<>
			<div
				className={`sm:grid grid-cols-7 ${
					calendar.length === 35 ? "grid-rows-5" : "grid-rows-6"
				} grow sm:overflow-hidden`}
			>
				{calendar.map((c: DayType, i: number) => (
					<div
						key={i}
						className={`px-6 py-2 sm:p-2 sm:flex sm:flex-col sm:overflow-hidden ${
							c.actions.length === 0 ? " max-sm:hidden " : ""
						}`}
					>
						<div
							className={`text-sm mb-2 ${
								c.day.getMonth() !== date.getMonth()
									? "opacity-25"
									: ""
							}`}
						>
							{c.day.getDate()}
						</div>
						<ScrollArea className="max-h-full pb-4">
							{c.actions.map((action) => (
								<div
									key={action.id}
									className="mb-1 pl-2 border-l-4 border-orange-700 hover:border-orange-600 py-0.5 max-sm:text-xs text-sm hover:bg-accent bg-card transition cursor-pointer text-slate-500 w-full hover:text-muted-foreground rounded-[4px]"
								>
									{action.title}
								</div>
							))}
						</ScrollArea>
					</div>
				))}

				<div className="fixed bottom-6 right-4">
					<Dialog open={open}>
						<DialogTrigger asChild>
							<Button
								size={"icon"}
								className="rounded-full"
								onClick={() => setOpen(true)}
							>
								<Plus />
							</Button>
						</DialogTrigger>
						<DialogContent
							onInteractOutside={(event) => {
								if (open) {
									event.preventDefault();
								}
							}}
						>
							<DialogHeader>
								<DialogTitle>Nova Ação</DialogTitle>
							</DialogHeader>
							<DialogDescription>
								<ScrollArea className="h-[60vh] -m-2">
									<div className="p-2">
										<div className="mb-4 space-y-2">
											<Label htmlFor="title">
												Título
											</Label>
											<Input
												id="title"
												name="title"
												placeholder="Título da Ação"
											/>
										</div>
										<div className="mb-4 space-y-2">
											<Label htmlFor="title">
												Categoria
											</Label>
											<Select>
												<SelectTrigger>
													<SelectValue placeholder="Escolha a Categoria da Ação" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="1">
														Light
													</SelectItem>
													<SelectItem value="2">
														Dark
													</SelectItem>
													<SelectItem value="3">
														System
													</SelectItem>
												</SelectContent>
											</Select>
										</div>
										<div className="mb-4 space-y-2">
											<Label htmlFor="title">
												Descrição
											</Label>
											<div className="prose">
												<EditorContent
													editor={editor}
												/>
											</div>
										</div>
									</div>
								</ScrollArea>
							</DialogDescription>
							<DialogFooter>
								<Button>Inserir</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
			</div>
			{editor && (
				<BubbleMenu
					editor={editor}
					className="bg-accent shadow-lg border border-muted shadow-black flex  rounded-lg m-0 overflow-hidden"
				>
					<BubleButton
						data-active={editor.isActive("bold")}
						onClick={(event) => {
							event.preventDefault();
							event.stopPropagation();
							editor.chain().focus().toggleBold().run();
							return false;
						}}
					>
						<Bold className="w-4 h-4" />
					</BubleButton>
					<BubleButton
						data-active={editor.isActive("italic")}
						onClick={(event) => {
							editor.chain().focus().toggleItalic().run();
						}}
					>
						<Italic className="w-4 h-4" />
					</BubleButton>

					<BubleButton
						data-active={editor.isActive("strike")}
						onClick={() => {
							editor.chain().focus().toggleStrike().run();
						}}
					>
						<Underline className="w-4 h-4" />
					</BubleButton>
				</BubbleMenu>
			)}
		</>
	);
}

const BubleButton = (
	props: ComponentProps<"button"> & { children: ReactNode }
) => (
	<button
		className="h-8 w-10 text-muted-foreground grid place-content-center hover:bg-input data-[active=true]:bg-muted data-[active=true]:text-muted-foreground"
		{...props}
	></button>
);
