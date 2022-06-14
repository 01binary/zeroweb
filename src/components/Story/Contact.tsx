import React, { FC, useCallback } from 'react';
import { ContactSection, InlineContactButton } from './Story.styles';
import Button from '../Button';
import { openUrl } from '../../utils';

const Contact: FC<{ inline?: boolean }> = ({ inline }) => {
  const handleContact = useCallback(
    () =>
      openUrl('mailto:', {
        to: [['valeriy', 'novytskyy'].join('.'), 'outlook.com'].join('@'),
      }),
    []
  );
  return inline ? (
    <InlineContactButton shared onClick={handleContact}>
      Contact Me
    </InlineContactButton>
  ) : (
    <ContactSection>
      <Button shared onClick={handleContact}>
        Contact Me
      </Button>
    </ContactSection>
  );
};

export default Contact;
