import { imagekit } from '@/app/lib/image-kit';
import { unstable_noStore } from 'next/cache';
import { CustomizePanel } from './customize-panel';
import { getFavouriteMeme } from './loaders';

export default async function CustomizePage({
  params,
}: {
  params: { fileId: string };
}) {
  // don't cache stuff
  unstable_noStore();

  const file = await imagekit.getFileDetails(params.fileId);
  const isFavorited = await getFavouriteMeme(params.fileId);

  return (
    <div className="container mx-auto space-y-8 py-8 px-4">
      <CustomizePanel
        file={{ filePath: file.filePath, name: file.name, fileId: file.fileId }}
        isFavorited={isFavorited}
      />
    </div>
  );
}
