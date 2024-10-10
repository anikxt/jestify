import { unstable_noStore } from 'next/cache';
import { ResultsList } from './results-list';
import { UploadMemeButton } from './upload-meme-buttton';
import { imagekit } from '../lib/image-kit';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  // don't cache stuff
  unstable_noStore();

  const files = await imagekit.listFiles({
    tags: searchParams.q,
  });

  return (
    <div className="container mx-auto space-y-8 py-8 px-4">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Search Results</h1>
        <UploadMemeButton />
      </div>

      <ResultsList files={files} />
    </div>
  );
}
