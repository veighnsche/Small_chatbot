export interface LlamaCopyToClipboardProps {
  content: string;
}

export const useLlamaCopyToClipboard = ({ content }: LlamaCopyToClipboardProps) => {
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(content);
  };

  return {
    copyToClipboard,
  };
}