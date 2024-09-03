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
import {
  Cross2Icon,
  DotsVerticalIcon,
  Pencil1Icon,
} from "@radix-ui/react-icons";
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
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const createComponentFormSchema = z.object({
  label: z.string().min(2).max(50),
});

const editContainerFormSchema = z.object({
  label: z.string().min(2).max(50),
});

export default function Container({ container }: { container: Container }) {
  const [isEditing, setIsEditing] = useState<Boolean>(false);

  const architectureData = useNodeContext();

  const createComponentForm = useForm<
    z.infer<typeof createComponentFormSchema>
  >({
    resolver: zodResolver(createComponentFormSchema),
    defaultValues: {
      label: "",
    },
    shouldUnregister: true,
  });

  const editContainerForm = useForm<z.infer<typeof editContainerFormSchema>>({
    resolver: zodResolver(editContainerFormSchema),
    defaultValues: {
      label: container?.label || "",
    },
    shouldUnregister: true,
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
    const editedContainer = {
      ...container,
      label,
    };
    architectureData?.editNode(editedContainer);
    setIsEditing(false);
  };
  return (
    <div className="bg-green-500 flex flex-col gap-4 p-8">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" type="button" size="icon">
            <DotsVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              architectureData?.removeNode(container);
            }}
          >
            Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex items-center">
        {!isEditing ? (
          <h1>{container.label}</h1>
        ) : (
          <Form {...editContainerForm}>
            <form
              onSubmit={editContainerForm.handleSubmit(onEdit)}
              className="space-y-8"
            >
              <FormField
                control={editContainerForm.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
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
        )}
        <Button
          variant="ghost"
          type="button"
          size="icon"
          onClick={() => setIsEditing((prev) => !prev)}
        >
          {!isEditing ? <Pencil1Icon /> : <Cross2Icon />}
        </Button>
      </div>
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
    </div>
  );
}
