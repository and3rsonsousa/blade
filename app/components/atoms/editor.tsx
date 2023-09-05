import { type ToggleProps } from "@radix-ui/react-toggle";
import Italic from "@tiptap/extension-italic";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TextAlign from "@tiptap/extension-text-align";
import {
  BubbleMenu,
  EditorContent,
  FloatingMenu,
  useEditor,
  type Editor as EditorType,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import {
  BoldIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  PilcrowIcon,
} from "lucide-react";

import { cn } from "~/lib/utils";
import { Toggle } from "../ui/toggle";

const extensions = [
  StarterKit,
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  Italic,
  OrderedList,
  BulletList,
  ListItem,
  TaskList,
  TaskItem.configure({ nested: true }),
];

export default function Editor({
  content,
  onBlur,
  onKeyDown,
}: {
  content: string;
  onBlur?: (value: string) => void;
  onKeyDown?: (value: string) => void;
}) {
  const editor = useEditor({
    content,
    extensions,
    editorProps: {
      attributes: {
        class: "outline-none min-h-[25vh]",
      },
    },
  });
  const classes =
    "bg-accent/50 border border-foreground-10 flex divide-x divide-foreground/5 backdrop-blur-lg rounded-sm ml-4 mt-1";

  function Items({ editor }: { editor: EditorType }) {
    const size = 16;

    return (
      <>
        <div className="flex">
          <ToggleButton
            tabIndex={0}
            className="rounded-l"
            pressed={editor.isActive("heading", {
              level: 3,
            })}
            onPressedChange={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            <Heading1Icon size={size} />
          </ToggleButton>

          <ToggleButton
            pressed={editor.isActive("heading", {
              level: 4,
            })}
            onPressedChange={(pressed) =>
              editor.chain().focus().toggleHeading({ level: 4 }).run()
            }
          >
            <Heading2Icon size={size} />
          </ToggleButton>
          <ToggleButton
            pressed={editor.isActive("heading", {
              level: 5,
            })}
            onPressedChange={() =>
              editor.chain().focus().toggleHeading({ level: 5 }).run()
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
            <BoldIcon size={size} />
          </ToggleButton>
          <ToggleButton
            pressed={editor.isActive("italic")}
            onPressedChange={(pressed) =>
              editor.chain().focus().toggleItalic().run()
            }
          >
            <ItalicIcon size={size} />
          </ToggleButton>
        </div>
        <div className="flex">
          <ToggleButton
            pressed={editor.isActive("bulletList")}
            onPressedChange={(pressed) =>
              editor.chain().focus().toggleBulletList().run()
            }
          >
            <ListIcon size={size} />
          </ToggleButton>
          {/* Lista ordenada */}
          <ToggleButton
            pressed={editor.isActive("orderedList")}
            onPressedChange={(pressed) =>
              editor.chain().focus().toggleOrderedList().run()
            }
          >
            <ListOrderedIcon size={size} />
          </ToggleButton>
        </div>
        {/* Parágrafo */}
        <div className="flex">
          <ToggleButton
            className="rounded-r"
            pressed={editor.isActive("paragraph")}
            onPressedChange={() => editor.chain().focus().setParagraph().run()}
          >
            <PilcrowIcon size={size} />
          </ToggleButton>
        </div>
      </>
    );
  }

  return (
    <div className="prose h-full shrink-0 grow">
      {editor && (
        <>
          <FloatingMenu className={cn(classes)} editor={editor}>
            <Items editor={editor} />
          </FloatingMenu>
          <BubbleMenu editor={editor} className={classes}>
            <Items editor={editor} />
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
        "h-auto rounded-none p-2 px-3 leading-none",
        props.className,
      ])}
    />
  );
};
