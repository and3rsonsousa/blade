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
		itemContent?: (item: GenericItem) => ReactNode;
		onChange?: (value?: string) => void;
	}
>(({ placeholder, items, selectedValue, itemContent, onChange }, ref) => {
	const [selected, setSelected] = useState(selectedValue);

	return (
		<Select
			defaultValue={selected}
			onValueChange={(value) => {
				setSelected(value);
				if (onChange) onChange(value);
			}}
		>
			<SelectTrigger className="p-2 h-auto bg-transparent border-none hover:bg-foreground/10">
				{/* <Button>{placeholder}</Button> */}
				<SelectValue placeholder={placeholder || "Escolha uma opção"} />
			</SelectTrigger>
			<SelectContent className="bg-content">
				{items.map((item) => (
					<SelectItem
						key={item.id}
						value={String(item.id)}
						className="menu-item"
					>
						{item.title}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
});

FancySelectInput.displayName = "FancySelectInput";
export default FancySelectInput;
