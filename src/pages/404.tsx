import React, { FC } from "react"
import { Link } from "gatsby"

const NotFound: FC = () => (
  <main>
    <title>Not Found</title>
    <h1>Page was not found</h1>

    <p>The specified page was not found</p>

    <Link to="/">Go home</Link>
  </main>
);

export default NotFound;
