import { forwardRef, useState, type ReactNode } from "react";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

const FancySelectInput = forwardRef<
	HTMLButtonElement,
	{
		placeholder?: string;
		items: GenericItem[];
		selectedValue?: string;
		itemValue?: (item?: GenericItem) => ReactNode;
		itemMenu?: (item: GenericItem) => ReactNode;
		onChange?: (value?: string) => void;
	}
>(
	(
		{ placeholder, items, selectedValue, itemValue, itemMenu, onChange },
		ref
	) => {
		const [selected, setSelected] = useState(selectedValue);

		return (
			<Select
				defaultValue={selected !== "" ? selected : undefined}
				onValueChange={(value) => {
					setSelected(value);
					if (onChange) onChange(value);
				}}
			>
				<SelectTrigger className="p-2 h-auto w-auto bg-transparent border-none hover:bg-foreground/10">
					{itemValue ? (
						itemValue(
							items.find((item) => String(item.id) === selected)
						)
					) : (
						<SelectValue
							placeholder={placeholder || "Escolha uma opção"}
						/>
					)}
				</SelectTrigger>
				<SelectContent className="bg-content">
					{items.map((item) =>
						itemMenu ? (
							itemMenu(item)
						) : (
							<SelectItem
								key={`${item.id}-${Date.now()}`}
								value={String(item.id)}
								className="menu-item"
							>
								{item.title}
							</SelectItem>
						)
					)}
				</SelectContent>
			</Select>
		);
	}
);

FancySelectInput.displayName = "FancySelectInput";
export default FancySelectInput;
