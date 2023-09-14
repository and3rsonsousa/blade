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
    <div>
      <div className="bg-background py-8">
        <div className="flex">
          <div className="w-2/3">
            <h1 className="mb-2">Lorem ipsum dolor sit amet consectetur.</h1>
            <h5 className="text-muted">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vitae
              voluptates quia dolorum.
            </h5>
            <div className="mt-4 flex gap-2">
              <Button>Get it</Button>
              <Button variant={"secondary"}>Later</Button>
            </div>
          </div>
          <div className="relative w-1/3 rounded-lg bg-card p-8 text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti
            nemo officia sint expedita corporis, sit magni voluptatem modi
            maiores numquam neque esse tempore. Officia quos nulla laudantium
            placeat corrupti? A.
            <div className="mt-4 text-right">
              <Button variant={"secondary"} size={"sm"}>
                Perfect
              </Button>
            </div>
            <div className="absolute -left-8 top-4 w-48 rounded-lg border border-foreground/10  bg-popover/25 p-4 text-xs shadow-2xl shadow-black backdrop-blur-xl">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Consequuntur id nihil porro? Quibusdam, reiciendis nesciunt!
              <div className="mt-2">
                <Button variant={"secondary"} size={"sm"}>
                  Perfect
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
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
          <Input defaultValue="input normal" />
        </div>
        <div>
          <Input disabled defaultValue="input disabled" />
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
