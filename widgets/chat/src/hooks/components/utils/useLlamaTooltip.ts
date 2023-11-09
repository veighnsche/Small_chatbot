import { ReactNode, useEffect, useState } from "react";

export interface LlamaTooltipProps {
  content: string;
  children: ReactNode;
  onClick?: () => void;
}

export enum TooltipState {
  Hidden = "hidden",
  Show = "show",
  Active = "active",
  Hide = "hide",
}

export const useLlamaTooltip = ({ onClick, ...props }: LlamaTooltipProps) => {
  const [state, setState] = useState<TooltipState>(TooltipState.Hidden);

  useEffect(() => {
    const SHOW_ANIMATION_DURATION = 300;
    const ACTIVE_DURATION = 2000;
    const HIDE_ANIMATION_DURATION = 300;

    let timer: NodeJS.Timeout;

    switch (state) {
      case TooltipState.Show:
        timer = setTimeout(() => setState(TooltipState.Active), SHOW_ANIMATION_DURATION);
        break;
      case TooltipState.Active:
        timer = setTimeout(() => setState(TooltipState.Hide), ACTIVE_DURATION);
        break;
      case TooltipState.Hide:
        timer = setTimeout(() => setState(TooltipState.Hidden), HIDE_ANIMATION_DURATION);
        break;
    }

    return () => clearTimeout(timer);
  }, [state]);

  const clickToAppear = () => {
    if (onClick) {
      onClick();
    }
    setState(TooltipState.Show);
  };

  return {
    ...props,
    tooltipState: state,
    clickToAppear,
  };
};