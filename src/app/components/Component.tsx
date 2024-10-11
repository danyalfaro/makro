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
  PlusCircledIcon,
} from '@radix-ui/react-icons';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Code from './Code';
import { useRef, useState } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { STYLE } from '../types/styles';

const createCodeFormSchema = z.object({
  label: z.string().min(2).max(50),
});

const editComponentFormSchema = z.object({
  label: z.string().min(2).max(50),
});

const componentVariants = cva('disabled:opacity-50', {
  variants: {
    variant: {
      [STYLE.MINIMALISM]:
        'flex flex-col gap-4 text-black-foreground bg-componentBackgroundColor bg-opacity-5 rounded-xl',
      [STYLE.NEUMORPHISM]:
        'flex flex-col gap-4 bg-componentBackgroundColor rounded-xl text-black-foreground shadow-[-7px_-7px_12px_3px_rgba(255,255,255,0.7),7px_7px_12px_3px_rgba(0,0,0,0.10)] dark:shadow-[inset_-7px_-7px_12px_3px_rgba(0,0,0,0.7),inset_7px_7px_20px_3px_rgba(240,240,240,0.40)]',
      [STYLE.NEUBRUTALISM]:
        'flex flex-col gap-8 bg-componentBackgroundColor font-bold text-black-foreground shadow-[14px_14px_0px_0px_rgba(0,0,0,0.9)] border-solid border-black border-black dark:border-white dark:shadow-componentBackgroundColor dark:bg-black dark:text-white border-2',
      [STYLE.GLASSMORPHISM]:
        'flex flex-col gap-4 bg-componentBackgroundColor text-black-foreground shadow-[0px_10px_20px_0px_rgba(0,0,0,0.12)] border-solid border-[#ffffff20] border-[1px] backdrop-blur rounded-xl bg-opacity-5',
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
});

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
      label: '',
    },
    shouldUnregister: true,
  });

  const editComponentForm = useForm<z.infer<typeof createCodeFormSchema>>({
    resolver: zodResolver(createCodeFormSchema),
    defaultValues: {
      label: component?.label || '',
    },
    shouldUnregister: true,
  });

  const popoverCloseRef = useRef<HTMLButtonElement>(null);
  const closePopover = () => popoverCloseRef.current?.click();

  const onSubmit = (values: z.infer<typeof createCodeFormSchema>) => {
    const { label } = values;
    const newCode = {
      id: uuidv4(),
      label,
      type: NodeType.CODE,
      children: [],
    };
    architectureData?.addNode(component.id, newCode);
    closePopover();
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
        <div
          className={`group flex ${isEditing ? 'items-start' : 'items-center'}`}
        >
          {!isEditing ? (
            <h1 onDoubleClick={() => setIsEditing(true)}>{component.label}</h1>
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
                        <Input {...field} autoFocus />
                      </FormControl>
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
            {!isEditing ? (
              <Pencil1Icon className="invisible group-hover:visible" />
            ) : (
              <Cross2Icon />
            )}
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
                  architectureData?.removeNode(component);
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
        <div className="flex items-center justify-center">
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="icon">
              <PlusCircledIcon height={24} width={24} />
            </Button>
          </PopoverTrigger>
        </div>
        <PopoverContent>
          <Form {...createCodeForm}>
            <form
              onSubmit={createCodeForm.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <PopoverClose ref={popoverCloseRef}>
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
  );
}
