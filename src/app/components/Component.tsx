"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNodeContext } from "../components/NodeContext";
import { v4 as uuidv4 } from "uuid";
import { Component, NodeType } from "../types/context";
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
import Code from "./Code";
import { useState } from "react";

const createCodeFormSchema = z.object({
  label: z.string().min(2).max(50),
});

const editComponentFormSchema = z.object({
  label: z.string().min(2).max(50),
});

export default function Component({ component }: { component: Component }) {
  const [isEditing, setIsEditing] = useState<Boolean>(false);
  const architectureData = useNodeContext();

  const createCodeForm = useForm<z.infer<typeof createCodeFormSchema>>({
    resolver: zodResolver(createCodeFormSchema),
    defaultValues: {
      label: "",
    },
  });

  const editComponentForm = useForm<z.infer<typeof createCodeFormSchema>>({
    resolver: zodResolver(createCodeFormSchema),
    defaultValues: {
      label: component?.label || "",
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
  const onEdit = (values: z.infer<typeof editComponentFormSchema>) => {
    const { label } = values;
    const editedComponent = {
      ...component,
      label,
    };
    architectureData?.editNode(editedComponent);
    setIsEditing(false);
  };

  return (
    <div className="bg-blue-500 flex flex-col gap-4 p-8">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" type="button" size="icon">
            <DotsVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              architectureData?.removeNode(component);
            }}
          >
            Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="flex items-center">
        {!isEditing ? (
          <h1>{component.label}</h1>
        ) : (
          <Form {...editComponentForm}>
            <form
              onSubmit={editComponentForm.handleSubmit(onEdit)}
              className="space-y-8"
            >
              <FormField
                control={editComponentForm.control}
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

      {component.children.map((code, index) => (
        <Code code={code} key={`code-${index}`} />
      ))}
      <Popover>
        <PopoverTrigger asChild>
          <Button type="button">Add Code</Button>
        </PopoverTrigger>
        <PopoverContent>
          <Form {...createCodeForm}>
            <form
              onSubmit={createCodeForm.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <PopoverClose>
                <Cross2Icon />
              </PopoverClose>

              <FormField
                control={createCodeForm.control}
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
