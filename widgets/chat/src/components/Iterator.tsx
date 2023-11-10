import { IteratorProps, useLlamaIterator } from "../hooks/components/useLlamaIterator";
import '../styles/Iterator.css';

export const Iterator = (props: IteratorProps) => {
  const {
    current,
    total,
    hidden,
    onPrev,
    onNext,
  } = useLlamaIterator(props);

  if (hidden) {
    return <div className="iterator-wrapper"/>;
  }

  return (
    <div className="iterator-wrapper">
      <div className="iterator-line">
        <button className="iterator-button" onClick={onPrev}>
          &lt;
        </button>
        {` ${current} / ${total} `}
        <button className="iterator-button" onClick={onNext}>
          &gt;
        </button>
      </div>
    </div>
  );
};
