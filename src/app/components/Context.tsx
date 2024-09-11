"use client";

import { DEFAULT_STYLE, useNodeContext } from '../components/NodeContext';
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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Context, NodeType } from "../types/context";
import { useRef, useState } from 'react';
import Container from './Container';
import { v4 as uuidv4 } from 'uuid';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { STYLE } from '../types/styles';

const editContextFormSchema = z.object({
  label: z.string().min(2).max(50),
});
const createContainerFormSchema = z.object({
  label: z.string().min(2).max(50),
});

const contextVariants = cva('disabled:opacity-50', {
  variants: {
    variant: {
      [STYLE.MINIMALISM]:
        'flex flex-col items-start gap-4 bg-gradient-to-r from-contextBackgroundColorFrom to-contextBackgroundColorTo text-black-foreground rounded-xl',
      [STYLE.NEUMORPHISM]:
        'flex flex-col items-start gap-4 bg-gradient-to-r from-contextBackgroundColorFrom to-contextBackgroundColorTo text-black-foreground shadow rounded-3xl',
      [STYLE.NEUBRUTALISM]:
        'flex flex-col items-start gap-12 bg-gradient-to-r from-contextBackgroundColorFrom to-contextBackgroundColorTo font-bold text-black-foreground shadow-[14px_14px_0px_0px_rgba(0,0,0,0.9)] border-solid border-black border-2',
      [STYLE.GLASSMORPHISM]:
        'flex flex-col items-start gap-4 text-black-foreground bg-gradient-to-r from-contextBackgroundColorFrom to-contextBackgroundColorTo border-solid border-[#ffffff20] border-[1px] rounded-xl',
    },
    size: {
      default: 'p-8',
      sm: 'h-8 rounded-md px-3 text-xs',
      lg: 'h-10 rounded-md px-8',
      icon: 'h-9 w-9',
    },
  },
  defaultVariants: {
    variant: DEFAULT_STYLE,
    size: 'default',
  },
});

export default function Context({
  context,
  variant,
  size,
  className,
}: { context: Context; className?: string } & VariantProps<
  typeof contextVariants
>) {
  const [isEditing, setIsEditing] = useState<Boolean>(false);

  const architectureData = useNodeContext();

  const editContextForm = useForm<z.infer<typeof editContextFormSchema>>({
    resolver: zodResolver(editContextFormSchema),
    defaultValues: {
      label: context.label,
    },
    shouldUnregister: true,
  });

  const form = useForm<z.infer<typeof createContainerFormSchema>>({
    resolver: zodResolver(createContainerFormSchema),
    defaultValues: {
      label: '',
    },
    shouldUnregister: true,
  });

  const popoverCloseRef = useRef<HTMLButtonElement>(null);
  const closePopover = () => popoverCloseRef.current?.click();

  const onSubmit = (values: z.infer<typeof createContainerFormSchema>) => {
    const { label } = values;
    const newContainer = {
      id: uuidv4(),
      label,
      type: NodeType.CONTAINER,
      children: [],
    };
    architectureData?.addNode(architectureData.data[0].id, newContainer);
    closePopover();
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
    <div className={cn(contextVariants({ variant, size }), className)}>
      <div className={`flex ${isEditing ? 'items-start' : 'items-center'}`}>
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
                      The label used for the container.
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
                  architectureData?.removeNode(context);
                }}
              >
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div className="flex gap-10">
        {context.children.map((container, index) => (
          <Container
            container={container}
            key={`container-${index}`}
            variant={variant}
          />
        ))}
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
                <PopoverClose ref={popoverCloseRef}>
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
                <Button type="submit">Save</Button>
              </form>
            </Form>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
