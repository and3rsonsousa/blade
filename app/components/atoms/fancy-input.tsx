import { useEffect, useRef, useState } from "react";
import { cn } from "~/lib/utils";

const FancyInputText = ({
  placeholder,
  value,
  className,
  max = 70,
  onChange,
}: {
  placeholder?: string;
  className?: string;
  max?: number;
  value?: string;
  onChange?: (value?: string) => void;
}) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const onPaste = async (event: ClipboardEvent) => {
    const data = await navigator.clipboard.readText();
    navigator.clipboard.writeText(data);
  };

  useEffect(() => {
    window.addEventListener("paste", onPaste);
    fixHeight();
    return () => window.removeEventListener("paste", onPaste);
  }, []);

  const [text, setText] = useState(value as string);

  function fixHeight() {
    if (ref.current?.scrollHeight) {
      ref.current.style.height = `auto`;
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  }

  return (
    <div className="relative">
      <textarea
        rows={1}
        className={cn([
          "w-full resize-none overflow-hidden bg-transparent outline-none selection:bg-primary selection:text-foreground placeholder:text-muted",
          className,
        ])}
        placeholder={placeholder}
        defaultValue={text}
        ref={ref}
        onChange={(event) => {
          setText(event.target.value);
          if (onChange) onChange(event.target.value);
          fixHeight();
        }}
        onKeyDown={(event) => {
          if (
            event.currentTarget.value.length >= max &&
            event.key.toLowerCase() !== "backspace"
          ) {
            event.preventDefault();
          }
        }}
      ></textarea>

      {text && text.length > max - 30 && (
        <div
          className={`${
            text.length > max - 10
              ? "text-rose-700"
              : text.length > max - 30
              ? "text-yellow-600"
              : ""
          } absolute -bottom-4 right-0 text-[10px]`}
        >
          {text.length - max}
        </div>
      )}
    </div>
  );
};

FancyInputText.displayName = "FancyInputText";

export default FancyInputText;
