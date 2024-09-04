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
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Code } from "../types/context";
import { useEffect, useState } from "react";

const editCodeFormSchema = z.object({
  label: z.string().min(2).max(50),
});

export default function Code({ code }: { code: Code }) {
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
    <div className="bg-gray-400 flex flex-col gap-4 p-8">
      <div className="flex items-start justify-between">
        <div className={`flex ${isEditing ? "items-start" : "items-center"}`}>
          {!isEditing ? (
            <h1>{code.label}</h1>
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
            onClick={() => {
              setIsEditing((prev) => !prev);
            }}
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
