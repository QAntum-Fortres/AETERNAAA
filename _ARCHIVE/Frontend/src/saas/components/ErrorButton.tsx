import React from 'react';
import * as Sentry from '@sentry/react';

// Add this button component to your app to test Sentry's error tracking
export function ErrorButton() {
  return (
    <button
      onClick={() => {
        throw new Error('This is your first error!');
      }}
      className="px-6 py-2 border border-red-500/30 text-red-500 font-bold uppercase tracking-widest text-[10px] hover:bg-red-500/10 transition-all rounded-lg flex items-center justify-center gap-2"
    >
      Break the world
    </button>
  );
}
