'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';

export function TextOverlay({
  onUpdate,
}: {
  onUpdate: (text: string, x: number, y: number) => void;
}) {
  const [textOverlay, setTextOverlay] = useState('');
  const [textOverlayXPosition, setTextOverlayXPosition] = useState(0);
  const [textOverlayYPosition, setTextOverlayYPosition] = useState(0);

  const xPositionDecimal = textOverlayXPosition / 100;
  const yPositionDecimal = textOverlayYPosition / 100;

  const transformations = [];
  if (textOverlay) {
    transformations.push({
      raw: `l-text,i-${textOverlay},fs-50,lx-bw_mul_${xPositionDecimal.toFixed(
        2
      )},ly-bw_mul_${yPositionDecimal.toFixed(2)},l-end`,
    });
  }

  return (
    <Card className="p-4 space-y-4">
      <div>
        <Label htmlFor="textOverlay">Text Overlay</Label>
        <Input
          id="textOverlay"
          onChange={(e) => {
            setTextOverlay(e.target.value);
            onUpdate(e.target.value, xPositionDecimal, yPositionDecimal);
          }}
          value={textOverlay}
        />
      </div>

      <div>
        <Label htmlFor="textXPosition">Text X Position</Label>
        <Slider
          id="textXPosition"
          value={[textOverlayXPosition]}
          onValueChange={([v]) => {
            setTextOverlayXPosition(v);
            onUpdate(textOverlay, v / 100, yPositionDecimal);
          }}
        />
      </div>

      <div>
        <Label htmlFor="textYPosition">Text Y Position</Label>
        <Slider
          id="textYPosition"
          value={[textOverlayYPosition]}
          onValueChange={([v]) => {
            setTextOverlayYPosition(v);
            onUpdate(textOverlay, xPositionDecimal, v / 100);
          }}
        />
      </div>
    </Card>
  );
}
