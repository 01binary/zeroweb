import React, { FC } from 'react';
import styled from 'styled-components';
import Title from '../components/Title';

const Text = styled.p`
    margin-left: ${props => props.theme.spacingHalf};
    margin-right: ${props => props.theme.spacingHalf};
`;

const Page = styled.main`
`;

const Content = styled.article`
    opacity: 0;
    animation: slideIn ${props => props.theme.animationSlow} .2s ease-out 1;
    animation-fill-mode: forwards;

    @keyframes slideIn {
        0% {
            opacity: 0;
            transform: translateY(8px)
        }

        100% {
            opacity: 1;
            transform: translateY(0px)
        }
    }
`;

const About: FC = () => (
    <Page>
        <Title collection={"about"}>About</Title>
        <Content>
            <Text>About info here</Text>
        </Content>
    </Page>
);

export default About;
