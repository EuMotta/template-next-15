'use client';

import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  return (
    <div className="bg-background text-foreground grid min-h-screen grid-rows-[auto_1fr_auto] gap-16 px-6 py-12 sm:px-20">
      <main className="mx-auto flex max-w-2xl flex-col items-center gap-10 text-center sm:items-start sm:text-left">
        <Image
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={38}
          priority
          className="dark:invert"
        />

        <Card className="w-full">
          <CardHeader>
            <h1 className="text-2xl font-bold tracking-tight">
              Next.js 15 Starter Template
            </h1>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-4 text-sm">
            <p>
              Este é um template minimalista com suporte ao App Router,
              TailwindCSS, TypeScript e ShadCN UI.
            </p>
            <p>
              Desenvolvido por{' '}
              <a
                href="https://www.linkedin.com/in/jos%C3%A9-antonio-bueno-motta-61006a26b/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary font-medium underline underline-offset-4"
              >
                José Antonio Motta
              </a>
              .
            </p>
            <Separator />
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild variant="default">
                <a
                  href="https://github.com/eumotta"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </Button>
              <Button asChild variant="outline">
                <a
                  href="https://www.linkedin.com/in/jos%C3%A9-antonio-bueno-motta-61006a26b/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="text-muted-foreground text-center text-xs">
        © {new Date().getFullYear()} José Antonio Motta. All rights reserved.
      </footer>
    </div>
  );
}
