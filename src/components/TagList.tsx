import React, { FC } from 'react';
import styled from 'styled-components';
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

const ICON_SIZE = 36;
const CELL_WIDTH = 44;
const CELL_HEIGHT = 38;

type CellOffset = {
  x: number,
  y: number
};

const PATTERN: CellOffset[] = [
  { x: 0, y: 37 },
  { x: 32, y: 55.5 },
  { x: 64, y: 37 },
  { x: 96, y: 55.5 },
  { x: 0, y: 74 },
  { x: 96, y: 18.5 },
  { x: 32, y: 18.5 },
  { x: 64, y: 74 },
  { x: 0, y: 0 },
  { x: 64, y: 0 }
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

const TagListWrapper = styled.ul`
  position: relative;
  list-style-type: none;
  margin-top: -${CELL_HEIGHT / 2}px;
  height: ${props => props.height}px;
  width: 140px;
`;

const TagWrapper = styled.li`
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
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

interface TagListProps {
  tags: string[]
};

const TagList: FC<TagListProps> = ({
  tags
}) => {
  const denorm = tags.map(denormalizeTag);
  const height = denorm.reduce((acc, { y }) => Math.max(acc, y), 0) + CELL_HEIGHT;

  return (
    <TagListWrapper height={height}>
      {denorm.map(({ id, x, y, icon: Icon }) =>
        <TagWrapper key={id} x={x} y={y}>
          <Cell className="tag-border" />
          <Icon className="tag-icon" />
        </TagWrapper>
      )}
    </TagListWrapper>
  );
};

export default TagList;
