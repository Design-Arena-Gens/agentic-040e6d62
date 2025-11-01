"use client";
import { useState } from 'react';

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <button className={copied ? 'secondary' : ''} type="button" onClick={handleCopy}>
      {copied ? 'Copied!' : 'Copy Prompt'}
    </button>
  );
}
