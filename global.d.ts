import type { Database as DB } from "db_types";

declare global {
	type Action = DB["public"]["Tables"]["actions"]["Row"];
	type Celebration = DB["public"]["Tables"]["celebration"]["Row"];
	type Client = DB["public"]["Tables"]["clients"]["Row"];
	type Person = DB["public"]["Tables"]["people"]["Row"];
	type Category = DB["public"]["Tables"]["categories"]["Row"];
	type State = DB["public"]["Tables"]["states"]["Row"];
	type GenericItem = { id: number; title: string; slug?: string };

	type Database = DB;
	type DayType = {
		date: Date;
		actions: Action[];
		celebrations: Celebration[]
	};
	type DaysType = DayType[];

	const isDebbuging = true;
}
