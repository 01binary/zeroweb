import React, { useRef, useState, useCallback, useEffect } from 'react';
import { createPopper, Instance } from '@popperjs/core/lib/popper-lite.js';
import preventOverflow from '@popperjs/core/lib/modifiers/preventOverflow.js';
import flip from '@popperjs/core/lib/modifiers/flip.js';
import offset from '@popperjs/core/lib/modifiers/offset.js';
import arrow from '@popperjs/core/lib/modifiers/arrow.js';
import { mobile } from '../constants';
import { Placement } from '@popperjs/core/lib/enums';

export type ShowTipHandler = (text?: string) => void;
export type HideTipHandler = () => void;

interface TooltipInfo {
  showTip: ShowTipHandler;
  hideTip: HideTipHandler;
  tooltipText: string;
  tipProps: Record<string, any>;
  tipRef: React.MutableRefObject<HTMLElement>;
  targetRef: React.MutableRefObject<Element>;
};

interface TooltipOptions {
  verticalOffsetDesktop?: number;
  verticalOffsetMobile?: number;
  placement?: Placement;
};

export const useTooltip = ({
  verticalOffsetDesktop,
  verticalOffsetMobile,
  placement
}: TooltipOptions): TooltipInfo => {
  const {
    showTip,
    hideTip,
    tooltipText,
    tipProps,
    tipRef
  } = useTooltipController();
  const {
    showTip: showTargetTip,
    targetRef
  } = useTooltipTarget({
    tooltipElement: tipRef.current,
    showTip,
    verticalOffsetDesktop,
    verticalOffsetMobile,
    placement
  });

  return {
    showTip: showTargetTip,
    hideTip,
    tooltipText,
    tipProps,
    tipRef,
    targetRef
  };
};

interface TooltipController {
  showTip: ShowTipHandler;
  hideTip: HideTipHandler;
  tooltipText: string;
  tipProps: Record<string, any>;
  tipRef: React.MutableRefObject<HTMLElement>;
};

export const useTooltipController = (): TooltipController => {
  const tipRef = useRef<HTMLElement>();
  const [ tooltipText, setTooltipText ] = useState<string>(null);
  const [ tooltipVisible, setTooltipVisible ] = useState<boolean>(false);

  const showTip = useCallback((text: string) => {
    setTooltipVisible(true);
    setTooltipText(text)
  }, [setTooltipVisible, setTooltipText]);

  const hideTip = useCallback(
    () => setTooltipVisible(false),
  [setTooltipVisible]);

  const tipProps = {
    ref: tipRef,
    role: 'tooltip'
  };

  if (tooltipVisible) tipProps['data-show'] = 1;

  return { showTip, hideTip, tooltipText, tipProps, tipRef };
};

interface TooltipTarget {
  showTip: ShowTipHandler;
  targetRef: React.MutableRefObject<Element>;
};

interface TooltipTargetOptions {
  tooltipElement: HTMLElement,
  showTip: ShowTipHandler,
  verticalOffsetDesktop: number;
  verticalOffsetMobile: number;
  placement: Placement;
};

export const useTooltipTarget = ({
  tooltipElement,
  showTip,
  verticalOffsetDesktop = 0,
  verticalOffsetMobile = 0,
  placement = 'top'
}: TooltipTargetOptions): TooltipTarget => {
  const targetRef = useRef<Element>(null);
  const popperRef = useRef<Instance>(null);
  const isMobile = window.matchMedia(`(max-width: ${mobile})`).matches;

  useEffect(() => {
    if (tooltipElement && targetRef.current) {
      popperRef.current = createPopper(targetRef.current, tooltipElement, {
        placement,
        modifiers: [
          {
            ...offset,
            options: {
              offset: () => [
                0,
                isMobile
                  ? verticalOffsetMobile
                  : verticalOffsetDesktop
              ]
            }
          },
          {
            ...arrow,
            options: {
              element: '[data-popper-arrow]'
            }
          },
          preventOverflow,
          flip,
        ],
      });
    }
  }, [targetRef, popperRef, tooltipElement, isMobile]);

  const showTargetTip = useCallback((text: string) => {
    showTip(text);
    if (popperRef.current) popperRef.current.update();
  }, [popperRef]);

  return { showTip: showTargetTip, targetRef };
};
