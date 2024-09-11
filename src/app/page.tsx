"use client";

import { useNodeContext } from "./components/NodeContext";

import Context from './components/Context';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Cross2Icon } from '@radix-ui/react-icons';
import { PopoverClose } from '@radix-ui/react-popover';
import { useForm } from 'react-hook-form';

import z from 'zod';
import { useRef } from 'react';
import { NodeType } from './types/context';
import { v4 as uuidv4 } from 'uuid';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';

const createContextFormSchema = z.object({
  label: z.string().min(2).max(50),
});

export default function Home() {
  const architectureData = useNodeContext();
  const popoverCloseRef = useRef<HTMLButtonElement>(null);
  const closePopover = () => popoverCloseRef.current?.click();

  const form = useForm<z.infer<typeof createContextFormSchema>>({
    resolver: zodResolver(createContextFormSchema),
    defaultValues: {
      label: '',
    },
    shouldUnregister: true,
  });

  const onSubmit = (values: z.infer<typeof createContextFormSchema>) => {
    const { label } = values;
    const newContext = {
      id: uuidv4(),
      label,
      type: NodeType.CONTEXT,
      children: [],
    };
    architectureData?.addNode('root', newContext);
    closePopover();
  };

  return (
    <main className="w-5/6">
      <div className="w-full overflow-auto p-4">
        {architectureData &&
          !architectureData.isLoading &&
          architectureData.data && (
            <>
              {architectureData.data.map((context, index) => (
                <Context
                  context={context}
                  key={`context-${index}`}
                  variant={architectureData.style}
                  className="w-fit"
                />
              ))}
            </>
          )}
        {!architectureData?.data.length && (
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button type="button">Add Context</Button>
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
                            The label used for the context.
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
        )}
        {architectureData?.isLoading && <div>Loading...</div>}
      </div>
    </main>
  );
}


