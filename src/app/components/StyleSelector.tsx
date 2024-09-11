'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { STYLE } from '../types/styles';

const styles = [
  {
    value: STYLE.MINIMALISM,
    label: 'Minimalism',
  },
  {
    value: STYLE.GLASSMORPHISM,
    label: 'Glassmorphism',
  },
  {
    value: STYLE.NEUBRUTALISM,
    label: 'Neubrutalism',
  },
  {
    value: STYLE.NEUMORPHISM,
    label: 'Neumorphism',
  },
];

export function StyleSelector({
  onChange,
  defaultValue,
}: {
  onChange: any;
  defaultValue: STYLE;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string>(defaultValue);

  console.log(defaultValue);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? styles.find((style) => style.value === value)?.label
            : 'Select theme...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search styles..." />
          <CommandList>
            <CommandEmpty>No style found.</CommandEmpty>
            <CommandGroup>
              {styles.map((style) => (
                <CommandItem
                  key={style.value}
                  value={style.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue);
                    setOpen(false);
                    onChange(style.value);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === style.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {style.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
