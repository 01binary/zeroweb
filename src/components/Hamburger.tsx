import React, { FunctionComponent, useContext } from 'react';
import styled from 'styled-components';
import { ThemeContext } from './ThemeContext';

const HamburgerButton = styled.input.attrs(
    () => ({
        id: 'hamburger',
        type: 'checkbox'
    })
)`
    display: none;
`;

const HamburgerLabel = styled.label.attrs(
    () => ({
        htmlFor: 'hamburger'
    })
)`
    display: none;
  
    @media (max-width: ${props => props.theme.mobile}) {
      transition: opacity ${props => props.theme.animationFast} ease-out;
      opacity: .6;
  
      .fill-foreground {
        fill: ${props => props.theme.foregroundColor} !important;
      }

      .stroke-foreground {
        stroke: ${props => props.theme.foregroundColor} !important;
      }
  
      &:hover {
        opacity: 1;
        .fill-foreground {
          fill: ${props => props.theme.focusColor};
        }
        .stroke-foreground {
          stroke: ${props => props.theme.focusColor};
        }
      }
  
      display: block;
      position: fixed;
      top: 0;
      right: 0;
      width: ${props => props.theme.spacingDouble};
      height: ${props => props.theme.spacingDouble};
      cursor: pointer;
    }
`;

const HamburgerIcon = styled.svg`
    position: relative;
    left: calc(${props => props.theme.spacingDouble} / 2 - 12px);
    top: calc(${props => props.theme.spacingDouble} / 2 - 12px);

    .clipped {
        clip-path: inset(0px 0px 0px 0px);
    }

    .wave {
        animation: loop 1s linear infinite;
        
        @keyframes loop {
        0% {
            transform: translateX(0);
        }

        25% {
            transform: translateX(-8px);
        }

        50% {
            transform: translateX(-24px);
        }

        100% {
            transform: translateX(-48px);
        }
        }
    }

    .close-first, .close-second {
        transition:
        opacity .3s ease-out,
        transform .3s ease-out;
        transform-origin: center;
        opacity: ${props => props.menuOpen ? 1 : 0};
    }

    .wave, .fr {
        transition: opacity .3s ease-out;
        opacity: ${props => props.menuOpen ? 0 : 1};
    }

    .close-first {
        transform: rotateZ(${props => props.menuOpen ? '0deg' : '45deg'});
    }

    .close-second {
        transform: rotateZ(${props => props.menuOpen ? '0deg' : '-45deg'});
    }
`;

interface IHamburgerProps {
    menuOpen: boolean,
    showMenu: React.Dispatch<React.SetStateAction<boolean>>
}

const Hamburger: FunctionComponent<IHamburgerProps> = ({
    menuOpen,
    showMenu
}) => {
    const { theme } = useContext(ThemeContext);
    return (
        <>
            <HamburgerButton />
            <HamburgerLabel menuOpen={menuOpen} onClick={() => showMenu(!menuOpen)} theme={theme}>
            <HamburgerIcon width="24px" height="24px" viewBox="0 0 24 24" menuOpen={menuOpen} theme={theme}>
                <g className="clipped">
                    <path className="fill-foreground wave" d="M60.6,10.2C57.5,8.1,54.3,6,48,6s-9.5,2.1-12.6,4.2c-3,2-5.7,3.8-11.4,3.8s-8.5-1.9-11.4-3.8C9.5,8.1,6.3,6,0,6v2
                        c5.7,0,8.5,1.9,11.4,3.8c3.1,2,6.3,4.2,12.6,4.2s9.5-2.1,12.6-4.2c3-2,5.7-3.8,11.4-3.8s8.5,1.9,11.4,3.8c3.1,2,6.3,4.2,12.6,4.2v-2
                        C66.3,14,63.5,12.1,60.6,10.2z"/>
                    <rect className="fill-foreground fr" y="2" width="24" height="2"/>
                    <rect className="fill-foreground fr" y="18" width="24" height="2"/>
                    <line className="stroke-foreground close-first" strokeWidth="2.5" x1="22" y1="2" x2="2" y2="22"/>
                    <line className="stroke-foreground close-second" strokeWidth="2.5" x1="2" y1="2" x2="22" y2="22"/>
                </g>
            </HamburgerIcon>
            </HamburgerLabel>
        </>
    );
};

export default Hamburger;
