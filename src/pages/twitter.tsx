/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Twitter sign-in redirect page.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import React, { FC } from 'react';
import Title from '../components/Title';
import Summary from '../components/Summary';

const About: FC = () => (
    <main>
        <Title collection={"about"}>Logging you in</Title>
        <Summary>
            Please wait while you are logging in with twitter
            {window.location.search}
            {document.cookie}
        </Summary>
    </main>
);

export default About;
