import "./Iterator.css";
import { IteratorProps, useLlamaIterator } from "./useLlamaIterator.ts";

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
        <button
          className="iterator-button"
          onClick={onPrev}
          disabled={current === 1}
          title={current === 1 ? "You are at the beginning of the list" : ""}
        >
          &lt;
        </button>
        {` ${current} / ${total} `}
        <button
          className="iterator-button"
          onClick={onNext}
          disabled={current === total}
          title={current === total ? "You are at the end of the list" : ""}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};
