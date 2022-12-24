import styled from 'styled-components';
import React, { FC, useCallback } from 'react';
import { PrintSection } from './Story.styles';
import Button from '../Button';
import PrintIcon from '../../images/print.svg';
import { openUrl } from '../../utils';
import { MOBILE } from '../../constants';

const StyledPrintIcon = styled(PrintIcon)`
  margin: ${(props) => props.theme.spacingQuarter};

  @media (max-width: ${MOBILE}) {
    display: none;
  }
`;

const Print: FC = () => {
  const handlePrint = useCallback(
    () =>
      openUrl(
        [
          'https://zeroweb-downloads.s3.us-west-2.amazonaws.com',
          'valeriy-novytskyy-cv-download.pdf',
        ].join('/')
      ),
    []
  );
  return (
    <PrintSection>
      <StyledPrintIcon />
      <Button shared onClick={handlePrint}>
        Print Page
      </Button>
    </PrintSection>
  );
};

export default Print;
