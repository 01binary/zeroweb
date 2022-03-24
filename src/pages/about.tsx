/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  About page.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import React, { FC } from 'react';
import Title from '../components/Title';
import Summary from '../components/Summary';

const About: FC = () => (
  <main>
    <Title collection={'about'}>About</Title>
    <Summary>About text here</Summary>
  </main>
);

export default About;
