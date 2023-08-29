import { type ToggleProps } from "@radix-ui/react-toggle";
import {
	BubbleMenu,
	EditorContent,
	FloatingMenu,
	useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
	AlignCenterIcon,
	AlignLeftIcon,
	AlignRightIcon,
	BoldIcon,
	Heading1Icon,
	Heading2Icon,
	Heading3Icon,
	ItalicIcon,
	ListIcon,
	ListOrderedIcon,
	PilcrowIcon,
	StrikethroughIcon,
} from "lucide-react";
import { Toggle } from "./ui/toggle";
import { cn } from "~/lib/utils";

const extensions = [StarterKit];

export default function Editor({
	content,
	onBlur,
	onKeyDown,
}: {
	content: string;
	onBlur?: (value: string) => void;
	onKeyDown?: (value: string) => void;
}) {
	const size = 16;
	const classes =
		"bg-accent/50 border border-foreground-10 flex divide-x divide-foreground/5 backdrop-blur-lg rounded-sm overflow-hidden";
	const editor = useEditor({
		content,
		extensions,
		editorProps: {
			attributes: {
				class: "outline-none",
			},
		},
	});

	return (
		<div className="h-full shrink-0 grow prose">
			{editor && (
				<>
					<FloatingMenu className={cn(classes)} editor={editor}>
						<div className="flex">
							<ToggleButton
								tabIndex={0}
								className="rounded-l"
								pressed={editor.isActive("heading", {
									level: 3,
								})}
								onPressedChange={(pressed) =>
									editor
										.chain()
										.focus()
										.toggleHeading({ level: 3 })
										.run()
								}
							>
								<Heading1Icon size={size} />
							</ToggleButton>

							<ToggleButton
								pressed={editor.isActive("heading", {
									level: 4,
								})}
								onPressedChange={(pressed) =>
									editor
										.chain()
										.focus()
										.toggleHeading({ level: 4 })
										.run()
								}
							>
								<Heading2Icon size={size} />
							</ToggleButton>
							<ToggleButton
								pressed={editor.isActive("heading", {
									level: 5,
								})}
								onPressedChange={(pressed) =>
									editor
										.chain()
										.focus()
										.toggleHeading({ level: 5 })
										.run()
								}
							>
								<Heading3Icon size={size} />
							</ToggleButton>
						</div>
						<div className="flex">
							<ToggleButton
								pressed={editor.isActive("bold")}
								onPressedChange={(pressed) =>
									editor.chain().focus().toggleBold().run()
								}
							>
								<AlignLeftIcon size={size} />
							</ToggleButton>
							<ToggleButton
								pressed={editor.isActive("bold")}
								onPressedChange={(pressed) =>
									editor.chain().focus().toggleBold().run()
								}
							>
								<AlignCenterIcon size={size} />
							</ToggleButton>
							<ToggleButton
								pressed={editor.isActive("bold")}
								onPressedChange={(pressed) =>
									editor.chain().focus().toggleBold().run()
								}
							>
								<AlignRightIcon size={size} />
							</ToggleButton>
						</div>
						<div className="flex">
							<ToggleButton
								pressed={editor.isActive("bold")}
								onPressedChange={(pressed) =>
									editor.chain().focus().toggleBold().run()
								}
							>
								<ListIcon size={size} />
							</ToggleButton>
							<ToggleButton
								pressed={editor.isActive("bold")}
								onPressedChange={(pressed) =>
									editor.chain().focus().toggleBold().run()
								}
							>
								<ListOrderedIcon size={size} />
							</ToggleButton>
						</div>
					</FloatingMenu>
					<BubbleMenu editor={editor} className={classes}>
						<ToggleButton
							pressed={editor.isActive("bold")}
							onPressedChange={(pressed) =>
								editor.chain().focus().toggleBold().run()
							}
						>
							<BoldIcon size={size} />
						</ToggleButton>
						<ToggleButton
							pressed={editor.isActive("bold")}
							onPressedChange={(pressed) =>
								editor.chain().focus().toggleBold().run()
							}
						>
							<ItalicIcon size={size} />
						</ToggleButton>
						<ToggleButton
							pressed={editor.isActive("bold")}
							onPressedChange={(pressed) =>
								editor.chain().focus().toggleBold().run()
							}
						>
							<StrikethroughIcon size={size} />
						</ToggleButton>
						<ToggleButton
							pressed={editor.isActive("paragraph")}
							onPressedChange={(pressed) =>
								editor.chain().focus().setParagraph().run()
							}
						>
							<PilcrowIcon size={size} />
						</ToggleButton>
					</BubbleMenu>
				</>
			)}
			<EditorContent
				editor={editor}
				onBlur={(value) => {
					if (onBlur) {
						onBlur(editor?.getHTML() ?? "");
					}
				}}
				onKeyDown={(value) => {
					if (onKeyDown) {
						onKeyDown(editor?.getHTML() ?? "");
					}
				}}
			/>
		</div>
	);
}

const ToggleButton = (props: ToggleProps) => {
	return (
		<Toggle
			{...props}
			className={cn([
				"p-2 px-3 h-auto rounded-none leading-none",
				props.className,
			])}
		/>
	);
};
