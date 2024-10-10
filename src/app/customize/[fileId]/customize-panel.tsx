'use client';

import { urlEndpoint } from '@/app/providers';
import { FileObject } from 'imagekit/dist/libs/interfaces';
import { IKImage } from 'imagekitio-next';
import { useCallback, useState } from 'react';
import { TextOverlay } from './text-overlay';
import { Button } from '@/components/ui/button';
import { debounce } from 'lodash';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';

export function CustomizePanel({
  file,
}: {
  file: Pick<FileObject, 'filePath' | 'name'>;
}) {
  const [textTransformation, setTextTransformations] = useState<
    Record<string, { raw: string }>
  >({});
  const [numberOfOverlays, setNumberOfOverlays] = useState(1);
  const [blur, setBlur] = useState(false);
  const [sharpen, setSharpen] = useState(false);
  const [grayscale, setGrayscale] = useState(false);

  const textTransformationsArray = Object.values(textTransformation);

  const onUpdate = useCallback(
    debounce(
      (index: number, text: string, x: number, y: number, bgColor?: string) => {
        setTextTransformations((current) => ({
          ...current,
          [`text${index}`]: {
            raw: `l-text,i-${text ?? ' '},${
              bgColor ? `bg-${bgColor},pa-10,` : ''
            }fs-50,lx-bw_mul_${x.toFixed(2)},ly-bw_mul_${y.toFixed(2)},l-end`,
          },
        }));
      },
      250
    ),
    []
  );

  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-4">
        <div>
          <Card className="p-4 space-y-4">
            <h2 className="text-xl">Effects:</h2>

            <div className="flex gap-2">
              <div className="flex gap-2 align-baseline">
                <Checkbox
                  checked={blur}
                  onCheckedChange={(v) => {
                    setBlur(v as boolean);
                  }}
                  id="blur"
                />
                <label
                  htmlFor="blur"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Blur
                </label>
              </div>

              <div className="flex gap-2 align-baseline">
                <Checkbox
                  checked={sharpen}
                  onCheckedChange={(v) => {
                    setSharpen(v as boolean);
                  }}
                  id="sharpen"
                />
                <label
                  htmlFor="sharpen"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Sharpen
                </label>
              </div>

              <div className="flex gap-2 align-baseline">
                <Checkbox
                  checked={grayscale}
                  onCheckedChange={(v) => {
                    setGrayscale(v as boolean);
                  }}
                  id="grayscale"
                />
                <label
                  htmlFor="grayscale"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Grayscale
                </label>
              </div>
            </div>
          </Card>
        </div>

        {new Array(numberOfOverlays).fill('').map((_, index) => (
          <TextOverlay key={index} index={index + 1} onUpdate={onUpdate} />
        ))}

        <div className="flex gap-4">
          <Button onClick={() => setNumberOfOverlays(numberOfOverlays + 1)}>
            Add Another Overlay
          </Button>

          <Button
            variant={'destructive'}
            onClick={() => {
              setNumberOfOverlays(numberOfOverlays - 1);
              const lastIndex = numberOfOverlays - 1;
              setTextTransformations((cur) => {
                const newCur = { ...cur };
                delete newCur[`text${lastIndex}`];
                return newCur;
              });
            }}
          >
            Remove Last
          </Button>
        </div>
      </div>

      <IKImage
        path={file.filePath}
        urlEndpoint={urlEndpoint}
        alt={file.name}
        transformation={
          [
            blur ? { raw: 'bl-3' } : undefined,
            sharpen ? { raw: 'e-sharpen-10' } : undefined,
            grayscale ? { raw: 'e-grayscale' } : undefined,
            ...textTransformationsArray,
          ].filter(Boolean) as any
        }
      />
    </div>
  );
}
