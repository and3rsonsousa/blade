import type { Database as DB } from "db_types";

declare global {
	type Action = DB["public"]["Tables"]["actions"]["Row"];
	type Client = DB["public"]["Tables"]["clients"]["Row"];
	type Category = DB["public"]["Tables"]["categories"]["Row"];
	type State = DB["public"]["Tables"]["states"]["Row"];
	type GenericItem = { id: number; title: string; slug?: string };

	type Database = DB;
	type DayType = {
		date: Date;
		actions: Action[];
	};
	type DaysType = DayType[];
}
