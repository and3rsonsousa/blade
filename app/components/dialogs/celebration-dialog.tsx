import { useFetcher } from "@remix-run/react";

import { formatISO } from "date-fns";
import { Check, Loader2Icon, StarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { removeTags } from "~/lib/utils";

import FancyDatetimePicker from "../atoms/fancy-datetime";
import FancyInputText from "../atoms/fancy-input";
import { Button } from "../ui/button";
import { Toggle } from "../ui/toggle";
type CelebrationType = {
  title: string;
  date: Date;
  is_holiday: boolean;
};
type CelebrationDialogType = {
  closeDialog?: () => void;
};

export default function CelebrationDialog({
  closeDialog,
}: CelebrationDialogType) {
  const baseDate = new Date();
  const fetcher = useFetcher();

  //
  const [celebration, setCelebration] = useState<CelebrationType>({
    title: "",
    date: baseDate,
    is_holiday: false,
  });

  const busy = fetcher.state !== "idle";

  useEffect(() => {
    if (
      fetcher.state === "idle" &&
      fetcher.data &&
      Object.keys(fetcher.data).find((k) => k === "data")
    )
      if (closeDialog) closeDialog();
  }, [fetcher, closeDialog]);

  function createCelebration() {
    fetcher.submit(
      {
        action: "create-celebration",
        title: celebration.title as string,
        date: formatISO(celebration.date),
        is_holiday: celebration.is_holiday,
      },
      {
        method: "post",
        action: "/handle-action",
      },
    );
  }

  return (
    <div>
      <div>
        {/* Título */}
        <div className={`p-8  pb-0 max-sm:p-4 `}>
          <FancyInputText
            onBlur={(value) => {
              setCelebration({
                ...celebration,
                title: removeTags(value!),
              });
            }}
            placeholder="Título da data comemorativa"
            className={`text-2xl font-semibold`}
          />
        </div>
      </div>
      {/* Botões */}
      <div className="w-full shrink-0">
        <div className="mt-4 justify-between gap-4 overflow-hidden border-t border-foreground/10 px-2 py-4 sm:flex sm:px-6">
          <div className="col-span-3 flex w-full justify-between gap-1 sm:justify-start">
            <Toggle
              pressed={celebration.is_holiday}
              onPressedChange={(pressed) =>
                setCelebration({ ...celebration, is_holiday: pressed })
              }
              size={"sm"}
              className="gap-2"
            >
              <StarIcon size={16} /> É feriado?{" "}
              <span className="text-xs uppercase">
                {celebration.is_holiday ? "SIM" : "NÃO"}
              </span>
            </Toggle>
          </div>
          {/* Data e Botão */}
          <div className="flex w-full justify-between gap-1 sm:justify-end">
            <FancyDatetimePicker
              date={celebration.date}
              onSelect={(value) => {
                setCelebration({ ...celebration, date: value });
              }}
              time={false}
            />

            <Button
              variant={
                isValidCelebration(celebration) || busy
                  ? "default"
                  : "secondary"
              }
              size={"sm"}
              onClick={() => createCelebration()}
              disabled={!isValidCelebration(celebration) || busy}
            >
              {busy ? (
                <Loader2Icon size={16} className="animate-spin" />
              ) : (
                <>
                  {"Inserir"}
                  <Check size={16} className="ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function isValidCelebration(celebration: CelebrationType) {
  let valid = true;
  if (!celebration.title) valid = false;
  if (!celebration.date) valid = false;

  return valid;
}
