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

const ICONS = {
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

const getTagIcon = (tag: string) => {
  const [ category, subCategory ] = tag.trim().split('-');
  const Icon = subCategory
    ? ICONS[category][subCategory]
    : ICONS[category];
  return <Icon className="tag-icon" />;
};

export const Tags = styled.ul`
  position: relative;
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
`;

const TagWrapper = styled.li`
  position: relative;
  flex: 44px 0 0;
  width: 44px;
  height: 38px;

  .tag-border {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }

  .tag-icon {
    position: absolute;
    left: ${(44 - 36) / 2}px;
    top: ${(38 - 36) / 2}px;
  }
`;

export const Tag: FC = ({
  children
}) => (
  <TagWrapper>
    <Cell className="tag-border" />
    {getTagIcon(children.toString())}
  </TagWrapper>
);
