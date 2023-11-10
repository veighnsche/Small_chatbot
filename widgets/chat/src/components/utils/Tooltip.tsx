import styled, { css, keyframes } from "styled-components";
import { LlamaTooltipProps, TooltipState, useLlamaTooltip } from "../../hooks/components/utils/useLlamaTooltip";

const TooltipWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const slideInFromRight = keyframes`
  from {
    opacity: 0;
    right: 50%;
  }
  to {
    opacity: 1;
    right: 100%;
  }
`;

const slideOutToLeft = keyframes`
  from {
    opacity: 1;
    right: 100%;
  }
  to {
    opacity: 0;
    right: 50%;
  }
`;

const StyledTooltip = styled.div<{ $state: TooltipState }>`
  background-color: #333;
  color: #fff;
  padding: 5px 10px;
  border-radius: 5px;
  position: absolute;
  top: 50%;
  margin-right: 10px;
  transform: translateY(-50%);
  font-size: 12px;
  z-index: 10;
  opacity: 0;
  right: 110%;

  ${({ $state }) => {
    switch ($state) {
      case TooltipState.Show:
        return css`
          animation: ${slideInFromRight} 0.3s ease-in-out;
        `;
      case TooltipState.Active:
        return css`
          opacity: 1;
          right: 100%;
        `;
      case TooltipState.Hide:
        return css`
          animation: ${slideOutToLeft} 0.3s ease-in-out;
        `;
      default:
        return;
    }
  }}
`;

export const Tooltip = (props: LlamaTooltipProps) => {
  const {
    content,
    children,
    tooltipState,
    clickToAppear,
  } = useLlamaTooltip(props);

  return (
    <TooltipWrapper onClick={clickToAppear}>
      <StyledTooltip $state={tooltipState}>{content}</StyledTooltip>
      {children}
    </TooltipWrapper>
  );
};
