/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Tag list compomnent used to display post tags.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import React, { FC } from 'react';
import styled from 'styled-components';
import { TagGroup } from '../types/TagsQuery';
import { Link } from 'gatsby';
import { Tooltip, Arrow } from './Tooltip';
import {
  useTooltipController,
  useTooltipTarget,
  ShowTipHandler,
  HideTipHandler,
} from '../hooks/useTooltip';
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
import CONTENT from '../routes';
import { MOBILE } from '../constants';

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
  x: number;
  y: number;
};

const PATTERN: CellOffset[] = [
  { x: 0, y: 38 },
  { x: 32, y: 56.5 },
  { x: 64, y: 38 },
  { x: 96, y: 56.5 },
  { x: 0, y: 75 },
  { x: 96, y: 19.5 },
  { x: 32, y: 19.5 },
  { x: 64, y: 75 },
  { x: 0, y: 1 },
  { x: 64, y: 1 },
  // more than 10 tags would be visual overload for the user
];

type Category = {
  [key: string]: CategoryInfo;
};

type CategoryInfo = {
  icon: JSX.Element;
  description: string;
};

type CategoryMap = {
  [key: string]: Category | CategoryInfo;
};

const ICONS: CategoryMap = {
  // Tag icons for design disciplines
  design: {
    graphic: { icon: DesignGraphic, description: 'Graphic design' },
    industrial: { icon: DesignIndustrial, description: 'Industrial design' },
    sound: { icon: DesignSound, description: 'Sound design' },
  },

  // Tag icons for engineering disciplines
  engineering: {
    electrical: {
      icon: EngineeringElectrical,
      description: 'Electrical engineering',
    },
    mechanical: {
      icon: EngineeringMechanical,
      description: 'Mechanical engineering',
    },
    robotics: { icon: EngineeringRobotics, description: 'Robotics' },
    software: {
      icon: EngineeringSoftware,
      description: 'Software engineering',
    },
  },

  // Tag icon for production discipline
  production: { icon: Production, description: 'Media production' },

  // Tag icons for tools
  tool: {
    ableton: { icon: ToolAbleton, description: 'Ableton' },
    aftereffects: { icon: ToolAfterEffects, description: 'AfterEffects' },
    arduino: { icon: ToolArduino, description: 'Arduino' },
    blender: { icon: ToolBlender, description: 'Blender' },
    cpp: { icon: ToolCpp, description: 'C++' },
    cs: { icon: ToolCs, description: 'C#' },
    js: { icon: ToolJs, description: 'JavaScript' },
    inventor: { icon: ToolInventor, description: 'Autodesk Inventor' },
    premiere: { icon: ToolPremiere, description: 'Premiere' },
    raspi: { icon: ToolRaspi, description: 'Raspberry Pi' },
  },
};

interface Tag {
  id: string;
  category: string;
  subCategory: string;
  description: string;
  icon: JSX.Element;
}

interface DisplayTag extends Tag {
  x: number;
  y: number;
}

export const getTagComponents = (tag: string) =>
  tag ? tag.trim().split('-') : [];

export const getTagDescriptionById = (tagId: string): string => {
  const [category, subCategory] = getTagComponents(tagId);
  return tagId ? getTagDescription(category, subCategory) : '';
};

const getTagIcon = (category: string, subCategory: string): JSX.Element =>
  subCategory ? ICONS[category][subCategory].icon : ICONS[category].icon;

const getTagDescription = (category: string, subCategory: string): string =>
  subCategory
    ? ICONS[category][subCategory].description
    : ICONS[category].description;

const mapTag = (tag: string): Tag => {
  const [category, subCategory] = getTagComponents(tag);
  return {
    id: tag,
    category,
    subCategory,
    description: getTagDescription(category, subCategory),
    icon: getTagIcon(category, subCategory),
  };
};

const denormalizeTag = (
  tag: string,
  index: number,
  tags: string[]
): DisplayTag => ({
  ...mapTag(tag),
  x: tags.length === 1 ? 0 : PATTERN[index].x,
  y: tags.length === 1 ? 0 : PATTERN[index].y,
});

const denormalizeInlineTag = (
  tag: string,
  index: number,
  tags: string[]
): DisplayTag => {
  const repeats = Math.ceil(tags.length / 4) - 1;
  return {
    ...mapTag(tag),
    x: PATTERN[index % 4].x + (index > 3 ? repeats * 128 : 0),
    y: PATTERN[index % 4].y - CELL_HEIGHT,
  };
};

const getOffset = (count: number, alwaysInline?: boolean): number => {
  if (alwaysInline) {
    return 0;
  } else {
    if (count === 1) return 0;
    else if (count <= 4) return -CELL_HEIGHT;
    else if (count === 7) return -19;
    else if (count < 8) return -38;
    else return -20;
  }
};

const getWidth = (
  count: number,
  inline?: boolean,
  alwaysInline?: boolean
): number => (inline || alwaysInline ? count * 32 + 12 : ROW_WIDTH);

const getHeight = (
  inline: boolean,
  alwaysInline: boolean,
  denormTags: DisplayTag[]
): number =>
  denormTags.length === 1
    ? CELL_HEIGHT
    : inline || alwaysInline
    ? STRIP_HEIGHT
    : denormTags.reduce((acc, { y }) => Math.max(acc, y), 0) + CELL_HEIGHT;

