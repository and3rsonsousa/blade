import { type ActionFunction } from "@vercel/remix";
import { formatISO } from "date-fns";
import supabaseServer from "~/lib/supabase.server";

export const config = { runtime: "edge" };

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const actionToHandle = formData.get("action") as string;

  const response = new Response();
  const supabase = supabaseServer({ request, response });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (actionToHandle === "create-action") {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const state_id = Number(formData.get("state_id"));
    const client_id = Number(formData.get("client_id"));
    const date = formData.get("date") as string;
    const category_id = Number(formData.get("category_id"));

    const action = {
      title,
      description,
      state_id,
      client_id,
      date,
      category_id,
      user_id: session?.user.id,
      priority_id: "af6ceef7-7c70-44c9-b187-ee9d376c15c1",
    };

    const { data, error } = await supabase
      .from("actions")
      .insert(action)
      .select()
      .single();

    return { data, error };
  } else if (actionToHandle === "update-action") {
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const state_id = Number(formData.get("state_id"));
    const client_id = Number(formData.get("client_id"));
    const date = formData.get("date") as string;
    const category_id = Number(formData.get("category_id"));
    const responsibles = String(formData.get("responsibles")).split(",");
    const updated_at = String(formatISO(new Date()));
    const priority_id =
      String(formData.get("priority_id")) === "null"
        ? ""
        : String(formData.get("priority_id"));
    console.log({
      responsibles,
    });

    type ActionToUpdate = {
      title: string;
      description: string;
      state_id: number;
      client_id: number;
      date: string;
      category_id: number;
      updated_at: string;
      priority_id: string;
      responsibles: string[];
    };

    const action: ActionToUpdate = {
      title,
      description,
      state_id,
      client_id,
      date,
      category_id,
      priority_id,
      updated_at,
      responsibles,
    };

    Object.keys(action).forEach((key) => {
      if (!action[key as keyof ActionToUpdate]) {
        delete action[key as keyof ActionToUpdate];
      }
    });

    const { data, error } = await supabase
      .from("actions")
      .update(action)
      .eq("id", id)
      .single();

    return { data, error };
  } else if (actionToHandle === "delete-action") {
    const id = formData.get("id") as string;

    const { data, error } = await supabase
      .from("actions")
      .delete()
      .eq("id", id)
      .select()
      .single();

    return { data, error };
  } else if (actionToHandle === "duplicate-action") {
    const id = (await formData.get("id")) as string;
    const { data: action } = await supabase
      .from("actions")
      .select("*")
      .eq("id", id)
      .single();
    if (action) {
      Object.keys(action).forEach((key) => {
        if (["created_at", "updated_at", "id"].find((k) => k === key)) {
          delete action[key as keyof Action];
        }
      });
      const { data, error } = await supabase
        .from("actions")
        .insert(action)
        .select()
        .single();

      return { data, error };
    }
    return {};
  } else if (actionToHandle === "create-celebration") {
    const title = formData.get("title") as string;
    const date = formData.get("date") as string;
    const is_holiday = formData.get("is_holiday") === "true";

    const celebration = {
      title,
      date,
      is_holiday,
    };

    const { data, error } = await supabase
      .from("celebration")
      .insert(celebration)
      .select()
      .single();

    return { data, error };
  } else if (actionToHandle === "delete-celebration") {
    const id = formData.get("id") as string;
    const { data, error } = await supabase
      .from("celebration")
      .delete()
      .eq("id", id)
      .select()
      .single();

    return { data, error };
  } else if (actionToHandle === "create-client") {
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const short = formData.get("short") as string;
    const fgColor = formData.get("fgColor") as string;
    const bgColor = formData.get("bgColor") as string;

    const client = {
      title,
      slug,
      short,
      fgColor,
      bgColor,
    };

    const { data, error } = await supabase
      .from("clients")
      .insert(client)
      .select()
      .single();

    return { data, error };
  } else if (actionToHandle === "update-client") {
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const short = formData.get("short") as string;
    const fgColor = formData.get("fgColor") as string;
    const bgColor = formData.get("bgColor") as string;

    const client = {
      title,
      slug,
      short,
      fgColor,
      bgColor,
    };

    const { data, error } = await supabase
      .from("clients")
      .update(client)
      .eq("id", id)
      .select()
      .single();

    return { data, error };
  }
};
