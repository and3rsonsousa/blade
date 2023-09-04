import {
  CircleDashedIcon,
  DollarSignIcon,
  ImageIcon,
  ListChecksIcon,
  PlayIcon,
  PrinterIcon,
  SignalIcon,
  SignalLowIcon,
  SignalMediumIcon,
  UsersIcon,
  XIcon,
  type LucideIcon,
} from "lucide-react";
import { cn } from "./utils";

const categoryIconsList: { [key: string]: LucideIcon } = {
  post: ImageIcon,
  video: PlayIcon,
  stories: CircleDashedIcon,
  todo: ListChecksIcon,
  finance: DollarSignIcon,
  print: PrinterIcon,
  meeting: UsersIcon,
};

const priorityIconsList: { [key: string]: LucideIcon } = {
  low: SignalLowIcon,
  mid: SignalMediumIcon,
  high: SignalIcon,
  base: SignalIcon,
};

export const CategoryIcons = ({
  id,
  className,
}: {
  id?: string;
  className?: string;
}) => {
  const View = categoryIconsList[id as string] ?? XIcon;

  return <View className={cn(className)} />;
};

export const PriorityIcons = ({
  id,
  className,
}: {
  id?: string;
  className?: string;
}) => {
  const View = priorityIconsList[id as string] ?? SignalIcon;

  return <View className={cn(className)} />;
};
