'use client';

import { urlEndpoint } from '@/app/providers';
import { FileObject } from 'imagekit/dist/libs/interfaces';
import { IKImage } from 'imagekitio-next';
import { useCallback, useState, useMemo } from 'react';
import { TextOverlay } from './text-overlay';
import { Button } from '@/components/ui/button';
import { debounce } from 'lodash';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Download } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { FavoriteButton } from './favorite-button';

export function CustomizePanel({
  file,
  isFavorited,
  isAuthenticated,
}: {
  file: Pick<FileObject, 'filePath' | 'name' | 'fileId'>;
  isFavorited: boolean;
  isAuthenticated: boolean;
}) {
  const [textTransformation, setTextTransformations] = useState<
    Record<string, { raw: string }>
  >({});
  const [numberOfOverlays, setNumberOfOverlays] = useState(1);
  const [blur, setBlur] = useState(false);
  const [sharpen, setSharpen] = useState(false);
  const [grayscale, setGrayscale] = useState(false);

  const textTransformationsArray: Array<{ raw: string }> =
    Object.values(textTransformation);

  // Memoize the debounced function outside of useCallback
  const debouncedUpdate = useMemo(
    () =>
      debounce(
        (
          index: number,
          text: string,
          x: number,
          y: number,
          bgColor?: string
        ) => {
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

  // Now, use the debounced function in useCallback without creating new function references
  const onUpdate = useCallback(
    (index: number, text: string, x: number, y: number, bgColor?: string) => {
      debouncedUpdate(index, text, x, y, bgColor);
    },
    [debouncedUpdate] // Depend on the memoized debounced function
  );

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Customize</h1>

        <div className="flex gap-4 justify-end">
          {isAuthenticated && (
            <FavoriteButton
              fileId={file.fileId}
              filePath={file.filePath}
              isFavorited={isFavorited}
              pathToRevalidate={`/customize/${file.fileId}`}
            />
          )}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={async () => {
                    const image = document.querySelector('#meme img');
                    const src = image?.getAttribute('src');
                    if (!src) return;
                    const imageResponse = await fetch(src);
                    const imageBlob = await imageResponse.blob();
                    const imageUrl = URL.createObjectURL(imageBlob);
                    const a = document.createElement('a');
                    a.href = imageUrl;
                    a.download = file.name;
                    a.click();
                  }}
                >
                  <Download />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download Image</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <Card className="p-4 space-y-4">
              <h2 className="text-xl">Effects</h2>

              <div className="flex gap-4">
                <div className="flex gap-2">
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

                <div className="flex gap-2">
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

                <div className="flex gap-2">
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

            {numberOfOverlays > 1 && (
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
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div id="meme">
            <IKImage
              path={file.filePath}
              urlEndpoint={urlEndpoint}
              alt={file.name}
              transformation={[
                blur ? { raw: 'bl-3' } : undefined,
                sharpen ? { raw: 'e-sharpen-10' } : undefined,
                grayscale ? { raw: 'e-grayscale' } : undefined,
                ...textTransformationsArray,
              ].filter((item): item is { raw: string } => !!item)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
