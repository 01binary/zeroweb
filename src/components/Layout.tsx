import React, { FC, useContext } from 'react';
import { ThemeContext } from "styled-components";
import { RouteComponentProps } from '@reach/router';
import { GlobalStyle } from '../theme';
import SEO from './SEO';
import Header from './Header';

const Layout: FC<RouteComponentProps> = ({
    children,
    location
}) => {
    const theme = useContext(ThemeContext);
    return (
        <>
            <SEO />
            <GlobalStyle theme={theme} />
            <Header path={location.pathname} />
            {children}
        </>
    );
};

export default Layout;
