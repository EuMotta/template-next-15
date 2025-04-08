'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface EmptyStateProps {
  image?: string;
  secondaryImage?: string;
  title?: string;
  subtitle?: string;
  label?: string;
  showReset?: boolean;
  reset?: () => void;
}

const EmptyState = ({
  image,
  secondaryImage,
  title = 'Aconteceu um problema!',
  subtitle = 'Não sei ainda o que é, mas vou descobrir!',
  label = 'Tente novamente',
  showReset = false,
  reset
}: EmptyStateProps) => {
  const [displayedImage, setDisplayedImage] = useState(image);
  const router = useRouter();

  useEffect(() => {
    if (!secondaryImage) return;

    const timer = setTimeout(() => {
      setDisplayedImage(secondaryImage);
    }, 5000);

    return () => clearTimeout(timer);
  }, [secondaryImage]);

  const handleReset = useCallback(() => {
    reset?.();
  }, [reset]);

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md border-none shadow-none">
        <CardHeader className="space-y-3 p-6 text-center">
          {displayedImage && (
            <Image
              src={displayedImage}
              alt={title}
              width={128}
              height={128}
              className="mx-auto h-32 w-32 object-contain transition-all duration-500"
              priority
            />
          )}
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground">{subtitle}</p>
        </CardHeader>

        <CardContent className="flex justify-center gap-4 pb-6">
          {showReset && (
            <Button variant="outline" onClick={handleReset}>
              {label}
            </Button>
          )}
          <Button variant="outline" onClick={router.back}>
            Voltar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmptyState;
