import React from 'react';
import { Link } from 'gatsby';

const Header = () => (
    <header>
      <h1>01 Binary</h1>

      <nav>
        <Link to="/">articles</Link>
        <Link to="/projects">projects</Link>
        <Link to="/about">about</Link>
      </nav>
    </header>
);

export default Header;
