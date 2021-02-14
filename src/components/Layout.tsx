import React, { FunctionComponent } from 'react';
import SEO from './SEO';
import Header from './Header';

const Layout: FunctionComponent = ({ children }) => (
    <>
        <SEO />
        <Header />
        {children}
    </>
);

export default Layout;
