import React from 'react';
import styled from 'styled-components';
import Title from '../components/Title';

const Text = styled.p`
    margin-left: ${props => props.theme.spacingHalf};
    margin-right: ${props => props.theme.spacingHalf};
`;

const Content = styled.main`
`;

const About = () => (
    <Content>
        <Title collection={"about"}>About</Title>
        <Text>About info here</Text>
    </Content>
);

export default About;
