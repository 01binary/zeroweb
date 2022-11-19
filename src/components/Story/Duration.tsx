import React, { FC } from 'react';
import { formatDuration } from '../../utils';
import { Clock, DurationSection, Unit } from './Story.styles';

type DurationProps = {
  startDate: Date;
  endDate: Date;
  unit?: FC;
  noIcon?: boolean;
  align?: 'start' | 'end';
};

/**
 * Experience duration
 * @param props.startDate - The start date
 * @param props.endDate - The end date
 * @returns {JSX.Element} Experience duration section
 */
const Duration: FC<DurationProps> = ({
  startDate,
  endDate,
  unit: DisplayUnit = Unit,
  noIcon = false,
  align = 'end',
}) => {
  const duration = formatDuration(startDate, endDate);
  return (
    <DurationSection align={align}>
      {noIcon === false && <Clock />}
      <span>
        {duration.map(({ value, units }, index, parts) => (
          <span key={index}>
            <span>{value}</span>
            <DisplayUnit> {units}</DisplayUnit>
            {index < parts.length - 1 ? (
              <DisplayUnit>{', '}</DisplayUnit>
            ) : null}
          </span>
        ))}
      </span>
    </DurationSection>
  );
};

export default Duration;
