import React, {
  FC,
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
} from 'react';
import styled from 'styled-components';
import { MOBILE } from '../constants';

const TabsWrapper = styled.section`
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  width: calc(100% - ${(props) => props.theme.spacing});
  margin: 0 ${(props) => props.theme.spacingHalf};
`;

const TabHeader = styled.section<{ hasLabel: boolean }>`
  display: flex;
  border-bottom: ${(props) => props.theme.border} solid
    ${(props) => props.theme.borderColor};

  @media (max-width: ${MOBILE}) {
    align-items: flex-start;
    ${(props) => !props.hasLabel && `flex-direction: column`};
    border-bottom: initial;
  }
`;

const TabHeaderLabel = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  font-weight: 500;
`;

const TabLabel = styled.button<{ hasHeaderLabel: boolean; selected: boolean }>`
  font-family: ${(props) => props.theme.normalFont};
  font-weight: ${(props) => props.theme.normalFontWeight};
  font-size: ${(props) => props.theme.normalFontSize};

  border: none;
  cursor: pointer;
  fill: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: none;
  padding: ${(props) => props.theme.spacingHalf};

  color: ${(props) =>
    props.theme.isDark
      ? props.theme.primaryColor
      : props.theme.accentTextColor};

  ${(props) =>
    props.selected
      ? `border-bottom: ${props.theme.border} solid ${props.theme.primaryColor}`
      : `border-bottom: ${props.theme.border} solid ${props.theme.backgroundColor}`};

  &:hover {
    color: ${(props) =>
      props.theme.isDark
        ? props.theme.primaryLightColor
        : props.theme.primaryDarkColor};
    border-bottom: ${(props) => props.theme.border} solid
      ${(props) =>
        props.theme.isDark
          ? props.theme.primaryLightColor
          : props.theme.primaryDarkColor};
  }

  transition: color ${(props) => props.theme.animationFast} ease-out;

  @media (max-width: ${MOBILE}) {
    text-align: left;
    padding: 0;
    border-bottom: initial !important;
    line-height: ${(props) => props.theme.normalFontLineHeight};
    ${(props) => props.hasHeaderLabel && `margin-left: 10px`};

    &:hover {
      border-bottom: initial !important;
      text-decoration: underline;
    }
  }
`;

const TabStrip = styled.section<{ selected: number }>`
  display: flex;
  transition: transform ${(props) => props.theme.animationFast} ease-in-out,
    opacity ${(props) => props.theme.animationFast} ease-in-out;
  transform: translateX(calc(0px - ${(props) => props.selected} * 100%));
  animation: opacity 0.3s ease-in-out 1;
  opacity: 1;

  @keyframes opacityAnimation {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

const TabWrapper = styled.section`
  min-width: 100%;
  max-width: 100%;

  section {
    &:before,
    &:after {
      content: initial;
    }
  }

  ul {
    padding-left: ${(props) => props.theme.spacingHalf};
  }

  p {
    margin-left: initial;
  }
`;

type TabsContext = {
  addTab: (label: string) => void;
};

const TabContext = createContext<TabsContext>({
  addTab: () => {},
});

type TabProps = {
  label: string;
};

export const Tabs: FC<TabProps> = ({ label: headerLabel, children }) => {
  const [tabs, setTabs] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState<number>(0);

  const addTab = useCallback(
    (label: string) =>
      setTabs((oldTabs) =>
        oldTabs.indexOf(label) < 0 ? [...oldTabs, label] : oldTabs
      ),
    [setTabs]
  );

  const switchTab = useCallback(
    (label: string) => setSelectedTab(tabs.indexOf(label)),
    [setSelectedTab, tabs]
  );

  return (
    <TabContext.Provider value={{ addTab }}>
      <TabsWrapper>
        <TabHeader hasLabel={Boolean(headerLabel)}>
          {headerLabel && <TabHeaderLabel>{headerLabel}</TabHeaderLabel>}
          {tabs.map((label, index) => (
            <TabLabel
              key={label}
              onClick={() => switchTab(label)}
              hasHeaderLabel={Boolean(headerLabel)}
              selected={index === selectedTab}
            >
              {label}
            </TabLabel>
          ))}
        </TabHeader>
        <TabStrip selected={selectedTab}>{children}</TabStrip>
      </TabsWrapper>
    </TabContext.Provider>
  );
};

export const Tab: FC<TabProps> = ({ label, children }) => {
  const { addTab } = useContext(TabContext);

  useEffect(() => addTab(label), [label]);

  return <TabWrapper>{children}</TabWrapper>;
};
