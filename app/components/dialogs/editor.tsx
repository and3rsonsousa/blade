import { BoldExtension, ItalicExtension } from "remirror/extensions";
import { EditorComponent, Remirror, useRemirror } from "@remirror/react";
import "remirror/styles/all.css";

type EditorType = {
	content: string;
};

export default function Editor({ content }: EditorType) {
	const { manager, state } = useRemirror({
		extensions: () => [new BoldExtension(), new ItalicExtension()],
		content: content,
		selection: "start",
		stringHandler: "html",
	});
	return (
		<div className="bg-card px-4 py-3 rounded-md">
			<Remirror
				manager={manager}
				classNames={["outline-none"]}
				initialContent={state}
			>
				<EditorComponent />
				<div>Menu aqui</div>
			</Remirror>
		</div>
	);
}
