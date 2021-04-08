import React, { FC, useRef, useState } from 'react';
import styled from 'styled-components';
import { usePopperTooltip } from 'react-popper-tooltip';
import DesignGraphic from '../images/design-graphic.svg';
import DesignIndustrial from '../images/design-industrial.svg';
import DesignSound from '../images/design-sound.svg';
import EngineeringElectrical from '../images/engineering-electrical.svg';
import EngineeringMechanical from '../images/engineering-mechanical.svg';
import EngineeringRobotics from '../images/engineering-robotics.svg';
import EngineeringSoftware from '../images/engineering-software.svg';
import Production from '../images/production.svg';
import ToolAbleton from '../images/tool-ableton.svg';
import ToolAfterEffects from '../images/tool-aftereffects.svg';
import ToolArduino from '../images/tool-arduino.svg';
import ToolBlender from '../images/tool-blender.svg';
import ToolCpp from '../images/tool-cpp.svg';
import ToolCs from '../images/tool-cs.svg';
import ToolInventor from '../images/tool-inventor.svg';
import ToolJs from '../images/tool-js.svg';
import ToolPremiere from '../images/tool-premiere.svg';
import ToolRaspi from '../images/tool-raspi.svg';
import Cell from '../images/cell.svg';
import 'react-popper-tooltip/dist/styles.css';

// Expected tag icon size
const ICON_SIZE = 36;

// Honeycomb cell border width and height
const CELL_WIDTH = 44;
const CELL_HEIGHT = 38;

// Width of a single interweaved repeat of 4 honeycomb cells
const ROW_WIDTH = 140;

// Height of two interweaved rows of honeycomb cells
const STRIP_HEIGHT = 56.5;

// Pixel offsets in multi-row honeycomb pattern
type CellOffset = {
  x: number,
  y: number
};

const PATTERN: CellOffset[] = [
  { x: 0, y: 38 },
  { x: 32, y: 56.5 },
  { x: 64, y: 38 },
  { x: 96, y: 56.5 },
  { x: 0, y: 75 },
  { x: 96, y: 19.5},
  { x: 32, y: 19.5},
  { x: 64, y: 75 },
  { x: 0, y: 1 },
  { x: 64, y: 1 }
  // more than 10 tags would be visual overload for the user
];

type Category = {
  [key: string]: JSX.Element
};

type CategoryMap = {
  [key: string]: Category | JSX.Element
};

const ICONS: CategoryMap = {
  // Tag icons for design disciplines
  design: {
    graphic: DesignGraphic,
    industrial: DesignIndustrial,
    sound: DesignSound
  },

  // Tag icons for engineering disciplines
  engineering: {
    electrical: EngineeringElectrical,
    mechanical: EngineeringMechanical,
    robotics: EngineeringRobotics,
    software: EngineeringSoftware
  },

  // Tag icon for production discipline
  production: Production,

  // Tag icons for tools
  tool: {
    ableton: ToolAbleton,
    aftereffects: ToolAfterEffects,
    arduino: ToolArduino,
    blender: ToolBlender,
    cpp: ToolCpp,
    cs: ToolCs,
    js: ToolJs,
    inventor: ToolInventor,
    premiere: ToolPremiere,
    raspi: ToolRaspi
  }
};

interface Tag {
  id: string,
  category: string,
  subCategory: string,
  description: string,
  icon: JSX.Element,
  x: number,
  y: number
};

const getTagIcon: (category: string, subCategory: string) => JSX.Element = (
  category,
  subCategory
) => (
  subCategory
    ? ICONS[category][subCategory]
    : ICONS[category]
);

const getTagDescription: (category: string, subCategory: string) => string = (
  category,
  subCategory
) => (
  subCategory
    ? `${subCategory} ${category}`
    : category
);

const denormalizeTag: (tag: string, index: number) => Tag = (
  tag,
  index
) => {
  const [ category, subCategory ] = tag.trim().split('-');
  return ({
    id: tag,
    category,
    subCategory,
    description: getTagDescription(category, subCategory),
    icon: getTagIcon(category, subCategory),
    x: PATTERN[index].x,
    y: PATTERN[index].y
  });
};

const denormalizeInlineTag: (tag: string, index: number, tags: string[]) => Tag = (
  tag,
  index,
  tags
) => {
  const [ category, subCategory ] = tag.trim().split('-');
  const repeats = Math.ceil(tags.length / 4) - 1;
  return ({
    id: tag,
    category,
    subCategory,
    description: getTagDescription(category, subCategory),
    icon: getTagIcon(category, subCategory),
    x: PATTERN[index % 4].x + (index > 3 ? repeats * 128 : 0),
    y: PATTERN[index % 4].y - CELL_HEIGHT
  });
};

