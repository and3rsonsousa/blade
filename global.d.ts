import type { Database as DB } from "db_types";

declare global {
	type Action = DB["public"]["Tables"]["actions"]["Row"];
	type Category = DB["public"]["Tables"]["categories"]["Row"];

	type Database = DB;
	type DayType = {
		date: Date;
		actions: Action[];
	};
	type DaysType = DayType[];
}
