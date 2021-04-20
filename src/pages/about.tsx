import React, { FC } from 'react';
import Title from '../components/Title';
import Summary from '../components/Summary';

const About: FC = () => (
    <main>
        <Title collection={"about"}>About</Title>
        <Summary>About text here</Summary>
    </main>
);

export default About;
