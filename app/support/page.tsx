'use client';

import { useEffect } from 'react';

export default function Support() {
  useEffect(() => {
    // Load the Tally embed script
    const script = document.createElement('script');
    script.src = 'https://tally.so/widgets/embed.js';
    script.async = true;
    document.head.appendChild(script);
  }, []);

  return (
    <main className="min-h-screen w-full overflow-hidden bg-background text-foreground">
      <style>{`
        html { margin: 0; height: 100%; overflow: hidden; }
        body { margin: 0; height: 100%; overflow: hidden; }
        iframe { position: absolute; top: 0; right: 0; bottom: 0; left: 0; border: 0; }
      `}</style>
      <iframe
        data-tally-src={process.env.NEXT_PUBLIC_TALLY_FORM_URL}
        width="100%"
        height="100%"
        frameBorder="0"
        marginHeight={0}
        marginWidth={0}
        title="Contact support"
      />
    </main>
  );
}
