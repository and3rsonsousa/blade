import type { V2_MetaFunction } from "@vercel/remix";
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
    <div className="mb-12 flex gap-8 border-b py-4 text-xs font-medium tracking-wider">
      <a href="#headings">Headings</a>
      <a href="#colors">Colors</a>
      <a href="#components">Components</a>
    </div>
    <h3 id="headings">Headings</h3>
    <div>
      <h1>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</h1>
      <h2>Debitis atque hic voluptas, labore laudantium nisi sapiente?</h2>
      <h3>Vitae quia consequatur sunt nostrum quisquam facilis mollitia?</h3>
      <h4>
        Molestias voluptate, eos neque adipisci laudantium numquam asperiores.
      </h4>
      <h5>Corporis aliquam nobis repellendus illum quos atque odit.</h5>
    </div>
    <hr className="my-12" id="colors" />
    <h3>Colors</h3>
    <div className="grid gap-4 text-center font-medium sm:grid-cols-6">
      <div className="col-span-3 rounded-md bg-background p-4 text-foreground">
        background foreground
      </div>
      <div className="col-span-3 rounded-md bg-card p-4 text-card-foreground">
        card card-foreground
      </div>
      <div className="col-span-3 rounded-md bg-popover p-4 text-popover-foreground">
        popover popover-foreground
      </div>
      <div className="col-span-3 rounded-md bg-primary p-4 text-primary-foreground">
        primary primary-foreground
      </div>
      <div className="col-span-3 rounded-md bg-secondary p-4 text-secondary-foreground">
        secondary secondary-foreground
      </div>
      <div className="col-span-3 rounded-md bg-muted p-4 text-muted-foreground">
        muted muted-foreground
      </div>
      <div className="col-span-3 rounded-md bg-accent p-4 text-accent-foreground">
        accent accent-foreground
      </div>

      <div className="col-span-3 rounded-md bg-destructive p-4 text-destructive-foreground">
        destructive destructive-foreground
      </div>

      <div className="col-span-2 rounded-md bg-border p-4">border</div>
      <div className="col-span-2 rounded-md bg-input p-4">input</div>
      <div className="col-span-2 rounded-md bg-ring p-4">ring</div>
    </div>
    <hr className="my-12" id="components" />
    <h3>Components</h3>
    <div>
      <h4 className="mb-8">Buttons</h4>

      <div className="grid gap-8 text-center sm:grid-cols-3 lg:grid-cols-6">
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
      <div className="grid gap-8 text-center sm:grid-cols-2">
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
      <div className="grid gap-8 text-center sm:grid-cols-3">
        <div className="space-y-2">
          <div>Toggle</div>
          <Toggle>
            <Sun className="h-4 w-4" />
          </Toggle>
        </div>
        <div className="space-y-2">
          <div>Toggle outline</div>
          <Toggle variant={"outline"}>
            <Sun className="h-4 w-4" />
          </Toggle>
        </div>
        <div className="space-y-2">
          <div>Toggle disabled</div>
          <Toggle disabled variant={"outline"}>
            <Sun className="h-4 w-4" />
          </Toggle>
        </div>
      </div>
    </div>
  </div>
);

export default StyleGuide;
