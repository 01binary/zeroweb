import styled from 'styled-components';
import { MOBILE_MIN } from '../../constants';

const ROW_HEIGHT = 191.952;
const WIDE_WIDTH = 610.5;
const NARROW_WIDTH = 388.5;
const SPACING = 32;
const WIDE_MEDIA = `(max-width: ${WIDE_WIDTH + SPACING}px)`;

export const GalleryWrapper = styled.section`
  display: flex;
  flex-direction: column;

  margin: 0 auto;
  width: ${WIDE_WIDTH}px;
  padding-top: ${(props) => props.theme.spacingHalf};
  padding-bottom: ${(props) => props.theme.spacingOneAndHalf};

  svg {
    position: absolute;
    left: 0;
    top: 0;
  }

  @media ${WIDE_MEDIA} {
    width: ${NARROW_WIDTH}px;
  }

  @media (max-width: ${MOBILE_MIN}) {
    width: ${NARROW_WIDTH}px;
    margin: 0 calc(0px - ${(props) => props.theme.spacingHalf});
  }
`;

export const GalleryRow = styled.section`
  position: relative;
  width: 100%;
  height: ${ROW_HEIGHT}px;

  .border {
    pointer-events: none;
  }

  &:nth-child(even) {
    .border--even {
      display: block;
    }

    .border--odd {
      display: none;
    }

    .border--odd--middle {
      display: none;
    }
  }

  &:nth-child(odd) {
    .border--even {
      display: none;
    }

    .border--odd {
      display: none;
    }

    .border--odd--middle {
      display: block;
    }
  }

  &:nth-child(odd):last-child {
    .border--even {
      display: none;
    }

    .border--odd {
      display: block;
    }

    .border--odd--middle {
      display: none;
    }
  }

  @media ${WIDE_MEDIA} {
    .border--narrow {
      display: block;
    }

    .border--wide {
      display: none !important;
    }
  }
`;

export const GalleryError = styled(Error)`
  padding: ${(props) => props.theme.spacingHalf};
`;

export const GalleryLabel = styled.span`
  display: block;
  position: absolute;

  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;

  font-family: 'Roboto Mono', monospace;
  font-size: 18px;

  width: calc(111px - ${(props) => props.theme.spacingHalf});
  height: calc(64px - ${(props) => props.theme.spacingHalf});
  padding: ${(props) => props.theme.spacingQuarter};

  .focus {
    position: absolute;
    left: 0;
    top: calc(0px - ${SPACING}px);
    display: none;
  }

  &:hover {
    text-decoration: none;
  }

  &:focus {
    box-shadow: none;

    .focus {
      display: block;
    }
  }
`;

export const GalleryImageLink = styled.a`
  position: absolute;

  .hover {
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }

  .focus {
    display: none;
  }

  &:hover {
    .hover {
      opacity: 1;
    }
  }

  &:focus {
    box-shadow: none;
    border-radius: initial;

    .focus {
      display: block;
    }

    .border {
      display: none;
    }
  }
`;
