import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
// import { Heart } from 'lucide-react';
import { HeartFilledIcon, HeartIcon } from '@radix-ui/react-icons';
import { toggleFavouriteMemeAction } from './actions';

export function FavoriteButton({
  isFavorited,
  fileId,
  filePath,
  pathToRevalidate,
}: {
  isFavorited: boolean;
  fileId: string;
  filePath: string;
  pathToRevalidate: string;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <form
            action={toggleFavouriteMemeAction.bind(
              null,
              fileId,
              filePath,
              pathToRevalidate
            )}
          >
            <Button type="submit" variant="outline">
              {isFavorited ? <HeartFilledIcon /> : <HeartIcon />}
            </Button>
          </form>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isFavorited ? 'Unfavorite Meme' : 'Favorite Meme'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