const getOffset = (
  count: number,
  alwaysInline?: boolean
) => {
  if (alwaysInline) {
    return 0;
  } else {
    if (count <= 4)
      return -CELL_HEIGHT;
    else if (count === 7)
      return -19;
    else if (count < 8)
      return -38;
    else
      return -20;
  }
};

const getWidth = (
  count: number,
  inline?: boolean,
  alwaysInline?: boolean
) => (
  inline || alwaysInline
    ? count * 32 + 12
    : ROW_WIDTH
);

const getDisplay = (
  inline: boolean,
  alwaysInline: boolean,
  defaultNone: boolean) => {
    if (alwaysInline) {
      return 'block';
    } else if (inline) {
      return defaultNone ? 'block': 'none';
    } else {
      return defaultNone ? 'none': 'block';
    }
};

const TagListWrapper = styled.ul`
  display: ${({ Inline, AlwaysInline }) =>
    getDisplay(Inline, AlwaysInline, false)};

  position: relative;
  list-style-type: none;
  margin-top: ${props =>
    getOffset(props.Count, props.Inline || props.AlwaysInline)}px;
  margin-block-end: 0;
  margin-right: 0;
  overflow: hidden;

  height: ${props => props.Height}px;
  width: ${props =>
    getWidth(props.Count, props.Inline, props.AlwaysInline)}px;

  @media(max-width: ${props => props.theme.mobile}) {
    display: ${({ Inline, AlwaysInline }) =>
      getDisplay(Inline, AlwaysInline, true)};
  }
`;

const TagWrapper = styled.li`
  position: absolute;
  left: ${props => props.X}px;
  top: ${props => props.Y}px;
  width: ${CELL_WIDTH}px;
  height: ${CELL_HEIGHT}px;

  .tag-border {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }

  .tag-icon {
    position: absolute;
    left: ${(CELL_WIDTH - ICON_SIZE) / 2}px;
    top: ${(CELL_HEIGHT - ICON_SIZE) / 2}px;
  }
`;

const TagLink = styled.a`
  position: absolute;
  width: 100%;
  height: 100%;
  
  .tag-icon {
    opacity: 0.85;
    transition:
      opacity ${props => props.theme.animationFast} ease-out;
  }

  &:hover {
    .tag-icon {
      opacity: 1;
    }
  }

  &:focus {
    outline: none;
    z-index: 1;

    .stroke-border {
      stroke: ${props => props.theme.focusColor};
    }
  }
`;

interface TagListProps {
  tags: string[],
  inline: boolean | undefined,
  alwaysInline: boolean | undefined
};

interface TagProps {
  id: string,
  x: number,
  y: number,
  icon: JSX.Element,
  setTriggerRef: React.Dispatch<React.SetStateAction<HTMLElement>>,
  onMouseOver: any,
  onMouseOut: any
};

const Tag: FC<TagProps> = ({
  id,
  x,
  y,
  icon: Icon,
  setTriggerRef,
  onMouseOver,
  onMouseOut
}) => {
  return (
    <TagWrapper X={x} Y={y}>
      <TagLink
        href={`/?tag=${id}`}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        ref={setTriggerRef}
      >
        <Cell className="tag-border" />
        <Icon className="tag-icon" />
      </TagLink>
    </TagWrapper>
  );
};

const TagList: FC<TagListProps> = ({
  tags,
  alwaysInline,
  inline
}) => {
  const [ selectedTag, setSelectedTag ] = useState<string>(null);
  const {
    getArrowProps,
    getTooltipProps,
    setTriggerRef,
    visible,
  } = usePopperTooltip();

  const denorm = tags.map(inline || alwaysInline
    ? denormalizeInlineTag
    : denormalizeTag);

  const ids = denorm.reduce((acc, { id }, index) => {
    acc[id] = index;
    return acc
  }, {});

  const height = tags.length === 1
    ? CELL_HEIGHT
    : inline || alwaysInline
    ? STRIP_HEIGHT
    : denorm.reduce(
      (acc, { y }) => Math.max(acc, y), 0) + CELL_HEIGHT;

  return (
    <>
      <TagListWrapper
        Count={denorm.length}
        Height={height}
        Inline={inline}
        AlwaysInline={alwaysInline}
      >
        {denorm.map(tag => (
          <Tag
            key={tag.id} {...tag}
            onMouseOver={() => setSelectedTag(tag.id)}
            
            setTriggerRef={selectedTag === tag.id ? setTriggerRef : null}
          />
        ))}
      </TagListWrapper>
      {selectedTag && (
        <div {...getTooltipProps({ className: 'tooltip-container' })}>
          {denorm[ids[selectedTag]].description}
          <div {...getArrowProps({ className: 'tooltip-arrow' })} />
        </div>
      )}
    </>
  );
};

export default TagList;
