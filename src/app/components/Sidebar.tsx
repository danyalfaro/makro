'use client';

import { cn, isValidColor } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { STYLE } from '../types/styles';
import { Input } from '@/components/ui/input';
import { useNodeContext } from './NodeContext';
import { StyleSelector } from './StyleSelector';
import {
  DEFAULT_CONTEXT_COLOR_START,
  DEFAULT_CONTEXT_COLOR_END,
  DEFAULT_STYLE,
  DEFAULT_CODE_COLOR,
  DEFAULT_CONTAINER_COLOR,
  DEFAULT_COMPONENT_COLOR,
} from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { PlusCircledIcon } from '@radix-ui/react-icons';
import { MinusCircleIcon } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export default function Sidebar({ className }: { className: string }) {
  const architectureData = useNodeContext();

  const [style, setStyle] = useState<STYLE>(DEFAULT_STYLE);
  const [isGradient, setIsGradient] = useState<boolean>(false);
  const [contextColorStart, setContextColorStart] = useState<string>(
    DEFAULT_CONTEXT_COLOR_START
  );
  const [contextColorEnd, setContextColorEnd] = useState<string>(
    DEFAULT_CONTEXT_COLOR_END
  );
  const [containerColor, setContainerColor] = useState<string>(
    DEFAULT_CONTAINER_COLOR
  );
  const [componentColor, setComponentColor] = useState<string>(
    DEFAULT_COMPONENT_COLOR
  );
  const [codeColor, setCodeColor] = useState<string>(DEFAULT_CODE_COLOR);

  useEffect(() => {
    if (!isValidColor(contextColorStart) || !isValidColor(contextColorEnd))
      return;

    document.documentElement.style.setProperty(
      '--contextBackgroundColorFrom',
      contextColorStart
    );

    document.documentElement.style.setProperty(
      '--contextBackgroundColorTo',
      contextColorEnd
    );

    document.documentElement.style.setProperty(
      '--containerBackgroundColor',
      containerColor
    );
    document.documentElement.style.setProperty(
      '--componentBackgroundColor',
      componentColor
    );
    document.documentElement.style.setProperty(
      '--codeBackgroundColor',
      codeColor
    );
  }, [
    contextColorStart,
    contextColorEnd,
    containerColor,
    componentColor,
    codeColor,
  ]);

  useEffect(() => {
    architectureData?.setStyle(STYLE[style]);
  }, [style]);

  return (
    <div
      className={cn(
        'flex h-screen w-1/6 flex-col gap-4 bg-[#eeeeee] p-12 shadow dark:bg-black dark:text-white',
        className
      )}
    >
      <label className="font-bold">Style</label>
      <StyleSelector
        onChange={setStyle}
        defaultValue={architectureData?.style || DEFAULT_STYLE}
      />
      <label className="font-bold">Color</label>
      <div className="flex items-center gap-2">
        <label>Context</label>
        {isGradient ? (
          <div className="flex items-center">
            <Input
              className="h-6 w-6 cursor-pointer rounded-lg border-none p-0"
              type="color"
              onChange={(e) => {
                setContextColorStart(e.target.value);
              }}
              value={contextColorStart}
            />
            <Input
              className="h-6 w-6 cursor-pointer rounded-lg border-none p-0"
              type="color"
              onChange={(e) => {
                setContextColorEnd(e.target.value);
              }}
              value={contextColorEnd}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsGradient(false);
                setContextColorEnd(contextColorStart);
              }}
            >
              <MinusCircleIcon height={24} width={24} />
            </Button>
          </div>
        ) : (
          <div className="flex items-center">
            <Input
              className="h-6 w-6 cursor-pointer rounded-lg border-none p-0"
              type="color"
              onChange={(e) => {
                setContextColorStart(e.target.value);
                setContextColorEnd(e.target.value);
              }}
              value={contextColorStart}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setIsGradient(true)}
            >
              <PlusCircledIcon height={24} width={24} />
            </Button>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <label>Container</label>
        <Input
          className="h-6 w-6 p-0"
          type="color"
          onChange={(e) => {
            setContainerColor(e.target.value);
          }}
          value={containerColor}
        />
      </div>
      <div className="flex gap-2">
        <label>Component</label>
        <Input
          className="h-6 w-6 p-0"
          type="color"
          onChange={(e) => {
            setComponentColor(e.target.value);
          }}
          value={componentColor}
        />
      </div>
      <div className="flex gap-2">
        <label>Code</label>
        <Input
          className="h-6 w-6 p-0"
          type="color"
          onChange={(e) => {
            setCodeColor(e.target.value);
          }}
          value={codeColor}
        />
      </div>
      <ThemeToggle />
    </div>
  );
}
