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
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { STYLE } from '../types/styles'

const createCodeFormSchema = z.object({
  label: z.string().min(2).max(50),
})

const editComponentFormSchema = z.object({
  label: z.string().min(2).max(50),
})

const componentVariants = cva('disabled:opacity-50', {
  variants: {
    variant: {
      [STYLE.MINIMALISM]:
        'flex flex-col gap-4 text-black-foreground bg-black bg-opacity-5 rounded-xl',
      [STYLE.NEUMORPHISM]:
        'flex flex-col gap-4 rounded-xl text-black-foreground shadow-[-7px_-7px_12px_3px_rgba(255,255,255,0.7),7px_7px_12px_3px_rgba(0,0,0,0.10)]',
      [STYLE.NEUBRUTALISM]:
        'flex flex-col gap-8 font-bold text-black-foreground shadow-[14px_14px_0px_0px_rgba(0,0,0,0.9)] border-solid border-black border-2',
      [STYLE.GLASSMORPHISM]:
        'flex flex-col gap-4 bg-[#eeeeee] text-black-foreground shadow-[0px_10px_20px_0px_rgba(0,0,0,0.12)] border-solid border-[#ffffff20] border-[1px] backdrop-blur rounded-xl bg-white bg-opacity-5',
    },
    size: {
      default: 'p-8',
      sm: 'h-8 rounded-md px-3 text-xs',
      lg: 'h-10 rounded-md px-8',
      icon: 'h-9 w-9',
    },
  },
  defaultVariants: {
    variant: STYLE.MINIMALISM,
    size: 'default',
  },
})

export default function Component({
  component,
  variant,
  size,
}: { component: Component } & VariantProps<typeof componentVariants>) {
  const [isEditing, setIsEditing] = useState<Boolean>(false);
  const architectureData = useNodeContext();

  const createCodeForm = useForm<z.infer<typeof createCodeFormSchema>>({
    resolver: zodResolver(createCodeFormSchema),
    defaultValues: {
      label: "",
    },
    shouldUnregister: true,
  });

  const editComponentForm = useForm<z.infer<typeof createCodeFormSchema>>({
    resolver: zodResolver(createCodeFormSchema),
    defaultValues: {
      label: component?.label || "",
    },
    shouldUnregister: true,
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
    <div className={cn(componentVariants({ variant, size }))}>
      <div className="flex items-start justify-between">
        <div className={`flex ${isEditing ? 'items-start' : 'items-center'}`}>
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
                <Button type="submit">Save</Button>
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
        {!isEditing && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" type="button" size="icon">
                <DotsVerticalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => {
                  architectureData?.removeNode(component)
                }}
              >
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {component.children.map((code, index) => (
        <Code code={code} key={`code-${index}`} variant={variant} />
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
              <Button type="submit">Save</Button>
            </form>
          </Form>
        </PopoverContent>
      </Popover>
    </div>
  )
}
