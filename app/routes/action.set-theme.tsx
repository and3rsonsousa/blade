import { json } from "@vercel/remix";
import type { ActionFunction } from "@vercel/remix";
import { useFetcher } from "@remix-run/react";
import { Toggle } from "~/components/ui/toggle";
import { setTheme } from "~/lib/theme-session.server";
import type { Theme } from "~/lib/utils";
import { useHints, isTheme, useRequestInfo } from "~/lib/utils";

export const action: ActionFunction = async ({ request }) => {
  const requestText = await request.text();
  const form = new URLSearchParams(requestText);
  const theme = form.get("theme");

  if (!isTheme(theme)) {
    return json({
      success: false,
      message: `theme value of ${theme} is not a valid theme`,
    });
  }

  return json(
    { success: true },
    {
      headers: {
        "Set-Cookie": setTheme(theme === "system" ? undefined : theme),
      },
    },
  );
};

export function ThemeSwitch() {
  const fetcher = useFetcher();

  const handleSelect = (themeValue: Theme) => {
    fetcher.submit(
      { theme: themeValue },
      { method: "post", action: "/action/set-theme" },
    );
  };

  return (
    <Toggle
      onChange={(event) => handleSelect(event.currentTarget.value as Theme)}
    />
  );
}

/**
 * @returns the user's theme preference, or the client hint theme if the user
 * has not set a preference.
 */
export function useTheme() {
  const hints = useHints();
  const requestInfo = useRequestInfo();
  return requestInfo.userPrefs.theme ?? hints.theme;
}
