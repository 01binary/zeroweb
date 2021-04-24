let comments = [
  {
    slug: 'test',
    user: 'tom',
    timestamp: new Date().getUTCDate(),
    markdown: 'hello, *world*!',
    paragraph: 'abc',
    rangeStart: 0,
    rangeLength: 10,
    votes: 2,
  },
  {
    slug: 'test',
    user: 'berry',
    timestamp: new Date().getUTCDate(),
    markdown: 'another comment here',
    paragraph: 'xyz',
    rangeStart: 5,
    rangeLength: 20,
    votes: 0,
  }
];

export const getComments = (slugFilter) => (
  comments.filter(({ slug }) => slug == slugFilter)
);

export const addComment = (
  slug,
  user,
  timestamp,
  markdown,
  paragraph,
  rangeStart,
  rangeLength
) => {
  const comment = {
    slug,
    user,
    timestamp,
    markdown,
    paragraph,
    rangeStart,
    rangeLength,
    votes: 0,
  };

  comments.push(comment);

  return comment;
};
