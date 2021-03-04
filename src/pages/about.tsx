import React from 'react';
import styled from 'styled-components';
import Title from '../components/Title';

const Container = styled.div`
    padding-left: ${props => props.theme.spacingHalf};
`;

const About = () => (
    <main>
        <Title collection={"about"}>About</Title>
        <Container>About info here</Container>
    </main>
);

export default About;
