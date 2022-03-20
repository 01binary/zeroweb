type LogQuery = {
  slug: string;
  timeToRead: string;
  frontmatter: {
    title: string;
    description: string;
    relativeDate: string;
    date: string;
  };
  fields: {
    url: string;
  };
};

export default LogQuery;
