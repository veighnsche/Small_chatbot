import * as React from "react";
import styled from "styled-components";
import { IteratorProps, useLlamaIterator } from "../hooks/components/useLlamaIterator";

const IteratorWrapper = styled.div`
  margin-left: 1.7rem;
  height: 1rem;
  margin-top: 2px;
  display: flex;
  justify-content: center;
`;

const IteratorLine = styled.div`
  font-size: 0.85rem;
  color: #888;
`;

const IteratorButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: inherit;
  padding: 0;
  margin: 0;
  color: inherit;
  outline: none;
`;

export const Iterator = (props: IteratorProps) => {
  const {
    current,
    total,
    hidden,
    onPrev,
    onNext,
  } = useLlamaIterator(props);

  if (hidden) {
    return <IteratorWrapper/>;
  }

  return (
    <IteratorWrapper>
      <IteratorLine>
        <IteratorButton onClick={onPrev}>
          &lt;
        </IteratorButton>
        {` ${current} / ${total} `}
        <IteratorButton onClick={onNext}>
          &gt;
        </IteratorButton>
      </IteratorLine>
    </IteratorWrapper>
  );
};