'use client';

import NextError from 'next/error';
import { useEffect } from 'react';

import * as Sentry from '@sentry/nextjs';

export default function GlobalError(props: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(props.error);
  }, [props.error]);

  return (
    <div>
      <NextError statusCode={0} />
    </div>
  );
}
