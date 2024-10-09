'use client';

import Image from 'next/image';
import { ImageKitProvider, IKImage, IKUpload } from 'imagekitio-next';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;
const authenticator = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/auth');

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Authentication request failed: ${error.message}`);
    } else {
      throw new Error(
        `Authentication request failed: An unknown error occurred`
      );
    }
  }
};

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;

export default function Home() {
  const [filePath, setFilePath] = useState('');

  return (
    <div className="">
      <Button variant={'destructive'}>Click Me</Button>
      <ImageKitProvider
        publicKey={publicKey}
        urlEndpoint={urlEndpoint}
        authenticator={authenticator}
      >
        {/* ...child components */}
        {filePath && (
          <IKImage path={filePath} width={300} height={500} alt="Alt text" />
        )}

        <div>
          <h2>File upload</h2>
          <IKUpload
            fileName="test-upload.png"
            onError={(error) => {
              console.log('error', error);
            }}
            onSuccess={(response) => {
              console.log('success', response);
              setFilePath(response.filePath);
            }}
          />
        </div>
      </ImageKitProvider>
    </div>
  );
}
