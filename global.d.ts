import type { Database as DB } from "db_types";

declare global {
	type Action = DB["public"]["Tables"]["actions"]["Row"];

	type Database = DB;
	type DayType = {
		day: Date;
		actions: Action[];
	};
	type CalendarType = DayType[];
}
