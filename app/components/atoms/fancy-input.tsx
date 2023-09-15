import { type LegacyRef, forwardRef, useEffect, useState } from "react";
import { cn } from "~/lib/utils";

const FancyInputText = forwardRef<
  HTMLDivElement | HTMLTextAreaElement,
  {
    placeholder?: string;
    className?: string;
    max?: number;
    value?: string;
    onChange?: (value?: string) => void;
  }
>(({ placeholder, value, className, max = 70, onChange }, ref) => {
  const onPaste = async (event: ClipboardEvent) => {
    const data = await navigator.clipboard.readText();
    navigator.clipboard.writeText(data);
  };

  useEffect(() => {
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, []);

  const [text, setText] = useState(value as string);

  return (
    <div className="relative">
      <textarea
        rows={1}
        className={cn([
          "w-full resize-none overflow-hidden bg-transparent outline-none",
          className,
        ])}
        ref={ref as LegacyRef<HTMLTextAreaElement>}
        placeholder={placeholder}
        defaultValue={text}
        onChange={(event) => {
          event.target.style.height = `${event.target.scrollHeight}px`;
          setText(event.target.value);
          if (onChange) onChange(text);
        }}
        style={{ height: "auto" }}
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
});

FancyInputText.displayName = "FancyInputText";

export default FancyInputText;
