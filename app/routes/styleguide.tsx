import type { V2_MetaFunction } from "@remix-run/node";
import { Sun } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Toggle } from "~/components/ui/toggle";

export const meta: V2_MetaFunction = () => [
	{
		title: "Styleguide",
		description: "",
	},
];

const StyleGuide = () => (
	<div className="p-12">
		<h1>StyleGuide</h1>
		<div className="flex gap-8 text-xs tracking-wider font-medium mb-12 border-b py-4">
			<a href="#headings">Headings</a>
			<a href="#colors">Colors</a>
			<a href="#components">Components</a>
		</div>
		<h3 id="headings">Headings</h3>
		<div>
			<h1>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</h1>
			<h2>
				Debitis atque hic voluptas, labore laudantium nisi sapiente?
			</h2>
			<h3>
				Vitae quia consequatur sunt nostrum quisquam facilis mollitia?
			</h3>
			<h4>
				Molestias voluptate, eos neque adipisci laudantium numquam
				asperiores.
			</h4>
			<h5>Corporis aliquam nobis repellendus illum quos atque odit.</h5>
		</div>
		<hr className="my-12" id="colors" />
		<h3>Colors</h3>
		<div className="grid sm:grid-cols-6 gap-4 text-center font-medium">
			<div className="col-span-3 bg-background p-4 rounded-md text-foreground">
				background foreground
			</div>
			<div className="col-span-3 bg-card text-card-foreground p-4 rounded-md">
				card card-foreground
			</div>
			<div className="col-span-3 bg-popover text-popover-foreground p-4 rounded-md">
				popover popover-foreground
			</div>
			<div className="col-span-3 bg-primary text-primary-foreground p-4 rounded-md">
				primary primary-foreground
			</div>
			<div className="col-span-3 bg-secondary text-secondary-foreground p-4 rounded-md">
				secondary secondary-foreground
			</div>
			<div className="col-span-3 bg-muted text-muted-foreground p-4 rounded-md">
				muted muted-foreground
			</div>
			<div className="col-span-3 bg-accent text-accent-foreground p-4 rounded-md">
				accent accent-foreground
			</div>

			<div className="col-span-3 bg-destructive text-destructive-foreground p-4 rounded-md">
				destructive destructive-foreground
			</div>

			<div className="col-span-2 bg-border p-4 rounded-md">border</div>
			<div className="col-span-2 bg-input p-4 rounded-md">input</div>
			<div className="col-span-2 bg-ring p-4 rounded-md">ring</div>
		</div>
		<hr className="my-12" id="components" />
		<h3>Components</h3>
		<div>
			<h4 className="mb-8">Buttons</h4>

			<div className="grid sm:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
				<div>
					<Button variant={"default"}>default</Button>
				</div>
				<div>
					<Button variant={"destructive"}>destructive</Button>
				</div>
				<div>
					<Button variant={"ghost"}>ghost</Button>
				</div>
				<div>
					<Button variant={"link"}>link</Button>
				</div>
				<div>
					<Button variant={"outline"}>outline</Button>
				</div>
				<div>
					<Button variant={"secondary"}>secondary</Button>
				</div>
			</div>
		</div>
		<div>
			<h4 className="my-16 mb-8">Input</h4>
			<div className="grid sm:grid-cols-2 gap-8 text-center">
				<div>
					<Input value="input normal" />
				</div>
				<div>
					<Input disabled value="input disabled" />
				</div>
			</div>
		</div>
		<div>
			<h4 className="my-16 mb-8">Toggle</h4>
			<div className="grid sm:grid-cols-3 gap-8 text-center">
				<div className="space-y-2">
					<div>Toggle</div>
					<Toggle>
						<Sun className="w-4 h-4" />
					</Toggle>
				</div>
				<div className="space-y-2">
					<div>Toggle outline</div>
					<Toggle variant={"outline"}>
						<Sun className="w-4 h-4" />
					</Toggle>
				</div>
				<div className="space-y-2">
					<div>Toggle disabled</div>
					<Toggle disabled variant={"outline"}>
						<Sun className="w-4 h-4" />
					</Toggle>
				</div>
			</div>
		</div>
	</div>
);

export default StyleGuide;
