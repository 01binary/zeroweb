import React, { useContext } from 'react';
import styled from 'styled-components';
import Highlight, { defaultProps } from 'prism-react-renderer';
import { ThemeContext } from './ThemeContext';

const Pre = styled.pre`
    padding: 16px;
    font-size: ${props => props.theme.smallFontSize};
`;

const Code = (props: any) => {
    const className = props.children.props.className || '';
    const matches = className.match(/language-(?<lang>.*)/);
    const { theme } = useContext(ThemeContext);

    return (
        <Highlight
            {...defaultProps}
            code={props.children.props.children}
            language={
            matches && matches.groups && matches.groups.lang
                ? matches.groups.lang
                : ''
            }
        >
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <Pre className={className} style={style} theme={theme}>
                {tokens.map((line, i) => (
                <div {...getLineProps({ line, key: i })}>
                    {line.map((token, key) => (
                    <span {...getTokenProps({ token, key })} />
                    ))}
                </div>
                ))}
            </Pre>
            )}
        </Highlight>
    );
};

export default Code;
