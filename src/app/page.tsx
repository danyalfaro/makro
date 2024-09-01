"use client";

import { useNodeContext } from "./components/NodeContext";
import { v4 as uuidv4 } from "uuid";
import { Container, Component, Code, NodeType } from "./types/context";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { PopoverClose } from "@radix-ui/react-popover";
import { Cross2Icon } from "@radix-ui/react-icons";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function Home() {
  const architectureData = useNodeContext();

  const createContainerFormSchema = z.object({
    label: z.string().min(2).max(50),
  });

  const form = useForm<z.infer<typeof createContainerFormSchema>>({
    resolver: zodResolver(createContainerFormSchema),
    defaultValues: {
      label: "",
    },
  });

  const onSubmit = (values: z.infer<typeof createContainerFormSchema>) => {
    const { label } = values;
    const newContainer = {
      id: uuidv4(),
      label,
      type: NodeType.CONTAINER,
      children: [],
    };
    architectureData?.addNode(architectureData.data[0].id, newContainer);
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {architectureData && architectureData.data && (
        <div className="flex gap-2">
          {architectureData.data.map((context) =>
            context.children.map((container, index) => (
              <Container container={container} key={`container-${index}`} />
            ))
          )}
          <Popover>
            <PopoverTrigger asChild>
              <Button type="button">Add Container</Button>
            </PopoverTrigger>
            <PopoverContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <PopoverClose>
                    <Cross2Icon />
                  </PopoverClose>

                  <FormField
                    control={form.control}
                    name="label"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Label</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          The label used for the container.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Submit</Button>
                </form>
              </Form>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </main>
  );
}

function Container({ container }: { container: Container }) {
  const architectureData = useNodeContext();

  const createComponentFormSchema = z.object({
    label: z.string().min(2).max(50),
  });

  const form = useForm<z.infer<typeof createComponentFormSchema>>({
    resolver: zodResolver(createComponentFormSchema),
    defaultValues: {
      label: "",
    },
  });

  const onSubmit = (values: z.infer<typeof createComponentFormSchema>) => {
    const { label } = values;
    const newComponent = {
      id: uuidv4(),
      label,
      type: NodeType.COMPONENT,
      children: [],
    };
    architectureData?.addNode(container.id, newComponent);
  };
  return (
    <div className="bg-green-500 flex flex-col gap-4 p-8">
      <Button
        type="button"
        onClick={() => {
          architectureData?.removeNode(container);
        }}
      >
        Remove Container
      </Button>

      <h1>Container</h1>
      <h1>{container.label}</h1>
      {container.children.map((component, index) => (
        <Component component={component} key={`component-${index}`} />
      ))}
      <Popover>
        <PopoverTrigger asChild>
          <Button type="button">Add Component</Button>
        </PopoverTrigger>
        <PopoverContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <PopoverClose>
                <Cross2Icon />
              </PopoverClose>

              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Label</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      The label used for the component.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function Component({ component }: { component: Component }) {
  const architectureData = useNodeContext();

  const createCodeFormSchema = z.object({
    label: z.string().min(2).max(50),
  });

  const form = useForm<z.infer<typeof createCodeFormSchema>>({
    resolver: zodResolver(createCodeFormSchema),
    defaultValues: {
      label: "",
    },
  });

  const onSubmit = (values: z.infer<typeof createCodeFormSchema>) => {
    const { label } = values;
    const newCode = {
      id: uuidv4(),
      label,
      type: NodeType.CODE,
      children: [],
    };
    architectureData?.addNode(component.id, newCode);
  };
  return (
    <div className="bg-blue-500 flex flex-col gap-4 p-8">
      <Button
        type="button"
        onClick={() => {
          architectureData?.removeNode(component);
        }}
      >
        Remove Component
      </Button>
      <h1>Component</h1>
      <h1>{component.label}</h1>
      {component.children.map((code, index) => (
        <Code code={code} key={`code-${index}`} />
      ))}
      <Popover>
        <PopoverTrigger asChild>
          <Button type="button">Add Code</Button>
        </PopoverTrigger>
        <PopoverContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <PopoverClose>
                <Cross2Icon />
              </PopoverClose>

              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Label</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      The label used for the code.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function Code({ code }: { code: Code }) {
  const architectureData = useNodeContext();

  return (
    <div className="bg-gray-400 flex flex-col gap-4 p-8">
      <Button
        type="button"
        onClick={() => {
          architectureData?.removeNode(code);
        }}
      >
        Remove Code
      </Button>
      <h1>Code</h1>
      <h1>{code.label}</h1>
    </div>
  );
}
