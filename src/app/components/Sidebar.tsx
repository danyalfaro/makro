'use client';

import { isValidColor } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { STYLE } from '../types/styles';
import { Input } from '@/components/ui/input';
import { DEFAULT_STYLE, useNodeContext } from './NodeContext';
import { StyleSelector } from './StyleSelector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const DEFAULT_FIRST_COLOR = '#EEEEEE';
export const DEFAULT_SECOND_COLOR = '#EEEEEE';

export default function Sidebar() {
  const architectureData = useNodeContext();

  const [firstColor, setFirstColor] = useState<string>(DEFAULT_FIRST_COLOR);
  const [secondColor, setSecondColor] = useState<string>(DEFAULT_SECOND_COLOR);

  useEffect(() => {
    console.log(firstColor, secondColor);
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

  const handleStyleChange = (style: STYLE) => {
    architectureData?.setStyle(STYLE[style]);
  };
  return (
    <div className="flex h-screen w-80 flex-col gap-4 bg-[#eeeeee] p-12 shadow">
      <StyleSelector
        onChange={handleStyleChange}
        defaultValue={architectureData?.style || DEFAULT_STYLE}
      />
      <Tabs defaultValue="solid" className="w-full">
        <TabsList>
          <TabsTrigger value="solid" onClick={() => setSecondColor(firstColor)}>
            Solid
          </TabsTrigger>
          <TabsTrigger value="gradient">Gradient</TabsTrigger>
        </TabsList>
        <TabsContent value="solid">
          <Input
            type="color"
            onChange={(e) => {
              setFirstColor(e.target.value);
              setSecondColor(e.target.value);
            }}
            value={firstColor}
          />
        </TabsContent>
        <TabsContent value="gradient">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
