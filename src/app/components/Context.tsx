"use client";

import { useNodeContext } from "../components/NodeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PopoverClose } from "@radix-ui/react-popover";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Context, NodeType } from "../types/context";
import { useState } from "react";
import Container from "./Container";
import { v4 as uuidv4 } from "uuid";

const editContextFormSchema = z.object({
  label: z.string().min(2).max(50),
});
const createContainerFormSchema = z.object({
  label: z.string().min(2).max(50),
});

export default function Context({ context }: { context: Context }) {
  const [isEditing, setIsEditing] = useState<Boolean>(false);

  const architectureData = useNodeContext();

  const editContextForm = useForm<z.infer<typeof editContextFormSchema>>({
    resolver: zodResolver(editContextFormSchema),
    defaultValues: {
      label: context?.label || "",
    },
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

  const onEdit = (values: z.infer<typeof editContextFormSchema>) => {
    const { label } = values;
    const newContext = {
      ...context,
      label,
    };
    architectureData?.editNode(newContext);
    setIsEditing(false);
  };

  return (
    <div className="bg-gray-400 flex items-start gap-4 p-8">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" type="button" size="icon">
            <DotsVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              architectureData?.removeNode(context);
            }}
          >
            Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex items-center">
        {!isEditing ? (
          <h1>{context.label}</h1>
        ) : (
          <Form {...editContextForm}>
            <form
              onSubmit={editContextForm.handleSubmit(onEdit)}
              className="space-y-8"
            >
              <FormField
                control={editContextForm.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
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
      {context.children.map((container, index) => (
        <Container container={container} key={`container-${index}`} />
      ))}
      <Popover>
        <PopoverTrigger asChild>
          <Button type="button">Add Container</Button>
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
