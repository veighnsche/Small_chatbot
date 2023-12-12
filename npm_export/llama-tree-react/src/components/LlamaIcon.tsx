import React, { useEffect } from "react";

interface IconProps {
  icon: 'check' | 'cross' | 'edit' | 'refresh';
}

export const LlamaIcon = ({ icon }: IconProps) => {
  const ImportedIconRef = React.useRef<any>();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    setLoading(true);
    const importIcon = async () => {
      try {
        ImportedIconRef.current = (await import(`../icons/${icon}.svg`)).default;
      } catch (err) {
        throw err;
      } finally {
        setLoading(false);
      }
    };
    importIcon();
  }, [icon]);

  if (!loading && ImportedIconRef.current) {
    const { current: ImportedIcon } = ImportedIconRef;
    return <ImportedIcon />;
  }

  return null;
};