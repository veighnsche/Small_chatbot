import { AnimationState } from "../../../types/AnimationState.ts";
import { LlamaTooltipProps, useLlamaTooltip } from "./useLlamaTooltip.ts";
import './Tooltip.css';

export const Tooltip = (props: LlamaTooltipProps) => {
  const {
    content,
    children,
    tooltipState,
    clickToAppear,
  } = useLlamaTooltip(props);

  const getStateClass = () => {
    switch (tooltipState) {
      case AnimationState.Show:
        return 'show';
      case AnimationState.Active:
        return 'active';
      case AnimationState.Hide:
        return 'hide';
      default:
        return '';
    }
  };

  return (
    <div className="tooltip-wrapper" style={{
      display: tooltipState === AnimationState.Hide ? 'none' : 'block',
    }} onClick={clickToAppear}>
      <div className={`tooltip ${getStateClass()}`}>{content}</div>
      {children}
    </div>
  );
};
