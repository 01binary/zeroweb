import React, { FunctionComponent } from 'react';
import { RouteComponentProps } from "@reach/router"
import SEO from './SEO';
import Header from './Header';

const Layout: FunctionComponent<RouteComponentProps> = ({
    children,
    location }) => (
    <>
        <SEO />
        <Header path={location.pathname} />
        {children}
    </>
);

export default Layout;
