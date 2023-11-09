import * as React from "react";
import { forwardRef } from "react";
import styled, { css } from "styled-components";

interface IconButtonProps {
  children: React.ReactNode;
  circle?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

const StyledIconButton = styled.button<{ $circle?: boolean }>`
  border: none;
  background-color: transparent;
  width: 2rem;
  height: 2rem;
  cursor: pointer;

  &:focus {
    outline: none;
  }

  &:disabled {
    cursor: default;
    opacity: 0.5;

    &:hover {
      background-color: transparent;
    }
  }

  ${({ $circle }) =>
          $circle &&
          css`
            border: 1px solid #ccc;
            border-radius: 50%;
            transition: background-color 0.3s;

            &:hover {
              background-color: #f5f5f5;
            }
          `}
`;

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>((
  {
    children,
    circle,
    onClick,
    disabled,
  },
  ref,
) => (
  <StyledIconButton $circle={circle} disabled={disabled} onClick={onClick} ref={ref}>
    {children}
  </StyledIconButton>
));
