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
import { Plus } from "lucide-react";
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

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
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
				class: "outline-none bg-input p-4 rounded-lg",
			},
		},
		onUpdate() {
			console.log(editor?.getHTML().toString());
		},
	});

	return (
		<div
			className={`sm:grid grid-cols-7 ${
				calendar.length === 35 ? "grid-rows-5" : "grid-rows-6"
			} grow sm:overflow-hidden`}
		>
			{calendar.map(
				(c: DayType, i: number) =>
					c.actions.length > 0 && (
						<div
							key={i}
							className="px-6 py-2 sm:p-2 sm:flex sm:flex-col sm:overflow-hidden"
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
							<ScrollArea className="max-h-full grow shrink-0 pb-4">
								{c.actions.map((action) => (
									<div
										key={action.id}
										className="mb-1 pl-2 border-l-2 border-orange-900 hover:border-orange-700 py-0.5 text-xs hover:bg-card transition cursor-pointer text-slate-500"
									>
										{action.title}
									</div>
								))}
							</ScrollArea>
						</div>
					)
			)}

			<div className="fixed bottom-6 right-4">
				<Dialog defaultOpen={true}>
					<DialogTrigger asChild>
						<Button size={"icon"} className="rounded-full">
							<Plus />
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Nova Ação</DialogTitle>
						</DialogHeader>
						<DialogDescription>
							<ScrollArea className="max-sm:h-[60vh] -m-2">
								<div className="p-2">
									<div className="mb-4 space-y-2">
										<Label htmlFor="title">Título</Label>
										<Input
											id="title"
											name="title"
											placeholder="Título da Ação"
										/>
									</div>
									<div className="mb-4 space-y-2">
										<Label htmlFor="title">Categoria</Label>
										<Select>
											<SelectTrigger>
												<SelectValue placeholder="Categoria" />
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
										<Label htmlFor="title">Descrição</Label>
										<div className="prose">
											<EditorContent editor={editor} />
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
	);
}
