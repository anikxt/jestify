'use client';

import { IKImage } from 'imagekitio-next';
import { urlEndpoint } from '../providers';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { type Favorite } from '../db/schema';
import { FavoriteButton } from '../customize/[fileId]/favorite-button';

export function FavoritesList({ favorites }: { favorites: Favorite[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {favorites.map((favorite) => {
        return (
          <Card key={favorite.memeId}>
            {/* <CardHeader> */}
            {/* <CardTitle>
                {file.customMetadata?.displayName ?? file.name}
              </CardTitle> */}
            {/* </CardHeader> */}
            <CardContent>
              <IKImage
                key={favorite.memeId}
                path={favorite.filePath}
                urlEndpoint={urlEndpoint}
                alt={'a meme'}
                width={300}
                height={300}
              />
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button asChild>
                <Link href={`customize/${favorite.memeId}`}>Customize</Link>
              </Button>

              <FavoriteButton
                fileId={favorite.memeId}
                filePath={favorite.filePath}
                isFavorited={true}
                pathToRevalidate={'/favorites'}
              />
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
