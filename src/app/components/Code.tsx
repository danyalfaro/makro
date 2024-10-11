"use client";

import { useNodeContext } from "../components/NodeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Code } from '../types/context';
import { useState } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { STYLE } from '../types/styles';

const editCodeFormSchema = z.object({
  label: z.string().min(2).max(50),
});

const codeVariants = cva('disabled:opacity-50', {
  variants: {
    variant: {
      [STYLE.MINIMALISM]:
        'flex flex-col gap-4 text-black-foreground bg-codeBackgroundColor bg-opacity-5 rounded-xl', //bg-black
      [STYLE.NEUMORPHISM]:
        'flex flex-col gap-4 bg-codeBackgroundColor rounded-xl text-black-foreground shadow-[-7px_-7px_12px_3px_rgba(255,255,255,0.7),7px_7px_12px_3px_rgba(0,0,0,0.10)] dark:shadow-[inset_-7px_-7px_12px_3px_rgba(0,0,0,0.7),inset_7px_7px_20px_3px_rgba(240,240,240,0.40)]',
      [STYLE.NEUBRUTALISM]:
        'flex flex-col gap-4 bg-codeBackgroundColor font-bold text-black-foreground shadow-[10px_10px_0px_0px_rgba(0,0,0,0.9)] border-solid border-black border-black dark:border-white dark:shadow-codeBackgroundColor dark:bg-black dark:text-white border-2',
      [STYLE.GLASSMORPHISM]:
        'flex flex-col gap-4 bg-[#eeeeee] text-black-foreground shadow-[0px_10px_20px_0px_rgba(0,0,0,0.12)] border-solid border-[#ffffff20] border-[1px] backdrop-blur rounded-xl bg-codeBackgroundColor bg-opacity-5', //bg-white
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

export default function Code({
  code,
  variant,
  size,
}: { code: Code } & VariantProps<typeof codeVariants>) {
  const [isEditing, setIsEditing] = useState<Boolean>(false);
  const architectureData = useNodeContext();

  const editCodeForm = useForm<z.infer<typeof editCodeFormSchema>>({
    resolver: zodResolver(editCodeFormSchema),
    defaultValues: {
      label: code.label,
    },
    shouldUnregister: true,
  });

  const onEdit = (values: z.infer<typeof editCodeFormSchema>) => {
    const { label } = values;
    const newCode = {
      ...code,
      label,
    };
    architectureData?.editNode(newCode);
    setIsEditing(false);
  };

  return (
    <div className={cn(codeVariants({ variant, size }))}>
      <div className="group flex items-start justify-between">
        <div className={`flex ${isEditing ? 'items-start' : 'items-center'}`}>
          {!isEditing ? (
            <h1 onDoubleClick={() => setIsEditing(true)}>{code.label}</h1>
          ) : (
            <Form {...editCodeForm}>
              <form
                onSubmit={editCodeForm.handleSubmit(onEdit)}
                className="space-y-8"
              >
                <FormField
                  control={editCodeForm.control}
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
            onClick={() => {
              setIsEditing((prev) => !prev);
            }}
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
                  architectureData?.removeNode(code);
                }}
              >
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
