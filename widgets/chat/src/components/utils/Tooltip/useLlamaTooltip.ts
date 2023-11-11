import { ReactNode, useEffect, useState } from "react";
import { AnimationState } from "../../../types/AnimationState.ts";

export interface LlamaTooltipProps {
  content: string;
  children: ReactNode;
  onClick?: () => void;
}

export const useLlamaTooltip = ({ onClick, ...props }: LlamaTooltipProps) => {
  const [state, setState] = useState<AnimationState>(AnimationState.Hidden);

  useEffect(() => {
    const SHOW_ANIMATION_DURATION = 300;
    const ACTIVE_DURATION = 2000;
    const HIDE_ANIMATION_DURATION = 300;

    let timer: NodeJS.Timeout;

    switch (state) {
      case AnimationState.Show:
        timer = setTimeout(() => setState(AnimationState.Active), SHOW_ANIMATION_DURATION);
        break;
      case AnimationState.Active:
        timer = setTimeout(() => setState(AnimationState.Hide), ACTIVE_DURATION);
        break;
      case AnimationState.Hide:
        timer = setTimeout(() => setState(AnimationState.Hidden), HIDE_ANIMATION_DURATION);
        break;
    }

    return () => clearTimeout(timer);
  }, [state]);

  const clickToAppear = () => {
    if (onClick) {
      onClick();
    }
    setState(AnimationState.Show);
  };

  return {
    ...props,
    tooltipState: state,
    clickToAppear,
  };
};