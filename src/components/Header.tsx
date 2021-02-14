import React, { FunctionComponent } from 'react';
import { Link } from 'gatsby';

const Header: FunctionComponent = () => (
    <header>
      <h1>01 Binary</h1>

      <nav>
        <ul>
          <li><Link to="/">articles</Link></li>
          <li><Link to="/projects">projects</Link></li>
          <li><Link to="/about">about</Link></li>
        </ul>
      </nav>
    </header>
);

export default Header;
