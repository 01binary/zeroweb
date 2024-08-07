/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Tooltip hooks.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { createPopper, Instance } from '@popperjs/core/lib/popper-lite.js';
import preventOverflow from '@popperjs/core/lib/modifiers/preventOverflow.js';
import flip from '@popperjs/core/lib/modifiers/flip.js';
import offset from '@popperjs/core/lib/modifiers/offset.js';
import arrow from '@popperjs/core/lib/modifiers/arrow.js';
import { MOBILE } from '../constants';
import { Placement } from '@popperjs/core/lib/enums';

export type ShowTipHandler = (text: string | null) => void;
export type ShowTipForHandler = (
  text: string | null,
  targetRef?: React.MutableRefObject<HTMLElement | undefined>
) => void;
export type HideTipHandler = () => void;
export type UpdateTipHandler = () => void;

type TooltipOptions = {
  verticalOffsetDesktop?: number;
  verticalOffsetMobile?: number;
  placement?: Placement;
};

export const useTooltip = ({
  verticalOffsetDesktop,
  verticalOffsetMobile,
  placement,
}: TooltipOptions | undefined = {}) => {
  const {
    showTip,
    hideTip,
    tooltipText,
    tooltipVisible,
    tipProps,
    tipRef,
  } = useTooltipController();

  const { showTip: showTargetTip, updateTip, targetRef } = useTooltipTarget({
    tooltipElement: tipRef.current,
    showTip,
    verticalOffsetDesktop,
    verticalOffsetMobile,
    placement,
  });

  const showTipFor = useCallback<ShowTipForHandler>(
    (text, ref) => {
      if (ref) targetRef.current = ref.current;
      updateTip();
      showTargetTip(text);
    },
    [updateTip, showTargetTip]
  );

  return {
    showTip: showTargetTip,
    showTipFor,
    hideTip,
    tooltipText,
    tooltipVisible,
    tipProps,
    tipRef,
    targetRef,
  };
};

export const useTooltipController = () => {
  const tipRef = useRef<HTMLElement>();
  const [tooltipText, setTooltipText] = useState<string | null>();
  const [tooltipVisible, setTooltipVisible] = useState<boolean>(false);

  const showTip = useCallback(
    (text: string | null) => {
      setTooltipVisible(true);
      setTooltipText(text);
    },
    [setTooltipVisible, setTooltipText]
  );

  const hideTip = useCallback(() => setTooltipVisible(false), [
    setTooltipVisible,
  ]);

  const tipProps = {
    ref: tipRef,
    role: 'tooltip',
  };

  if (tooltipVisible) tipProps['data-show'] = 1;

  return { showTip, hideTip, tooltipText, tooltipVisible, tipProps, tipRef };
};

type TooltipTargetOptions = {
  tooltipElement?: HTMLElement;
  showTip: ShowTipHandler;
  verticalOffsetDesktop?: number;
  verticalOffsetMobile?: number;
  placement?: Placement;
};

export const useTooltipTarget = ({
  tooltipElement,
  showTip,
  verticalOffsetDesktop = 0,
  verticalOffsetMobile = 0,
  placement = 'top',
}: TooltipTargetOptions) => {
  const targetRef = useRef<HTMLElement>();
  const popperRef = useRef<Instance>();
  const isMobile =
    typeof window !== `undefined`
      ? window.matchMedia(`(max-width: ${MOBILE})`).matches
      : false;

  const updateTip = useCallback(() => {
    if (tooltipElement && targetRef.current) {
      popperRef.current = createPopper(targetRef.current, tooltipElement, {
        placement,
        modifiers: [
          {
            ...offset,
            options: {
              offset: () => [
                0,
                isMobile ? verticalOffsetMobile : verticalOffsetDesktop,
              ],
            },
          },
          {
            ...arrow,
            options: {
              element: '[data-popper-arrow]',
            },
          },
          preventOverflow,
          flip,
        ],
      });
    }
  }, [targetRef, popperRef, tooltipElement, isMobile]);

  useEffect(() => {
    updateTip();
  }, [updateTip]);

  const showTargetTip = useCallback(
    (text: string | null) => {
      showTip(text);
      if (popperRef.current) popperRef.current.update();
    },
    [popperRef]
  );

  return { showTip: showTargetTip, targetRef, updateTip };
};

export const useSharedTooltip = (
  tooltip: string | null,
  showTipFor?: ShowTipForHandler
) => {
  const targetRef = useRef<HTMLElement>();
  const showTip = useCallback(() => showTipFor?.(tooltip, targetRef), [
    tooltip,
    showTipFor,
  ]);
  return {
    targetRef,
    showTip,
  };
};
