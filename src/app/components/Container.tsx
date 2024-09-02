"use client";

import { useNodeContext } from "../components/NodeContext";
import { v4 as uuidv4 } from "uuid";
import { Container, NodeType } from "../types/context";
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
import Component from "./Component";

const createComponentFormSchema = z.object({
  label: z.string().min(2).max(50),
});

const editContainerFormSchema = z.object({
  label: z.string().min(2).max(50),
});

export default function Container({ container }: { container: Container }) {
  const architectureData = useNodeContext();

  const createComponentForm = useForm<
    z.infer<typeof createComponentFormSchema>
  >({
    resolver: zodResolver(createComponentFormSchema),
    defaultValues: {
      label: "",
    },
  });

  const editContainerForm = useForm<z.infer<typeof editContainerFormSchema>>({
    resolver: zodResolver(editContainerFormSchema),
    defaultValues: {
      label: container?.label || "",
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

  const onEdit = (values: z.infer<typeof editContainerFormSchema>) => {
    const { label } = values;
    const newComponent = {
      ...container,
      label,
    };
    architectureData?.editNode(newComponent);
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
          <Form {...createComponentForm}>
            <form
              onSubmit={createComponentForm.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <PopoverClose>
                <Cross2Icon />
              </PopoverClose>

              <FormField
                control={createComponentForm.control}
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
      {/* Edit Container*/}
      <Popover>
        <PopoverTrigger asChild>
          <Button type="button">Edit Container</Button>
        </PopoverTrigger>
        <PopoverContent>
          <Form {...editContainerForm}>
            <form
              onSubmit={editContainerForm.handleSubmit(onEdit)}
              className="space-y-8"
            >
              <PopoverClose>
                <Cross2Icon />
              </PopoverClose>

              <FormField
                control={editContainerForm.control}
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
  );
}
