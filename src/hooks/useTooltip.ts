import React, { useRef, useState, useCallback, useEffect } from 'react';
import { createPopper, Instance } from '@popperjs/core/lib/popper-lite.js';
import preventOverflow from '@popperjs/core/lib/modifiers/preventOverflow.js';
import flip from '@popperjs/core/lib/modifiers/flip.js';

type ShowTipHandler = (text?: string) => void;
type HideTipHandler = () => void;

interface TooltipInfo {
  showTip: ShowTipHandler,
  hideTip: HideTipHandler,
  tooltipText: string,
  tipProps: Record<string, any>,
  tipRef: React.MutableRefObject<HTMLElement>,
  targetRef: React.MutableRefObject<Element>
};

export const useTooltip: () => TooltipInfo = () => {
  const { showTip, hideTip, tooltipText, tipProps, tipRef } = useTooltipController();
  const { showTip: showTargetTip, targetRef } = useTooltipTarget(tipRef.current, showTip);
  return { showTip: showTargetTip, hideTip, tooltipText, tipProps, tipRef, targetRef };
};

interface TooltipController {
  showTip: ShowTipHandler,
  hideTip: HideTipHandler,
  tooltipText: string,
  tipProps: Record<string, any>,
  tipRef: React.MutableRefObject<HTMLElement>
};

export const useTooltipController: () => TooltipController = () => {
  const tipRef = useRef<HTMLElement>();
  const [ tooltipText, setTooltipText ] = useState<string>(null);
  const [ tooltipVisible, setTooltipVisible ] = useState<boolean>(false);

  const showTip = useCallback((text: string) => {
    setTooltipVisible(true);
    setTooltipText(text)
  }, []);

  const hideTip = useCallback(() => setTooltipVisible(false), []);

  const tipProps = {
    ref: tipRef,
    role: 'tooltip'
  };

  if (tooltipVisible) tipProps['data-show'] = 1;

  return { showTip, hideTip, tooltipText, tipProps, tipRef };
};

interface TooltipTarget {
  showTip: ShowTipHandler,
  targetRef: React.MutableRefObject<Element>
}

export const useTooltipTarget: (tooltipElement: HTMLElement, showTip: ShowTipHandler) => TooltipTarget = (
  tooltipElement: HTMLElement,
  showTip: ShowTipHandler
) => {
  const targetRef = useRef<Element>(null);
  const popperRef = useRef<Instance>(null);

  useEffect(() => {
    if (tooltipElement && targetRef.current) {
      popperRef.current = createPopper(targetRef.current, tooltipElement, {
        placement: 'top',
        modifiers: [preventOverflow, flip],
      });
    }
  }, [targetRef, tooltipElement]);

  const showTargetTip = useCallback((text: string) => {
    showTip(text);
    if (popperRef.current) popperRef.current.update();
  }, [popperRef]);

  return { showTip: showTargetTip, targetRef };
};
