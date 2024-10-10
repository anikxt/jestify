'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { TwitterPicker } from 'react-color';

export function TextOverlay({
  index,
  onUpdate,
}: {
  index: number;
  onUpdate: (
    index: number,
    text: string,
    x: number,
    y: number,
    bgColor?: string
  ) => void;
}) {
  const [textOverlay, setTextOverlay] = useState('Hello, World!');
  const [textOverlayXPosition, setTextOverlayXPosition] = useState(0);
  const [textOverlayYPosition, setTextOverlayYPosition] = useState(0);
  const [applyTextBackground, setApplyTextBackground] = useState(false);
  const [textBgColor, setTextBgColor] = useState('#FFFFFF');

  const xPositionDecimal = textOverlayXPosition / 100;
  const yPositionDecimal = textOverlayYPosition / 100;
  const bgColor = applyTextBackground
    ? textBgColor.replace('#', '')
    : undefined;

  useEffect(() => {
    onUpdate(index, textOverlay, xPositionDecimal, yPositionDecimal, bgColor);
  }, [
    index,
    textOverlay,
    xPositionDecimal,
    yPositionDecimal,
    bgColor,
    onUpdate,
  ]);

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
      <div className="flex justify-between gap-8">
        <div className="flex-grow">
          <Label htmlFor={`textOverlay${index}`}>Text Overlay {index}</Label>
          <Input
            id={`textOverlay${index}`}
            onChange={(e) => {
              setTextOverlay(e.target.value);
              onUpdate(
                index,
                e.target.value,
                xPositionDecimal,
                yPositionDecimal,
                bgColor
              );
            }}
            value={textOverlay}
          />
        </div>

        <div className="flex items-center space-x-2 flex-col space-y-4">
          <div className="flex gap-2 align-baseline">
            <Checkbox
              checked={applyTextBackground}
              onCheckedChange={(v) => {
                setApplyTextBackground(v as boolean);
                onUpdate(
                  index,
                  textOverlay,
                  xPositionDecimal,
                  yPositionDecimal,
                  applyTextBackground ? textBgColor.replace('#', '') : undefined
                );
              }}
              id="terms"
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Apply Text Background
            </label>
          </div>
          {applyTextBackground && (
            <TwitterPicker
              color={textBgColor}
              onChange={(value) => {
                setTextBgColor(value.hex);
                onUpdate(
                  index,
                  textOverlay,
                  xPositionDecimal,
                  yPositionDecimal,
                  applyTextBackground ? value.hex.replace('#', '') : undefined
                );
              }}
            />
          )}

          {textBgColor}
        </div>
      </div>

      <div>
        <Label htmlFor={`text${index}XPosition`}>Text {index} X Position</Label>
        <Slider
          id={`text${index}XPosition`}
          value={[textOverlayXPosition]}
          onValueChange={([v]) => {
            setTextOverlayXPosition(v);
            onUpdate(index, textOverlay, v / 100, yPositionDecimal, bgColor);
          }}
        />
      </div>

      <div>
        <Label htmlFor={`text${index}YPosition`}>Text {index} Y Position</Label>
        <Slider
          id={`text${index}YPosition`}
          value={[textOverlayYPosition]}
          onValueChange={([v]) => {
            setTextOverlayYPosition(v);
            onUpdate(index, textOverlay, xPositionDecimal, v / 100, bgColor);
          }}
        />
      </div>
    </Card>
  );
}
