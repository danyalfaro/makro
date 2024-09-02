"use client";

import { useNodeContext } from "./components/NodeContext";
import { v4 as uuidv4 } from "uuid";
import { NodeType } from "./types/context";
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
import Container from "./components/Container";

export default function Home() {
  const architectureData = useNodeContext();

  const createContainerFormSchema = z.object({
    label: z.string().min(2).max(50),
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
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {architectureData && architectureData.data && (
        <div className="flex gap-2">
          {architectureData.data.map((context) =>
            context.children.map((container, index) => (
              <Container container={container} key={`container-${index}`} />
            ))
          )}
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
                  <PopoverClose>
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
                  <Button type="submit">Submit</Button>
                </form>
              </Form>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </main>
  );
}


