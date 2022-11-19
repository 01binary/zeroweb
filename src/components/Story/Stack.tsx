import React, { FC, useContext, useMemo, useEffect, useCallback } from 'react';
import { HexButton, HexList } from '../HexList';
import { StackSection } from './Story.styles';
import StoryContext from './StoryContext';
import JSIcon from '../../images/tool-js.svg';
import ExperienceContext from './ExperienceContext';
import { STACK_ICONS } from './storyUtils';

const Stack: FC = ({ children }) => {
  const { showTipFor, hideTip, setFilter } = useContext(StoryContext);
  const { setStack } = useContext(ExperienceContext);
  const keywords = useMemo(
    () =>
      (children ?? '')
        .toString()
        .toLowerCase()
        .split(',')
        .map((k) => k.trim()),
    [children]
  );

  useEffect(() => {
    setStack(keywords);
  }, [keywords, setStack]);

  return (
    <StackSection>
      <HexList>
        {keywords.map((text, index) => (
          <HexButton
            key={`tag${index}`}
            index={index}
            icon={STACK_ICONS[text] || JSIcon}
            tooltip={text}
            showTipFor={showTipFor}
            hideTip={hideTip}
            onClick={() =>
              setFilter(
                (filter) => `${filter ?? ''}${filter ? ' ' : ''}${text}`
              )
            }
          />
        ))}
      </HexList>
    </StackSection>
  );
};

export default Stack;
