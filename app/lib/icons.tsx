import {
	CheckCircleIcon,
	CircleDashedIcon,
	DollarSignIcon,
	ImageIcon,
	PlayIcon,
	PrinterIcon,
	UsersIcon,
	X,
	type LucideIcon,
} from "lucide-react";
import { cn } from "./utils";

const iconsList: { [key: string]: LucideIcon } = {
	post: ImageIcon,
	video: PlayIcon,
	stories: CircleDashedIcon,
	todo: CheckCircleIcon,
	finance: DollarSignIcon,
	print: PrinterIcon,
	meeting: UsersIcon,
};

export const CategoryIcons = ({
	id,
	className,
}: {
	id?: string;
	className?: string;
}) => {
	const View = iconsList[id as string] ?? X;

	return <View className={cn(className)} />;
};
