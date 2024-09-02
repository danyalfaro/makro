"use client";

import { useNodeContext } from "../components/NodeContext";
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
import { Code } from "../types/context";

const editCodeFormSchema = z.object({
  label: z.string().min(2).max(50),
});

export default function Code({ code }: { code: Code }) {
  const architectureData = useNodeContext();

  const editCodeForm = useForm<z.infer<typeof editCodeFormSchema>>({
    resolver: zodResolver(editCodeFormSchema),
    defaultValues: {
      label: code?.label || "",
    },
  });

  const onEdit = (values: z.infer<typeof editCodeFormSchema>) => {
    const { label } = values;
    const newCode = {
      ...code,
      label,
    };
    architectureData?.editNode(newCode);
  };

  return (
    <div className="bg-gray-400 flex flex-col gap-4 p-8">
      <Button
        type="button"
        onClick={() => {
          architectureData?.removeNode(code);
        }}
      >
        Remove Code
      </Button>
      <h1>Code</h1>
      <h1>{code.label}</h1>
      <Popover>
        <PopoverTrigger asChild>
          <Button type="button">Edit Code</Button>
        </PopoverTrigger>
        <PopoverContent>
          <Form {...editCodeForm}>
            <form
              onSubmit={editCodeForm.handleSubmit(onEdit)}
              className="space-y-8"
            >
              <PopoverClose>
                <Cross2Icon />
              </PopoverClose>

              <FormField
                control={editCodeForm.control}
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
