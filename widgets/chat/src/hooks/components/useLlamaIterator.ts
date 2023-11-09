import { setIter } from "../../slices/llamaChatSlice";
import { useLlamaDispatch } from "../../stores/llamaStore";

export interface IteratorProps {
  parent_id: string;
  iter: {
    total: number;
    current: number;
  };
}

export const useLlamaIterator = ({ parent_id, iter: { current, total } }: IteratorProps) => {
  const dispatch = useLlamaDispatch();

  const hidden = total === 1;

  const onPrev = () => {
    if (current === 1) return;
    dispatch(setIter({ parent_id, iter: current - 1 }));
  };

  const onNext = () => {
    if (current === total) return;
    dispatch(setIter({ parent_id, iter: current + 1 }));
  };

  return {
    current,
    total,
    hidden,
    onPrev,
    onNext,
  };
}