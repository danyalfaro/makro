"use client";

import { useNodeContext } from "./components/NodeContext";

import Context from "./components/Context";
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { isValidColor } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { STYLE } from './types/styles';

export default function Home() {
  const architectureData = useNodeContext();
  const [firstColor, setFirstColor] = useState<string>(
    document.documentElement.style.getPropertyValue(
      '--contextBackgroundColorFrom'
    )
  );
  const [secondColor, setSecondColor] = useState<string>(
    document.documentElement.style.getPropertyValue(
      '--contextBackgroundColorTo'
    )
  );
  const [style, setStyle] = useState<STYLE>(STYLE.MINIMALISM);
  useEffect(() => {
    if (!isValidColor(firstColor) || !isValidColor(secondColor)) return;
    document.documentElement.style.setProperty(
      '--contextBackgroundColorFrom',
      firstColor
    );

    document.documentElement.style.setProperty(
      '--contextBackgroundColorTo',
      secondColor
    );
  }, [firstColor, secondColor]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {architectureData &&
        !architectureData.isLoading &&
        architectureData.data && (
          <div>
            <Input
              type="color"
              onChange={(e) => setFirstColor(e.target.value)}
              value={firstColor}
            />
            <Input
              type="color"
              onChange={(e) => setSecondColor(e.target.value)}
              value={secondColor}
            />
            <DropdownMenu>
              <DropdownMenuTrigger>Open</DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStyle(STYLE.MINIMALISM)}>
                  Minimalism
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStyle(STYLE.NEUMORPHISM)}>
                  Neumorphism
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStyle(STYLE.NEUBRUTALISM)}>
                  Neubrutalism
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStyle(STYLE.GLASSMORPHISM)}>
                  Glassmorphism
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {architectureData.data.map((context, index) => (
              <Context
                context={context}
                key={`context-${index}`}
                variant={style}
              />
            ))}
          </div>
        )}
      {architectureData?.isLoading && <div>Loading...</div>}
    </main>
  );
}


