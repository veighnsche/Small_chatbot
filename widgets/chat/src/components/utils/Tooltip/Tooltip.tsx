import { LlamaTooltipProps, TooltipState, useLlamaTooltip } from "./useLlamaTooltip.ts";
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
      case TooltipState.Show:
        return 'show';
      case TooltipState.Active:
        return 'active';
      case TooltipState.Hide:
        return 'hide';
      default:
        return '';
    }
  };

  return (
    <div className="tooltip-wrapper" onClick={clickToAppear}>
      <div className={`tooltip ${getStateClass()}`}>{content}</div>
      {children}
    </div>
  );
};
