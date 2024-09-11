"use client";

import { useNodeContext } from "../components/NodeContext";
import { v4 as uuidv4 } from "uuid";
import { Container, NodeType } from "../types/context";
import { cva, type VariantProps } from "class-variance-authority";
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
import { useRef, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { STYLE } from '../types/styles';

const createComponentFormSchema = z.object({
  label: z.string().min(2).max(50),
});

const editContainerFormSchema = z.object({
  label: z.string().min(2).max(50),
});

const contaierVariants = cva('disabled:opacity-50', {
  variants: {
    variant: {
      [STYLE.MINIMALISM]:
        'flex flex-col gap-4 bg-transparent text-black-foreground border-dashed border-black border-2 rounded-xl',
      [STYLE.NEUMORPHISM]:
        'flex flex-col gap-4 bg-containerBackgroundColor text-black-foreground shadow-[inset_-7px_-7px_12px_3px_rgba(255,255,255,0.7),inset_7px_7px_12px_3px_rgba(0,0,0,0.10)] rounded-3xl',
      [STYLE.NEUBRUTALISM]:
        'flex flex-col gap-8 bg-containerBackgroundColor font-bold text-black-foreground shadow-[18px_18px_0px_0px_rgba(0,0,0,0.9)] border-solid border-black border-2',
      [STYLE.GLASSMORPHISM]:
        'flex flex-col gap-4 text-black-foreground shadow-[0px_10px_20px_0px_rgba(0,0,0,0.12)] border-solid border-[#ffffff20] border-[1px] backdrop-blur rounded-xl bg-white bg-opacity-5',
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

export default function Container({
  container,
  size,
  variant,
}: {
  container: Container;
} & VariantProps<typeof contaierVariants>) {
  const [isEditing, setIsEditing] = useState<Boolean>(false);

  const architectureData = useNodeContext();

  const createComponentForm = useForm<
    z.infer<typeof createComponentFormSchema>
  >({
    resolver: zodResolver(createComponentFormSchema),
    defaultValues: {
      label: '',
    },
    shouldUnregister: true,
  });

  const editContainerForm = useForm<z.infer<typeof editContainerFormSchema>>({
    resolver: zodResolver(editContainerFormSchema),
    defaultValues: {
      label: container?.label || '',
    },
    shouldUnregister: true,
  });

  const popoverCloseRef = useRef<HTMLButtonElement>(null);
  const closePopover = () => popoverCloseRef.current?.click();

  const onSubmit = (values: z.infer<typeof createComponentFormSchema>) => {
    const { label } = values;
    const newComponent = {
      id: uuidv4(),
      label,
      type: NodeType.COMPONENT,
      children: [],
    };
    architectureData?.addNode(container.id, newComponent);
    closePopover();
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
    <div className={cn(contaierVariants({ variant, size }))}>
      <div className="flex items-start justify-between">
        <div className={`flex ${isEditing ? 'items-start' : 'items-center'}`}>
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
                  architectureData?.removeNode(container);
                }}
              >
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      {container.children.map((component, index) => (
        <Component
          component={component}
          key={`component-${index}`}
          variant={variant}
        />
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
              <PopoverClose ref={popoverCloseRef}>
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
              <Button type="submit">Save</Button>
            </form>
          </Form>
        </PopoverContent>
      </Popover>
    </div>
  );
}
