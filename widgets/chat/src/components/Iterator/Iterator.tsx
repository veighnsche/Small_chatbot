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
    return null;
  }

  return (
    <div className="iterator-wrapper">
      <div className="iterator-line">
        <button
          className="iterator-button"
          onClick={onPrev}
          disabled={current === 1}
          title={current === 1 ? "You are at the beginning of the list" : "Previous iteration"}
        >
          &lt;
        </button>
        {` ${current} / ${total} `}
        <button
          className="iterator-button"
          onClick={onNext}
          disabled={current === total}
          title={current === total ? "You are at the end of the list" : "Next iteration"}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};