const getDisplay = (
  inline: boolean,
  alwaysInline: boolean,
  defaultNone: boolean
): string => {
  if (alwaysInline) {
    return 'block';
  } else if (inline) {
    return defaultNone ? 'block' : 'none';
  } else {
    return defaultNone ? 'none' : 'block';
  }
};

const getTagUrl = (collection: string, id: string) => {
  const searchCollection = collection === 'logs' ? 'projects' : collection;
  const { path } = CONTENT.find(
    ({ collection: routeCollection }) => routeCollection === searchCollection
  );
  return `${path}${path.endsWith('/') ? '' : '/'}tags/${id}`;
};

const TagListWrapper = styled.ul`
  display: ${({ Inline, AlwaysInline }) =>
    getDisplay(Inline, AlwaysInline, false)};

  position: relative;
  list-style-type: none;
  margin-top: ${(props) =>
    getOffset(props.Count, props.Inline || props.AlwaysInline)}px;
  margin-block-end: 0;
  margin-right: 0;
  overflow: hidden;

  height: ${(props) => props.Height}px;
  width: ${(props) =>
    getWidth(props.Count, props.Inline, props.AlwaysInline)}px;

  @media (max-width: ${MOBILE}) {
    display: ${({ Inline, AlwaysInline }) =>
      getDisplay(Inline, AlwaysInline, true)};
  }
`;

const TagWrapper = styled.li`
  position: absolute;
  left: ${(props) => props.X}px;
  top: ${(props) => props.Y}px;
  width: ${CELL_WIDTH}px;
  height: ${CELL_HEIGHT}px;

  opacity: 0;
  animation: slideIn 0.3s ${(props) => 0.1 * ((props.Index % 2) + 1)}s ease-out
    1;
  animation-fill-mode: forwards;

  @keyframes slideIn {
    0% {
      opacity: 0;
      transform: translate(8px, 8px);
    }

    100% {
      opacity: 1;
      transform: translate(0px, 0px);
    }
  }

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

const TagLink = styled(Link)`
  position: absolute;
  width: 100%;
  height: 100%;

  .tag-icon {
    opacity: 0.85;
    transition: opacity ${(props) => props.theme.animationFast} ease-out;
  }

  &:hover {
    .tag-icon {
      opacity: 1;
    }
  }

  &:focus {
    z-index: 1;
    outline: none;
    border-radius: initial;
    box-shadow: initial;

    .stroke-border {
      stroke: ${(props) => props.theme.focusColor};
    }
  }
`;

interface TagListProps {
  tags: string[];
  stats: TagGroup[];
  collection: string;
  inline?: boolean;
  alwaysInline?: boolean;
}

const TagList: FC<TagListProps> = ({
  tags,
  stats,
  collection,
  alwaysInline,
  inline,
}) => {
  const denorm = tags.map(
    inline || alwaysInline ? denormalizeInlineTag : denormalizeTag
  );

  const counts = stats.reduce((acc, { tag, totalCount }) => {
    acc[tag] = totalCount;
    return acc;
  }, {});

  const {
    showTip,
    hideTip,
    tooltipText,
    tipProps,
    tipRef,
  } = useTooltipController();

  const lines = tooltipText?.split('\n');

  return (
    <>
      <TagListWrapper
        Count={denorm.length}
        Height={getHeight(inline, alwaysInline, denorm)}
        Inline={inline}
        AlwaysInline={alwaysInline}
      >
        {denorm.map((tag, index) => (
          <Tag
            key={tag.id}
            index={index}
            tooltipElement={tipRef.current}
            showTip={showTip}
            hideTip={hideTip}
            inline={inline || alwaysInline}
            group={collection}
            groupCount={counts[tag.id]}
            {...tag}
          />
        ))}
      </TagListWrapper>
      <Tooltip {...tipProps} role="tooltip">
        {lines && lines.map((line, index) => <div key={index}>{line}</div>)}
        <Arrow />
      </Tooltip>
    </>
  );
};

const getTooltipText = (
  description: string,
  group: string,
  groupCount: number
): string =>
  `${description}\n(${groupCount} ${
    groupCount === 1 ? group.substr(0, group.length - 1) : group
  })`;

type TagProps = {
  id: string;
  x: number;
  y: number;
  icon: JSX.Element;
  description: string;
  group: string;
  groupCount: number;
  inline: boolean;
  index: number;
  tooltipElement: HTMLElement;
  showTip: ShowTipHandler;
  hideTip: HideTipHandler;
};

const Tag: FC<TagProps> = ({
  id,
  x,
  y,
  icon: Icon,
  description,
  group,
  groupCount,
  inline,
  index,
  tooltipElement,
  showTip,
  hideTip,
}) => {
  const { showTip: showTargetTip, targetRef } = useTooltipTarget({
    tooltipElement,
    showTip,
    verticalOffsetDesktop: 10,
    verticalOffsetMobile: 10,
    placement: 'top',
  });

  return (
    <TagWrapper X={x} Y={y} Inline={inline ? 1 : 0} Index={index}>
      <TagLink
        to={getTagUrl(group, id)}
        ref={targetRef}
        onMouseOver={() =>
          showTargetTip(getTooltipText(description, group, groupCount))
        }
        onMouseOut={hideTip}
      >
        <Cell className="tag-border" />
        <Icon className="tag-icon" />
      </TagLink>
    </TagWrapper>
  );
};

export default TagList;
