import React, { FunctionComponent } from "react"
import { Link } from "gatsby"

const NotFound: FunctionComponent = () => (
  <main>
    <title>Not Found</title>
    <h1>Page was not found</h1>

    The specified page was not found

    <Link to="/">Go home</Link>
  </main>
);

export default NotFound;
