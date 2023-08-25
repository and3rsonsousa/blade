import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const extensions = [StarterKit];

export default function Editor({ content }: { content: string }) {
	const editor = useEditor({
		content,
		extensions,
	});
	return (
		<div className="border border-red-500 h-full grow">
			<EditorContent editor={editor} />;
		</div>
	);
}
